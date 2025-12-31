/* empty css                                    */
import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_BOT567rp.mjs';
import 'piccolore';
import { $ as $$BaseLayout, B as Button } from '../../chunks/BaseLayout_QRpTJ7ty.mjs';
import { CheckCircle } from 'lucide-react';
export { renderers } from '../../renderers.mjs';

const $$Success = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Order Confirmed | Boba Commerce" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-xl mx-auto text-center py-16"> <div class="flex justify-center mb-6"> <div class="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center"> ${renderComponent($$result2, "CheckCircle", CheckCircle, { "className": "h-12 w-12 text-green-600" })} </div> </div> <h1 class="text-4xl font-display font-bold text-gray-900 mb-4">Order Confirmed!</h1> <p class="text-gray-600 mb-8 text-lg">
Thank you for your purchase. We've sent a confirmation email to your inbox.
</p> <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 text-left"> <h3 class="font-bold text-gray-900 mb-2">Order #BOBA-${Math.floor(Math.random() * 1e4)}</h3> <p class="text-sm text-gray-500">
Your order is being prepared with love and will ship within 1-2 business days.
</p> </div> <a href="/"> ${renderComponent($$result2, "Button", Button, { "size": "lg" }, { "default": ($$result3) => renderTemplate`Return Home` })} </a> </div> ` })}`;
}, "/media/boba/DATA/Project/js project/react/Astro/boba-commerce/src/pages/checkout/success.astro", void 0);

const $$file = "/media/boba/DATA/Project/js project/react/Astro/boba-commerce/src/pages/checkout/success.astro";
const $$url = "/checkout/success";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Success,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
