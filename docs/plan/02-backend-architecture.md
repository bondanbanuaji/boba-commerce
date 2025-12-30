# boba-commerce: Backend Architecture Specification

> **Version:** 1.0.0  
> **Last Updated:** 2024-12-30  
> **Author:** Principal Software Architect  
> **Status:** Draft - Pending Review

---

## Table of Contents

1. [Overview](#1-overview)
2. [Database Schema (ERD)](#2-database-schema-erd)
3. [Data Access Layer (DAL)](#3-data-access-layer-dal)
4. [Astro Actions & API Strategy](#4-astro-actions--api-strategy)
5. [Security & Middleware](#5-security--middleware)
6. [Infrastructure & Deployment](#6-infrastructure--deployment)

---

## 1. Overview

### 1.1 Backend Philosophy

boba-commerce adopts a **Server-First** architecture leveraging Astro's built-in capabilities:

- **Astro Actions**: Type-safe server mutations with Zod validation
- **Server Islands**: Personalized SSR content without blocking initial render
- **Edge-Ready**: Designed for Vercel's Edge Runtime where applicable
- **Database-Driven**: PostgreSQL via Supabase with Drizzle ORM

### 1.2 Technology Rationale

| Technology | Purpose | Justification |
|-----------|---------|---------------|
| **Supabase** | Database + Auth | Managed PostgreSQL, Row Level Security, Auth helpers |
| **Drizzle ORM** | Data modeling | Type-safe, lightweight, SQL-like syntax |
| **Astro Actions** | Server mutations | Built-in, type-safe, progressive enhancement |
| **Zod** | Validation | Runtime type checking, excellent TS integration |

---

## 2. Database Schema (ERD)

### 2.1 Entity Relationship Diagram

```mermaid
erDiagram
    USERS ||--o{ ORDERS : places
    USERS ||--o{ CART_ITEMS : has
    USERS ||--o{ ADDRESSES : has
    
    PRODUCTS ||--o{ PRODUCT_VARIANTS : has
    PRODUCTS ||--o{ PRODUCT_IMAGES : has
    PRODUCTS }o--|| CATEGORIES : belongs_to
    
    PRODUCT_VARIANTS ||--o{ CART_ITEMS : contains
    PRODUCT_VARIANTS ||--o{ ORDER_ITEMS : contains
    
    ORDERS ||--o{ ORDER_ITEMS : contains
    ORDERS ||--o| PAYMENTS : has
    ORDERS }o--|| ADDRESSES : ships_to
    
    CUSTOMIZATION_OPTIONS ||--o{ ORDER_ITEM_CUSTOMIZATIONS : applied_to
    ORDER_ITEMS ||--o{ ORDER_ITEM_CUSTOMIZATIONS : has

    USERS {
        uuid id PK
        string email UK
        string full_name
        string avatar_url
        enum role
        timestamp created_at
        timestamp updated_at
    }
    
    CATEGORIES {
        uuid id PK
        string name
        string slug UK
        string description
        string image_url
        int sort_order
        boolean is_active
    }
    
    PRODUCTS {
        uuid id PK
        uuid category_id FK
        string name
        string slug UK
        text description
        decimal base_price
        string featured_image
        boolean is_active
        boolean is_featured
        jsonb metadata
        timestamp created_at
        timestamp updated_at
    }
    
    PRODUCT_VARIANTS {
        uuid id PK
        uuid product_id FK
        string sku UK
        string name
        decimal price_modifier
        int stock_quantity
        boolean is_default
        boolean is_active
    }
    
    PRODUCT_IMAGES {
        uuid id PK
        uuid product_id FK
        string url
        string alt_text
        int sort_order
    }
    
    CUSTOMIZATION_OPTIONS {
        uuid id PK
        string category
        string name
        string display_name
        decimal price_modifier
        int sort_order
        boolean is_active
    }
    
    CART_ITEMS {
        uuid id PK
        uuid user_id FK
        uuid variant_id FK
        int quantity
        jsonb customizations
        timestamp created_at
        timestamp updated_at
    }
    
    ADDRESSES {
        uuid id PK
        uuid user_id FK
        string label
        string full_name
        string phone
        string street_address
        string city
        string state
        string postal_code
        string country
        boolean is_default
    }
    
    ORDERS {
        uuid id PK
        uuid user_id FK
        uuid shipping_address_id FK
        string order_number UK
        enum status
        decimal subtotal
        decimal tax_amount
        decimal shipping_amount
        decimal discount_amount
        decimal total_amount
        text notes
        timestamp created_at
        timestamp updated_at
    }
    
    ORDER_ITEMS {
        uuid id PK
        uuid order_id FK
        uuid variant_id FK
        string product_name
        string variant_name
        decimal unit_price
        int quantity
        decimal total_price
    }
    
    ORDER_ITEM_CUSTOMIZATIONS {
        uuid id PK
        uuid order_item_id FK
        uuid customization_id FK
        string customization_name
        decimal price_modifier
    }
    
    PAYMENTS {
        uuid id PK
        uuid order_id FK
        string provider
        string provider_payment_id
        enum status
        decimal amount
        string currency
        jsonb metadata
        timestamp created_at
    }
```

### 2.2 Drizzle Schema Definitions

```typescript
// src/lib/db/schema/users.ts
import { pgTable, uuid, text, varchar, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['customer', 'admin', 'super_admin']);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  fullName: varchar('full_name', { length: 255 }),
  avatarUrl: text('avatar_url'),
  role: userRoleEnum('role').default('customer').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
```

```typescript
// src/lib/db/schema/products.ts
import { pgTable, uuid, varchar, text, decimal, boolean, integer, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  sortOrder: integer('sort_order').default(0),
  isActive: boolean('is_active').default(true),
});

export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  categoryId: uuid('category_id').references(() => categories.id),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  description: text('description'),
  basePrice: decimal('base_price', { precision: 10, scale: 2 }).notNull(),
  featuredImage: text('featured_image'),
  isActive: boolean('is_active').default(true),
  isFeatured: boolean('is_featured').default(false),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const productVariants = pgTable('product_variants', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').references(() => products.id).notNull(),
  sku: varchar('sku', { length: 100 }).unique().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  priceModifier: decimal('price_modifier', { precision: 10, scale: 2 }).default('0'),
  stockQuantity: integer('stock_quantity').default(0),
  isDefault: boolean('is_default').default(false),
  isActive: boolean('is_active').default(true),
});

export const productImages = pgTable('product_images', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').references(() => products.id).notNull(),
  url: text('url').notNull(),
  altText: varchar('alt_text', { length: 255 }),
  sortOrder: integer('sort_order').default(0),
});

// Boba-specific customizations
export const customizationOptions = pgTable('customization_options', {
  id: uuid('id').primaryKey().defaultRandom(),
  category: varchar('category', { length: 50 }).notNull(), // 'sugar_level', 'ice_level', 'topping'
  name: varchar('name', { length: 100 }).notNull(),
  displayName: varchar('display_name', { length: 100 }).notNull(),
  priceModifier: decimal('price_modifier', { precision: 10, scale: 2 }).default('0'),
  sortOrder: integer('sort_order').default(0),
  isActive: boolean('is_active').default(true),
});

// Relations
export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  variants: many(productVariants),
  images: many(productImages),
}));

export const productVariantsRelations = relations(productVariants, ({ one }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
}));
```

```typescript
// src/lib/db/schema/cart.ts
import { pgTable, uuid, integer, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { productVariants } from './products';

export const cartItems = pgTable('cart_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  variantId: uuid('variant_id').references(() => productVariants.id).notNull(),
  quantity: integer('quantity').default(1).notNull(),
  customizations: jsonb('customizations').$type<{
    sugarLevel?: string;
    iceLevel?: string;
    toppings?: string[];
  }>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  user: one(users, {
    fields: [cartItems.userId],
    references: [users.id],
  }),
  variant: one(productVariants, {
    fields: [cartItems.variantId],
    references: [productVariants.id],
  }),
}));
```

```typescript
// src/lib/db/schema/orders.ts
import { pgTable, uuid, varchar, text, decimal, integer, timestamp, pgEnum, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { productVariants, customizationOptions } from './products';

export const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'confirmed',
  'preparing',
  'ready',
  'out_for_delivery',
  'delivered',
  'cancelled',
  'refunded'
]);

export const paymentStatusEnum = pgEnum('payment_status', [
  'pending',
  'processing',
  'succeeded',
  'failed',
  'cancelled',
  'refunded'
]);

export const addresses = pgTable('addresses', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  label: varchar('label', { length: 50 }),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  streetAddress: text('street_address').notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 100 }),
  postalCode: varchar('postal_code', { length: 20 }).notNull(),
  country: varchar('country', { length: 100 }).default('Indonesia'),
  isDefault: boolean('is_default').default(false),
});

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  shippingAddressId: uuid('shipping_address_id').references(() => addresses.id),
  orderNumber: varchar('order_number', { length: 50 }).unique().notNull(),
  status: orderStatusEnum('status').default('pending').notNull(),
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
  taxAmount: decimal('tax_amount', { precision: 10, scale: 2 }).default('0'),
  shippingAmount: decimal('shipping_amount', { precision: 10, scale: 2 }).default('0'),
  discountAmount: decimal('discount_amount', { precision: 10, scale: 2 }).default('0'),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').references(() => orders.id).notNull(),
  variantId: uuid('variant_id').references(() => productVariants.id).notNull(),
  productName: varchar('product_name', { length: 255 }).notNull(),
  variantName: varchar('variant_name', { length: 255 }).notNull(),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  quantity: integer('quantity').notNull(),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
});

export const orderItemCustomizations = pgTable('order_item_customizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderItemId: uuid('order_item_id').references(() => orderItems.id).notNull(),
  customizationId: uuid('customization_id').references(() => customizationOptions.id),
  customizationName: varchar('customization_name', { length: 100 }).notNull(),
  priceModifier: decimal('price_modifier', { precision: 10, scale: 2 }).default('0'),
});

export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').references(() => orders.id).notNull(),
  provider: varchar('provider', { length: 50 }).notNull(),
  providerPaymentId: varchar('provider_payment_id', { length: 255 }),
  status: paymentStatusEnum('status').default('pending').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('IDR'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  shippingAddress: one(addresses, { fields: [orders.shippingAddressId], references: [addresses.id] }),
  items: many(orderItems),
  payment: one(payments),
}));
```

### 2.3 Database Indexes

```typescript
// src/lib/db/schema/indexes.ts
import { index } from 'drizzle-orm/pg-core';
import { products, productVariants, orders, orderItems, cartItems } from './';

// Product indexes for search and filtering
export const productIndexes = {
  categoryIdx: index('products_category_idx').on(products.categoryId),
  slugIdx: index('products_slug_idx').on(products.slug),
  activeIdx: index('products_active_idx').on(products.isActive),
  featuredIdx: index('products_featured_idx').on(products.isFeatured),
};

// Variant indexes
export const variantIndexes = {
  productIdx: index('variants_product_idx').on(productVariants.productId),
  skuIdx: index('variants_sku_idx').on(productVariants.sku),
};

// Order indexes for dashboard queries
export const orderIndexes = {
  userIdx: index('orders_user_idx').on(orders.userId),
  statusIdx: index('orders_status_idx').on(orders.status),
  createdAtIdx: index('orders_created_at_idx').on(orders.createdAt),
  orderNumberIdx: index('orders_number_idx').on(orders.orderNumber),
};

// Cart indexes
export const cartIndexes = {
  userIdx: index('cart_user_idx').on(cartItems.userId),
  userVariantIdx: index('cart_user_variant_idx').on(cartItems.userId, cartItems.variantId),
};
```

### 2.4 Seed Data: Customization Options

```typescript
// drizzle/seed/customizations.ts
export const customizationSeed = [
  // Sugar Levels
  { category: 'sugar_level', name: 'no_sugar', displayName: '0% Sugar', priceModifier: 0, sortOrder: 1 },
  { category: 'sugar_level', name: 'light_sugar', displayName: '25% Sugar', priceModifier: 0, sortOrder: 2 },
  { category: 'sugar_level', name: 'half_sugar', displayName: '50% Sugar', priceModifier: 0, sortOrder: 3 },
  { category: 'sugar_level', name: 'less_sugar', displayName: '75% Sugar', priceModifier: 0, sortOrder: 4 },
  { category: 'sugar_level', name: 'normal_sugar', displayName: '100% Sugar', priceModifier: 0, sortOrder: 5 },
  
  // Ice Levels
  { category: 'ice_level', name: 'no_ice', displayName: 'No Ice', priceModifier: 0, sortOrder: 1 },
  { category: 'ice_level', name: 'less_ice', displayName: 'Less Ice', priceModifier: 0, sortOrder: 2 },
  { category: 'ice_level', name: 'normal_ice', displayName: 'Normal Ice', priceModifier: 0, sortOrder: 3 },
  { category: 'ice_level', name: 'extra_ice', displayName: 'Extra Ice', priceModifier: 0, sortOrder: 4 },
  
  // Toppings
  { category: 'topping', name: 'tapioca_pearl', displayName: 'Tapioca Pearls', priceModifier: 5000, sortOrder: 1 },
  { category: 'topping', name: 'coconut_jelly', displayName: 'Coconut Jelly', priceModifier: 5000, sortOrder: 2 },
  { category: 'topping', name: 'aloe_vera', displayName: 'Aloe Vera', priceModifier: 6000, sortOrder: 3 },
  { category: 'topping', name: 'pudding', displayName: 'Pudding', priceModifier: 7000, sortOrder: 4 },
  { category: 'topping', name: 'red_bean', displayName: 'Red Bean', priceModifier: 6000, sortOrder: 5 },
  { category: 'topping', name: 'cheese_foam', displayName: 'Cheese Foam', priceModifier: 10000, sortOrder: 6 },
];
```

---

## 3. Data Access Layer (DAL)

### 3.1 Architecture Overview

```mermaid
graph TB
    subgraph "Presentation Layer"
        A[Astro Pages]
        B[React Islands]
    end
    
    subgraph "API Layer"
        C[Astro Actions]
        D[API Routes]
    end
    
    subgraph "Data Access Layer"
        E[Query Functions]
        F[Mutation Functions]
    end
    
    subgraph "Database"
        G[(Supabase PostgreSQL)]
    end
    
    A --> C
    B --> C
    A --> D
    C --> E
    C --> F
    D --> E
    D --> F
    E --> G
    F --> G
    
    style E fill:#22c55e
    style F fill:#f59e0b
```

### 3.2 Query Function Pattern

```typescript
// src/lib/db/queries/products.ts
import { db } from '../client';
import { products, productVariants, productImages, categories } from '../schema';
import { eq, and, desc, sql, ilike } from 'drizzle-orm';

export async function getProductBySlug(slug: string) {
  const result = await db.query.products.findFirst({
    where: and(
      eq(products.slug, slug),
      eq(products.isActive, true)
    ),
    with: {
      category: true,
      variants: {
        where: eq(productVariants.isActive, true),
        orderBy: [desc(productVariants.isDefault)],
      },
      images: {
        orderBy: [productImages.sortOrder],
      },
    },
  });
  
  return result;
}

export async function getProductsWithFilters(options: {
  categorySlug?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'popular';
}) {
  const { categorySlug, search, page = 1, limit = 12, sortBy = 'newest' } = options;
  const offset = (page - 1) * limit;
  
  const conditions = [eq(products.isActive, true)];
  
  if (categorySlug) {
    const category = await db.query.categories.findFirst({
      where: eq(categories.slug, categorySlug),
    });
    if (category) {
      conditions.push(eq(products.categoryId, category.id));
    }
  }
  
  if (search) {
    conditions.push(ilike(products.name, `%${search}%`));
  }
  
  const orderBy = {
    price_asc: [products.basePrice],
    price_desc: [desc(products.basePrice)],
    newest: [desc(products.createdAt)],
    popular: [desc(products.isFeatured), desc(products.createdAt)],
  }[sortBy];
  
  const [items, countResult] = await Promise.all([
    db.query.products.findMany({
      where: and(...conditions),
      with: {
        category: true,
        variants: {
          where: eq(productVariants.isDefault, true),
          limit: 1,
        },
      },
      orderBy,
      limit,
      offset,
    }),
    db.select({ count: sql<number>`count(*)` })
      .from(products)
      .where(and(...conditions)),
  ]);
  
  return {
    items,
    pagination: {
      page,
      limit,
      total: Number(countResult[0].count),
      totalPages: Math.ceil(Number(countResult[0].count) / limit),
    },
  };
}

export async function getFeaturedProducts(limit = 8) {
  return db.query.products.findMany({
    where: and(
      eq(products.isActive, true),
      eq(products.isFeatured, true)
    ),
    with: {
      category: true,
      variants: {
        where: eq(productVariants.isDefault, true),
        limit: 1,
      },
    },
    orderBy: [desc(products.createdAt)],
    limit,
  });
}
```

```typescript
// src/lib/db/queries/cart.ts
import { db } from '../client';
import { cartItems, productVariants, products } from '../schema';
import { eq, and } from 'drizzle-orm';

export async function getUserCart(userId: string) {
  return db.query.cartItems.findMany({
    where: eq(cartItems.userId, userId),
    with: {
      variant: {
        with: {
          product: {
            columns: {
              id: true,
              name: true,
              slug: true,
              featuredImage: true,
              basePrice: true,
            },
          },
        },
      },
    },
    orderBy: [cartItems.createdAt],
  });
}

export async function getCartItemCount(userId: string): Promise<number> {
  const items = await db.query.cartItems.findMany({
    where: eq(cartItems.userId, userId),
    columns: { quantity: true },
  });
  
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
```

### 3.3 Server Islands for Dynamic Content

```astro
---
// src/components/server-islands/UserProfileWidget.astro
import { getUser } from '@lib/supabase/auth';
import { getUserOrderStats } from '@lib/db/queries/orders';

const user = await getUser(Astro);
let orderStats = null;

if (user) {
  orderStats = await getUserOrderStats(user.id);
}
---

{user ? (
  <div class="flex items-center gap-3 p-4 bg-boba-cream rounded-lg">
    <img 
      src={user.avatarUrl || '/images/default-avatar.png'} 
      alt={user.fullName}
      class="w-10 h-10 rounded-full"
    />
    <div>
      <p class="font-medium text-boba-primary">{user.fullName}</p>
      <p class="text-sm text-gray-600">
        {orderStats?.totalOrders || 0} orders
      </p>
    </div>
  </div>
) : (
  <a href="/auth/login" class="btn btn-primary">
    Sign In
  </a>
)}
```

Usage with `server:defer`:

```astro
---
// src/layouts/ShopLayout.astro
import UserProfileWidget from '@components/server-islands/UserProfileWidget.astro';
---

<header>
  <UserProfileWidget server:defer>
    <div slot="fallback" class="animate-pulse">
      <div class="w-10 h-10 bg-gray-200 rounded-full" />
    </div>
  </UserProfileWidget>
</header>
```

---

## 4. Astro Actions & API Strategy

### 4.1 Action Registry

```typescript
// src/actions/index.ts
import { cart } from './cart';
import { auth } from './auth';
import { checkout } from './checkout';
import { admin } from './admin';

export const server = {
  cart,
  auth,
  checkout,
  admin,
};
```

### 4.2 Complete Action Definitions

#### Cart Actions

```typescript
// src/actions/cart.ts
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { db } from '@lib/db/client';
import { cartItems } from '@lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getUser } from '@lib/supabase/auth';

const customizationsSchema = z.object({
  sugarLevel: z.string().optional(),
  iceLevel: z.string().optional(),
  toppings: z.array(z.string()).optional(),
});

export const cart = {
  addItem: defineAction({
    accept: 'form',
    input: z.object({
      variantId: z.string().uuid(),
      quantity: z.coerce.number().int().min(1).max(10),
      customizations: customizationsSchema.optional(),
    }),
    handler: async (input, context) => {
      const user = await getUser(context);
      if (!user) {
        throw new Error('Authentication required');
      }
      
      // Check if item already exists
      const existing = await db.query.cartItems.findFirst({
        where: and(
          eq(cartItems.userId, user.id),
          eq(cartItems.variantId, input.variantId)
        ),
      });
      
      if (existing) {
        // Update quantity
        await db.update(cartItems)
          .set({ 
            quantity: existing.quantity + input.quantity,
            customizations: input.customizations,
            updatedAt: new Date(),
          })
          .where(eq(cartItems.id, existing.id));
      } else {
        // Insert new item
        await db.insert(cartItems).values({
          userId: user.id,
          variantId: input.variantId,
          quantity: input.quantity,
          customizations: input.customizations,
        });
      }
      
      return { success: true };
    },
  }),
  
  updateQuantity: defineAction({
    accept: 'json',
    input: z.object({
      cartItemId: z.string().uuid(),
      quantity: z.coerce.number().int().min(0).max(10),
    }),
    handler: async (input, context) => {
      const user = await getUser(context);
      if (!user) throw new Error('Authentication required');
      
      if (input.quantity === 0) {
        await db.delete(cartItems)
          .where(and(
            eq(cartItems.id, input.cartItemId),
            eq(cartItems.userId, user.id)
          ));
      } else {
        await db.update(cartItems)
          .set({ quantity: input.quantity, updatedAt: new Date() })
          .where(and(
            eq(cartItems.id, input.cartItemId),
            eq(cartItems.userId, user.id)
          ));
      }
      
      return { success: true };
    },
  }),
  
  removeItem: defineAction({
    accept: 'json',
    input: z.object({
      cartItemId: z.string().uuid(),
    }),
    handler: async (input, context) => {
      const user = await getUser(context);
      if (!user) throw new Error('Authentication required');
      
      await db.delete(cartItems)
        .where(and(
          eq(cartItems.id, input.cartItemId),
          eq(cartItems.userId, user.id)
        ));
      
      return { success: true };
    },
  }),
  
  clear: defineAction({
    accept: 'json',
    input: z.object({}),
    handler: async (_, context) => {
      const user = await getUser(context);
      if (!user) throw new Error('Authentication required');
      
      await db.delete(cartItems)
        .where(eq(cartItems.userId, user.id));
      
      return { success: true };
    },
  }),
};
```

#### Authentication Actions

```typescript
// src/actions/auth.ts
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { supabase } from '@lib/supabase/client';

export const auth = {
  login: defineAction({
    accept: 'form',
    input: z.object({
      email: z.string().email('Invalid email address'),
      password: z.string().min(8, 'Password must be at least 8 characters'),
    }),
    handler: async (input) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: input.email,
        password: input.password,
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      return { 
        success: true, 
        user: data.user,
        redirectTo: '/account',
      };
    },
  }),
  
  register: defineAction({
    accept: 'form',
    input: z.object({
      email: z.string().email('Invalid email address'),
      password: z.string().min(8, 'Password must be at least 8 characters'),
      fullName: z.string().min(2, 'Name must be at least 2 characters'),
    }),
    handler: async (input) => {
      const { data, error } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          data: {
            full_name: input.fullName,
          },
        },
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      return { 
        success: true,
        requiresVerification: !data.session,
      };
    },
  }),
  
  logout: defineAction({
    accept: 'json',
    input: z.object({}),
    handler: async () => {
      await supabase.auth.signOut();
      return { success: true, redirectTo: '/' };
    },
  }),
  
  resetPassword: defineAction({
    accept: 'form',
    input: z.object({
      email: z.string().email('Invalid email address'),
    }),
    handler: async (input) => {
      const { error } = await supabase.auth.resetPasswordForEmail(input.email, {
        redirectTo: `${import.meta.env.SITE_URL}/auth/update-password`,
      });
      
      if (error) throw new Error(error.message);
      
      return { success: true };
    },
  }),
};
```

#### Checkout Actions

```typescript
// src/actions/checkout.ts
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { db } from '@lib/db/client';
import { orders, orderItems, cartItems, payments } from '@lib/db/schema';
import { getUser } from '@lib/supabase/auth';
import { generateOrderNumber } from '@lib/utils/order';
import { calculateCartTotal } from '@lib/utils/cart';

const addressSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(10),
  streetAddress: z.string().min(5),
  city: z.string().min(2),
  state: z.string().optional(),
  postalCode: z.string().min(5),
  country: z.string().default('Indonesia'),
});

export const checkout = {
  initiate: defineAction({
    accept: 'json',
    input: z.object({
      shippingAddress: addressSchema,
      notes: z.string().optional(),
    }),
    handler: async (input, context) => {
      const user = await getUser(context);
      if (!user) throw new Error('Authentication required');
      
      // Get cart items
      const cart = await db.query.cartItems.findMany({
        where: eq(cartItems.userId, user.id),
        with: {
          variant: {
            with: { product: true },
          },
        },
      });
      
      if (cart.length === 0) {
        throw new Error('Cart is empty');
      }
      
      // Calculate totals
      const totals = calculateCartTotal(cart);
      
      // Create order in transaction
      const order = await db.transaction(async (tx) => {
        // Create order
        const [newOrder] = await tx.insert(orders).values({
          userId: user.id,
          orderNumber: generateOrderNumber(),
          status: 'pending',
          subtotal: totals.subtotal.toString(),
          taxAmount: totals.tax.toString(),
          shippingAmount: totals.shipping.toString(),
          totalAmount: totals.total.toString(),
          notes: input.notes,
        }).returning();
        
        // Create order items
        await tx.insert(orderItems).values(
          cart.map((item) => ({
            orderId: newOrder.id,
            variantId: item.variantId,
            productName: item.variant.product.name,
            variantName: item.variant.name,
            unitPrice: item.variant.product.basePrice,
            quantity: item.quantity,
            totalPrice: (
              Number(item.variant.product.basePrice) * item.quantity
            ).toString(),
          }))
        );
        
        // Clear cart
        await tx.delete(cartItems).where(eq(cartItems.userId, user.id));
        
        return newOrder;
      });
      
      return {
        success: true,
        orderId: order.id,
        orderNumber: order.orderNumber,
      };
    },
  }),
  
  processPayment: defineAction({
    accept: 'json',
    input: z.object({
      orderId: z.string().uuid(),
      paymentMethod: z.enum(['bank_transfer', 'e_wallet', 'cod']),
    }),
    handler: async (input, context) => {
      const user = await getUser(context);
      if (!user) throw new Error('Authentication required');
      
      // Verify order belongs to user
      const order = await db.query.orders.findFirst({
        where: and(
          eq(orders.id, input.orderId),
          eq(orders.userId, user.id)
        ),
      });
      
      if (!order) throw new Error('Order not found');
      
      // Create payment record
      const [payment] = await db.insert(payments).values({
        orderId: order.id,
        provider: input.paymentMethod,
        status: 'pending',
        amount: order.totalAmount,
        currency: 'IDR',
      }).returning();
      
      // Update order status
      await db.update(orders)
        .set({ status: 'confirmed', updatedAt: new Date() })
        .where(eq(orders.id, order.id));
      
      return {
        success: true,
        paymentId: payment.id,
        redirectTo: `/checkout/success?order=${order.orderNumber}`,
      };
    },
  }),
};
```

### 4.3 Validation Pipeline

```mermaid
flowchart LR
    A[Client Request] --> B{Zod Validation}
    B -->|Invalid| C[Return ValidationError]
    B -->|Valid| D{Auth Check}
    D -->|Unauthorized| E[Return AuthError]
    D -->|Authorized| F[Business Logic]
    F -->|Success| G[Return Data]
    F -->|Failure| H[Return ActionError]
    
    style C fill:#ef4444
    style E fill:#ef4444
    style H fill:#ef4444
    style G fill:#22c55e
```

### 4.4 Error Handling Strategy

```typescript
// src/lib/errors.ts
import { ActionError } from 'astro:actions';

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleActionError(error: unknown): never {
  if (error instanceof AppError) {
    throw new ActionError({
      code: error.code as any,
      message: error.message,
    });
  }
  
  if (error instanceof Error) {
    // Log to monitoring service
    console.error('Action error:', error);
    
    throw new ActionError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    });
  }
  
  throw new ActionError({
    code: 'UNKNOWN_ERROR',
    message: 'An unknown error occurred',
  });
}
```

Client-side error handling:

```tsx
// Usage in React component
import { actions } from 'astro:actions';

async function handleAddToCart(variantId: string) {
  const { data, error } = await actions.cart.addItem({
    variantId,
    quantity: 1,
  });
  
  if (error) {
    // Handle specific error codes
    switch (error.code) {
      case 'UNAUTHORIZED':
        // Redirect to login
        window.location.href = '/auth/login?redirect=' + window.location.pathname;
        break;
      case 'BAD_REQUEST':
        // Show validation errors
        addToast({ type: 'error', message: error.message });
        break;
      default:
        addToast({ type: 'error', message: 'Something went wrong' });
    }
    return;
  }
  
  // Success
  addToast({ type: 'success', message: 'Added to cart!' });
}
```

---

## 5. Security & Middleware

### 5.1 Middleware Architecture

```typescript
// src/middleware.ts
import { defineMiddleware, sequence } from 'astro:middleware';
import { supabase } from '@lib/supabase/client';

// Rate limiting store (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

const authMiddleware = defineMiddleware(async (context, next) => {
  // Get session from cookies
  const accessToken = context.cookies.get('sb-access-token')?.value;
  const refreshToken = context.cookies.get('sb-refresh-token')?.value;
  
  if (accessToken && refreshToken) {
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (user && !error) {
      context.locals.user = user;
      context.locals.isAuthenticated = true;
    }
  }
  
  return next();
});

const protectedRoutesMiddleware = defineMiddleware(async (context, next) => {
  const protectedPaths = ['/account', '/checkout', '/admin'];
  const adminPaths = ['/admin'];
  
  const isProtected = protectedPaths.some(path => 
    context.url.pathname.startsWith(path)
  );
  const isAdminRoute = adminPaths.some(path => 
    context.url.pathname.startsWith(path)
  );
  
  if (isProtected && !context.locals.isAuthenticated) {
    return context.redirect(
      `/auth/login?redirect=${encodeURIComponent(context.url.pathname)}`
    );
  }
  
  if (isAdminRoute) {
    const user = context.locals.user;
    const isAdmin = user?.user_metadata?.role === 'admin' || 
                    user?.user_metadata?.role === 'super_admin';
    
    if (!isAdmin) {
      return new Response('Forbidden', { status: 403 });
    }
  }
  
  return next();
});

const securityHeadersMiddleware = defineMiddleware(async (context, next) => {
  const response = await next();
  
  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  if (import.meta.env.PROD) {
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline'; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: https:; " +
      "font-src 'self'; " +
      "connect-src 'self' https://*.supabase.co"
    );
  }
  
  return response;
});

const rateLimitMiddleware = defineMiddleware(async (context, next) => {
  // Only rate limit API routes
  if (!context.url.pathname.startsWith('/api')) {
    return next();
  }
  
  const clientIP = context.request.headers.get('x-forwarded-for') || 
                   context.clientAddress || 
                   'unknown';
  
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const maxRequests = 100;
  
  const record = rateLimitStore.get(clientIP);
  
  if (!record || now > record.resetAt) {
    rateLimitStore.set(clientIP, { count: 1, resetAt: now + windowMs });
    return next();
  }
  
  if (record.count >= maxRequests) {
    return new Response('Too Many Requests', { 
      status: 429,
      headers: {
        'Retry-After': Math.ceil((record.resetAt - now) / 1000).toString(),
      },
    });
  }
  
  record.count++;
  return next();
});

export const onRequest = sequence(
  authMiddleware,
  protectedRoutesMiddleware,
  securityHeadersMiddleware,
  rateLimitMiddleware
);
```

### 5.2 Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant C as Client
    participant M as Middleware
    participant A as Astro Action
    participant S as Supabase Auth
    participant DB as Database
    
    U->>C: Submit Login Form
    C->>A: actions.auth.login(credentials)
    A->>S: signInWithPassword()
    S-->>A: { user, session }
    A->>DB: Sync user profile
    A-->>C: { success, redirectTo }
    C->>C: Set auth cookies
    C->>U: Redirect to /account
    
    Note over M: Subsequent Requests
    U->>C: Visit /account
    C->>M: Request with cookies
    M->>S: getUser(accessToken)
    S-->>M: { user }
    M->>M: Set context.locals.user
    M->>A: Forward to page
    A-->>C: Protected content
```

### 5.3 Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

-- Users can only read/update their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Cart items: Users can only access their own cart
CREATE POLICY "Users can manage own cart" ON cart_items
  FOR ALL USING (auth.uid() = user_id);

-- Orders: Users can view their own orders
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

-- Addresses: Users can manage their own addresses
CREATE POLICY "Users can manage own addresses" ON addresses
  FOR ALL USING (auth.uid() = user_id);

-- Admin policies (using custom claims)
CREATE POLICY "Admins can view all orders" ON orders
  FOR SELECT USING (
    (SELECT (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'super_admin'))
  );

CREATE POLICY "Admins can update orders" ON orders
  FOR UPDATE USING (
    (SELECT (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'super_admin'))
  );
```

### 5.4 Environment Variables

```bash
# .env.example

# Supabase
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database (for Drizzle migrations)
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres

# Site
SITE_URL=http://localhost:4321
PUBLIC_SITE_NAME="Boba Commerce"

# Payment Gateway (future)
PAYMENT_GATEWAY_KEY=your-payment-key

# Vercel
VERCEL_URL=auto-populated-by-vercel
```

---

## 6. Infrastructure & Deployment

### 6.1 Vercel Configuration

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'server',
  adapter: vercel({
    imageService: true,
    isr: {
      // Enable ISR for product pages
      expiration: 60 * 60, // 1 hour
    },
  }),
  integrations: [
    react(),
    tailwind(),
  ],
  vite: {
    optimizeDeps: {
      exclude: ['@astrojs/react'],
    },
  },
});
```

### 6.2 Function Configuration

```json
// vercel.json
{
  "functions": {
    "src/pages/**/*.astro": {
      "memory": 1024,
      "maxDuration": 10
    },
    "src/actions/**/*.ts": {
      "memory": 512,
      "maxDuration": 10
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

### 6.3 Database Migration Strategy

```bash
# Package.json scripts
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio",
    "db:seed": "tsx drizzle/seed/index.ts"
  }
}
```

---

## Appendix: Action Reference Table

| Namespace | Action | Method | Auth Required | Description |
|-----------|--------|--------|---------------|-------------|
| `cart` | `addItem` | `form` | Yes | Add product variant to cart |
| `cart` | `updateQuantity` | `json` | Yes | Update cart item quantity |
| `cart` | `removeItem` | `json` | Yes | Remove item from cart |
| `cart` | `clear` | `json` | Yes | Clear entire cart |
| `auth` | `login` | `form` | No | User login |
| `auth` | `register` | `form` | No | User registration |
| `auth` | `logout` | `json` | Yes | User logout |
| `auth` | `resetPassword` | `form` | No | Password reset request |
| `checkout` | `initiate` | `json` | Yes | Create order from cart |
| `checkout` | `processPayment` | `json` | Yes | Process order payment |
| `admin` | `updateOrderStatus` | `json` | Admin | Update order status |
| `admin` | `createProduct` | `form` | Admin | Create new product |
| `admin` | `updateProduct` | `form` | Admin | Update product details |

---

> **Implementation Ready:** These specifications provide the foundation for building a production-grade e-commerce platform. Proceed with implementation following the patterns and structures defined in this document.
