/* empty css                                    */
import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_BOT567rp.mjs';
import 'piccolore';
import { c as cn, B as Button, a as addToCart, b as addToast, $ as $$BaseLayout } from '../../chunks/BaseLayout_QRpTJ7ty.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import 'clsx';
import { A as AddToCartButton, $ as $$ProductCard } from '../../chunks/ProductCard_BEM4EqSH.mjs';
import { g as getProductBySlug, a as getRelatedProducts } from '../../chunks/products_xn4w3UBh.mjs';
export { renderers } from '../../renderers.mjs';

function ProductGallery({ images, name }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const displayImages = images.length > 0 ? images : ["/placeholder.png"];
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col-reverse md:flex-row gap-4", children: [
    /* @__PURE__ */ jsx("div", { className: "flex md:flex-col gap-4 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide", children: displayImages.map((image, index) => /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => setSelectedImage(index),
        className: cn(
          "relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all",
          selectedImage === index ? "border-boba-primary ring-2 ring-boba-primary/20" : "border-transparent hover:border-gray-200"
        ),
        children: /* @__PURE__ */ jsx(
          "img",
          {
            src: image,
            alt: `${name} view ${index + 1}`,
            className: "w-full h-full object-cover"
          }
        )
      },
      index
    )) }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 aspect-square bg-white rounded-2xl overflow-hidden shadow-sm relative group", children: /* @__PURE__ */ jsx(
      "img",
      {
        src: displayImages[selectedImage],
        alt: name,
        className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      }
    ) })
  ] });
}

function VariantSelector({ variants, selectedVariant, onSelect }) {
  if (!variants || variants.length === 0) return null;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-900", children: "Select Option:" }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-3", children: variants.map((variant) => {
      const isSelected = selectedVariant === variant.id;
      const isOutOfStock = variant.stock <= 0;
      return /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => !isOutOfStock && onSelect(variant.id),
          disabled: isOutOfStock,
          className: cn(
            "px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all relative overflow-hidden",
            isSelected ? "border-boba-primary text-boba-primary bg-boba-cream/10" : "border-gray-200 text-gray-700 hover:border-gray-300",
            isOutOfStock && "opacity-50 cursor-not-allowed bg-gray-50 text-gray-400 decoration-slice line-through"
          ),
          children: [
            variant.name,
            variant.priceOffset && variant.priceOffset > 0 && /* @__PURE__ */ jsxs("span", { className: "ml-1 text-xs opacity-75", children: [
              "(+$",
              variant.priceOffset.toFixed(2),
              ")"
            ] })
          ]
        },
        variant.id
      );
    }) })
  ] });
}

function QuantityInput({ value, onChange, min = 1, max = 99 }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center border border-gray-300 rounded-lg w-fit", children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => onChange(Math.max(min, value - 1)),
        className: "p-3 hover:bg-gray-100 rounded-l-lg transition-colors disabled:opacity-50",
        disabled: value <= min,
        "aria-label": "Decrease quantity",
        children: /* @__PURE__ */ jsx(Minus, { className: "h-4 w-4" })
      }
    ),
    /* @__PURE__ */ jsx("span", { className: "w-12 text-center font-medium", children: value }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => onChange(Math.min(max, value + 1)),
        className: "p-3 hover:bg-gray-100 rounded-r-lg transition-colors disabled:opacity-50",
        disabled: value >= max,
        "aria-label": "Increase quantity",
        children: /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" })
      }
    )
  ] });
}

