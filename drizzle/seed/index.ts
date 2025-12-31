// drizzle/seed/index.ts
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from '../../src/lib/db/schema';
import { customizationOptions, categories, products, productVariants } from '../../src/lib/db/schema';
import { customizationSeed, categorySeed, productSeed } from './customizations';
import { eq } from 'drizzle-orm';

const { Pool } = pg;

async function seed() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
        console.error('❌ DATABASE_URL environment variable is required');
        process.exit(1);
    }

    console.log('🌱 Starting database seed...');

    const pool = new Pool({ connectionString });
    const db = drizzle(pool, { schema });

    try {
        // Seed customization options
        console.log('  📝 Seeding customization options...');
        for (const option of customizationSeed) {
            await db.insert(customizationOptions)
                .values(option)
                .onConflictDoNothing();
        }
        console.log(`  ✅ Inserted ${customizationSeed.length} customization options`);

        // Seed categories
        console.log('  📁 Seeding categories...');
        const insertedCategories: Record<string, string> = {};
        for (const category of categorySeed) {
            const [inserted] = await db.insert(categories)
                .values(category)
                .onConflictDoNothing()
                .returning();

            if (inserted) {
                insertedCategories[category.slug] = inserted.id;
            } else {
                // Get existing category ID
                const existing = await db.query.categories.findFirst({
                    where: eq(categories.slug, category.slug),
                });
                if (existing) {
                    insertedCategories[category.slug] = existing.id;
                }
            }
        }
        console.log(`  ✅ Inserted ${categorySeed.length} categories`);

        // Seed products with variants
        console.log('  🧋 Seeding products...');
        for (const product of productSeed) {
            const { categorySlug, variantName, variantSku, stockQuantity, ...productData } = product;
            const categoryId = insertedCategories[categorySlug];

            // Insert product
            const [insertedProduct] = await db.insert(products)
                .values({
                    ...productData,
                    categoryId,
                    isActive: true,
                })
                .onConflictDoNothing()
                .returning();

            if (insertedProduct) {
                // Insert default variant
                await db.insert(productVariants)
                    .values({
                        productId: insertedProduct.id,
                        name: variantName,
                        sku: variantSku,
                        stockQuantity,
                        isDefault: true,
                        isActive: true,
                    })
                    .onConflictDoNothing();
            }
        }
        console.log(`  ✅ Inserted ${productSeed.length} products with variants`);

        console.log('🎉 Database seeding completed successfully!');
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

seed();
