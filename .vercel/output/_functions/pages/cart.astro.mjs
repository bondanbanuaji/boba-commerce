/* empty css                                 */
import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_BOT567rp.mjs';
import 'piccolore';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_QRpTJ7ty.mjs';
export { renderers } from '../renderers.mjs';

const $$Cart = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Cart | Boba Commerce" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-4xl mx-auto"> <h1 class="text-3xl font-display font-bold text-gray-900 mb-8">Shopping Cart</h1>   ${renderComponent($$result2, "CartSummary", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "@components/react/cart/CartSummary", "client:component-export": "CartSummary" })} </div> ` })}`;
}, "/media/boba/DATA/Project/js project/react/Astro/boba-commerce/src/pages/cart.astro", void 0);

const $$file = "/media/boba/DATA/Project/js project/react/Astro/boba-commerce/src/pages/cart.astro";
const $$url = "/cart";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Cart,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