function ProductDetailForm({ product }) {
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants?.[0]?.id || null
  );
  const [quantity, setQuantity] = useState(1);
  const productToAdd = {
    ...product,
    // Override price if variant selected (mock logic)
    price: product.price + (product.variants?.find((v) => v.id === selectedVariantId)?.priceOffset || 0),
    // Pass the specific variant ID
    variantId: selectedVariantId || product.id
  };
  const handleAddToCartPayload = {
    ...product,
    id: product.id,
    variantId: selectedVariantId || product.id,
    // Important for cart unique keys
    price: productToAdd.price
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    product.variants && product.variants.length > 0 && /* @__PURE__ */ jsx(
      VariantSelector,
      {
        variants: product.variants,
        selectedVariant: selectedVariantId,
        onSelect: setSelectedVariantId
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex items-end gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-gray-900", children: "Quantity" }),
        /* @__PURE__ */ jsx(
          QuantityInput,
          {
            value: quantity,
            onChange: setQuantity
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsx(
          AddToCartButton,
          {
            product: handleAddToCartPayload
          }
        ),
        /* @__PURE__ */ jsx(
          CustomAddToCartBtn,
          {
            product: handleAddToCartPayload,
            quantity
          }
        )
      ] })
    ] })
  ] });
}
function CustomAddToCartBtn({ product, quantity }) {
  const [loading, setLoading] = useState(false);
  const handleAdd = () => {
    setLoading(true);
    setTimeout(() => {
      addToCart(product, quantity);
      addToast({
        type: "success",
        message: `Added ${quantity}x ${product.name} to cart`,
        duration: 3e3
      });
      setLoading(false);
    }, 400);
  };
  return /* @__PURE__ */ jsxs(
    Button,
    {
      onClick: handleAdd,
      isLoading: loading,
      className: "w-full h-[50px] text-lg",
      children: [
        "Add to Cart - $",
        (product.price * quantity).toFixed(2)
      ]
    }
  );
}

const $$Astro = createAstro();
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  if (!slug) {
    return Astro2.redirect("/products");
  }
  const product = await getProductBySlug(slug);
  if (!product) {
    return Astro2.redirect("/404");
  }
  const relatedProducts = await getRelatedProducts(product.id);
  const images = [product.image];
  if (product.image.includes("unsplash")) {
    images.push(product.image + "&fit=crop&w=800&q=60");
    images.push(product.image + "&fit=crop&w=800&q=40");
  }
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": `${product.name} | Boba Commerce` }, { "default": async ($$result2) => renderTemplate`${maybeRenderHead()}<nav class="flex text-sm text-gray-500 mb-8"> <a href="/" class="hover:text-boba-primary">Home</a> <span class="mx-2">/</span> <a href="/products" class="hover:text-boba-primary">Products</a> <span class="mx-2">/</span> <span class="text-gray-900 font-medium">${product.name}</span> </nav> <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">  ${renderComponent($$result2, "ProductGallery", ProductGallery, { "client:load": true, "images": images, "name": product.name, "client:component-hydration": "load", "client:component-path": "@components/react/product/ProductGallery", "client:component-export": "ProductGallery" })}  <div class="flex flex-col"> <h1 class="text-4xl font-display font-bold text-gray-900 mb-2">${product.name}</h1> <p class="text-2xl text-boba-primary font-bold mb-6">$${product.price.toFixed(2)}</p> <div class="prose prose-sm text-gray-600 mb-8"> <p>${product.description}</p> </div> <div class="space-y-6 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">  ${renderComponent($$result2, "ProductDetailForm", ProductDetailForm, { "client:load": true, "product": product, "client:component-hydration": "load", "client:component-path": "@components/react/product/ProductDetailForm", "client:component-export": "ProductDetailForm" })}  <div class="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100"> <div class="flex items-center gap-2 text-sm text-gray-600"> <svg class="w-5 h-5 text-boba-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> <span>Premium Quality</span> </div> <div class="flex items-center gap-2 text-sm text-gray-600"> <svg class="w-5 h-5 text-boba-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> <span>Fast Shipping</span> </div> </div> </div> </div> </div> ${relatedProducts.length > 0 && renderTemplate`<section> <h2 class="text-2xl font-display font-bold mb-6">You Might Also Like</h2> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"> ${relatedProducts.map((p) => renderTemplate`${renderComponent($$result2, "ProductCard", $$ProductCard, { "product": p })}`)} </div> </section>`}` })}`;
}, "/media/boba/DATA/Project/js project/react/Astro/boba-commerce/src/pages/products/[slug].astro", void 0);

const $$file = "/media/boba/DATA/Project/js project/react/Astro/boba-commerce/src/pages/products/[slug].astro";
const $$url = "/products/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$slug,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
