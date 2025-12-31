import { e as createComponent, f as createAstro, m as maybeRenderHead, h as addAttribute, k as renderComponent, r as renderTemplate } from './astro/server_BOT567rp.mjs';
import 'piccolore';
import { jsx } from 'react/jsx-runtime';
import { useState } from 'react';
import { B as Button, a as addToCart, b as addToast } from './BaseLayout_QRpTJ7ty.mjs';
import { ShoppingBag } from 'lucide-react';

function AddToCartButton({ product, variant = "full" }) {
  const [loading, setLoading] = useState(false);
  const handleAdd = () => {
    setLoading(true);
    setTimeout(() => {
      addToCart(product);
      addToast({
        type: "success",
        message: `Added ${product.name} to cart`,
        duration: 3e3
      });
      setLoading(false);
    }, 400);
  };
  if (variant === "icon") {
    return /* @__PURE__ */ jsx(
      Button,
      {
        size: "icon",
        variant: "secondary",
        onClick: (e) => {
          e.preventDefault();
          handleAdd();
        },
        isLoading: loading,
        className: "rounded-full shadow-sm hover:shadow-md",
        children: /* @__PURE__ */ jsx(ShoppingBag, { className: "h-5 w-5" })
      }
    );
  }
  return /* @__PURE__ */ jsx(
    Button,
    {
      onClick: handleAdd,
      isLoading: loading,
      className: "w-full",
      children: "Add to Cart"
    }
  );
}

const $$Astro = createAstro();
const $$ProductCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ProductCard;
  const { product } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<article class="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-boba transition-all duration-300 border border-transparent hover:border-boba-100">  <div class="aspect-square bg-boba-50 overflow-hidden relative"> <img${addAttribute(product.image, "src")}${addAttribute(product.name, "alt")} class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" loading="lazy">  <div class="absolute bottom-4 right-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"> ${renderComponent($$result, "AddToCartButton", AddToCartButton, { "client:idle": true, "product": product, "variant": "icon", "client:component-hydration": "idle", "client:component-path": "@components/react/cart/AddToCartButton", "client:component-export": "AddToCartButton" })} </div> </div>  <div class="p-4"> <h3 class="font-display font-bold text-gray-900 group-hover:text-boba-primary transition-colors"> <a${addAttribute(`/products/${product.slug}`, "href")}> <span class="absolute inset-0"></span> ${product.name} </a> </h3> <p class="mt-1 text-sm text-gray-500 line-clamp-2">${product.description}</p> <div class="mt-3 flex items-center justify-between"> <p class="text-lg font-bold text-boba-primary-dark">$${product.price.toFixed(2)}</p> </div> </div> </article>`;
}, "/media/boba/DATA/Project/js project/react/Astro/boba-commerce/src/components/astro/product/ProductCard.astro", void 0);

export { $$ProductCard as $, AddToCartButton as A };
