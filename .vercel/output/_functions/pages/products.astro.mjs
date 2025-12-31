/* empty css                                 */
import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../chunks/astro/server_BOT567rp.mjs';
import 'piccolore';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_QRpTJ7ty.mjs';
import { $ as $$ProductCard } from '../chunks/ProductCard_BEM4EqSH.mjs';
import { b as getProducts } from '../chunks/products_xn4w3UBh.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const category = Astro2.url.searchParams.get("category") || void 0;
  const products = await getProducts(category);
  const categories = [
    { label: "All", value: void 0 },
    { label: "Tea", value: "tea" },
    { label: "Toppings", value: "toppings" },
    { label: "Equipment", value: "equipment" },
    { label: "Kits", value: "kits" }
  ];
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Shop | Boba Commerce" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mb-8"> <h1 class="text-4xl font-display font-bold text-gray-900 mb-4">Shop Best Sellers</h1> <p class="text-gray-600">Explore our premium selection of boba tea supplies.</p> </div> <div class="flex gap-2 mb-8 overflow-x-auto pb-2"> ${categories.map((cat) => renderTemplate`<a${addAttribute(cat.value ? `/products?category=${cat.value}` : "/products", "href")}${addAttribute(`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap
          ${category === cat.value ? "bg-boba-primary text-white" : "bg-white text-gray-600 hover:bg-gray-100"}`, "class")}> ${cat.label} </a>`)} </div> ${products.length > 0 ? renderTemplate`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"> ${products.map((product) => renderTemplate`${renderComponent($$result2, "ProductCard", $$ProductCard, { "product": product })}`)} </div>` : renderTemplate`<div class="text-center py-24 text-gray-500"> <p class="text-xl">No products found in this category.</p> <a href="/products" class="text-boba-primary hover:underline mt-2 inline-block">Clear filters</a> </div>`}` })}`;
}, "/media/boba/DATA/Project/js project/react/Astro/boba-commerce/src/pages/products/index.astro", void 0);

const $$file = "/media/boba/DATA/Project/js project/react/Astro/boba-commerce/src/pages/products/index.astro";
const $$url = "/products";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
