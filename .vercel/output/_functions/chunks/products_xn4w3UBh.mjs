const mockProducts = [
  {
    id: "1",
    name: "Classic Milk Tea Kit",
    slug: "classic-milk-tea-kit",
    description: "Everything you need to make authentic milk tea at home. Includes premium black tea leaves, non-dairy creamer, and our signature tapioca pearls.",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?auto=format&fit=crop&q=80&w=800",
    category: "kits",
    variants: [
      { id: "1-original", productId: "1", name: "Original", stock: 10, priceOffset: 0 },
      { id: "1-large", productId: "1", name: "Large Pack", stock: 5, priceOffset: 10 }
    ]
  },
  {
    id: "2",
    name: "Brown Sugar Boba",
    slug: "brown-sugar-boba",
    description: "Premium slow-cooked tapioca pearls in brown sugar syrup. Ready in 5 minutes.",
    price: 12.5,
    image: "https://images.unsplash.com/photo-1579888944880-d98341245702?auto=format&fit=crop&q=80&w=800",
    category: "toppings",
    variants: [
      { id: "2-single", productId: "2", name: "Single Pack", stock: 20 },
      { id: "2-triple", productId: "2", name: "Triple Pack", stock: 15, priceOffset: 20 }
    ]
  },
  {
    id: "3",
    name: "Taro Powder",
    slug: "taro-powder",
    description: "Rich and creamy premium taro flavor powder. Made from real taro root.",
    price: 18,
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80&w=800",
    category: "tea",
    variants: []
  },
  {
    id: "4",
    name: "Wide Boba Straws",
    slug: "wide-boba-straws",
    description: "Reusable stainless steel straws perfect for pearls. Comes with cleaning brush.",
    price: 8.99,
    image: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&q=80&w=800",
    category: "equipment",
    variants: [
      { id: "4-silver", productId: "4", name: "Silver", stock: 50 },
      { id: "4-gold", productId: "4", name: "Gold", stock: 30, priceOffset: 2 },
      { id: "4-rainbow", productId: "4", name: "Rainbow", stock: 0 }
    ]
  }
];
async function getProducts(category) {
  await new Promise((resolve) => setTimeout(resolve, 100));
  if (category) {
    return mockProducts.filter((p) => p.category === category);
  }
  return mockProducts;
}
async function getProductBySlug(slug) {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockProducts.find((p) => p.slug === slug);
}
async function getRelatedProducts(productId) {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockProducts.filter((p) => p.id !== productId).slice(0, 3);
}

export { getRelatedProducts as a, getProducts as b, getProductBySlug as g };
