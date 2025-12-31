import { e as createComponent, m as maybeRenderHead, k as renderComponent, h as addAttribute, r as renderTemplate, f as createAstro, l as renderHead, n as renderSlot, o as renderScript } from './astro/server_BOT567rp.mjs';
import 'piccolore';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useStore } from '@nanostores/react';
import { atom, map, computed } from 'nanostores';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AlertCircle, Info, AlertTriangle, CheckCircle, X, ShoppingBag, Minus, Plus, Trash2, User } from 'lucide-react';
import { a as actions } from './virtual_nXye-GdT.mjs';
import { forwardRef, useEffect } from 'react';
import { cva } from 'class-variance-authority';
/* empty css                         */

const $toasts = atom([]);
function addToast(toast) {
  const id = crypto.randomUUID();
  const newToast = { ...toast, id };
  $toasts.set([...$toasts.get(), newToast]);
  setTimeout(() => {
    removeToast(id);
  }, toast.duration ?? 5e3);
  return id;
}
function removeToast(id) {
  $toasts.set($toasts.get().filter((t) => t.id !== id));
}
atom(false);
atom(false);
atom("");

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const icons = {
  success: CheckCircle,
  warning: AlertTriangle,
  info: Info,
  error: AlertCircle
};
const colors = {
  success: "bg-boba-success text-white",
  warning: "bg-boba-warning text-white",
  info: "bg-boba-info text-white",
  error: "bg-boba-error text-white"
};
function ToastContainer() {
  const toasts = useStore($toasts);
  if (toasts.length === 0) return null;
  return /* @__PURE__ */ jsx("div", { className: "fixed bottom-4 right-4 z-50 flex flex-col gap-2", children: toasts.map((toast) => /* @__PURE__ */ jsx(ToastItem, { toast }, toast.id)) });
}
function ToastItem({ toast }) {
  const Icon = icons[toast.type];
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-[300px] animate-slide-in-right",
        colors[toast.type]
      ),
      children: [
        /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" }),
        /* @__PURE__ */ jsx("p", { className: "flex-1 text-sm font-medium", children: toast.message }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => removeToast(toast.id),
            className: "opacity-70 hover:opacity-100 transition-opacity",
            children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
          }
        )
      ]
    }
  );
}

const $isCartOpen = atom(false);
const $cartItems = map({});
const $cartCount = computed(
  $cartItems,
  (items) => Object.values(items).reduce((sum, item) => sum + item.quantity, 0)
);
const $cartTotal = computed(
  $cartItems,
  (items) => Object.values(items).reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
);
async function addToCart(product, quantity = 1) {
  const currentItems = $cartItems.get();
  const variantId = product.variants?.[0]?.id || product.id;
  const existingItem = currentItems[variantId];
  if (existingItem) {
    $cartItems.setKey(variantId, {
      ...existingItem,
      quantity: existingItem.quantity + quantity
    });
  } else {
    $cartItems.setKey(variantId, {
      productId: product.id,
      variantId,
      name: product.name,
      price: product.price + (product.variants?.[0]?.priceOffset || 0),
      // handle basic variant price logic
      image: product.image,
      quantity
    });
  }
  persistCart();
  try {
    await actions.addToCart({
      productId: product.id,
      variantId,
      quantity
    });
  } catch (err) {
    console.error("Failed to sync cart with backend:", err);
  }
}
function removeFromCart(variantId) {
  const current = { ...$cartItems.get() };
  delete current[variantId];
  $cartItems.set(current);
  persistCart();
}
function updateQuantity(variantId, quantity) {
  if (quantity <= 0) {
    removeFromCart(variantId);
    return;
  }
  const item = $cartItems.get()[variantId];
  if (item) {
    $cartItems.setKey(variantId, { ...item, quantity });
    persistCart();
  }
}
function persistCart() {
  if (typeof window !== "undefined") {
    localStorage.setItem("boba-cart", JSON.stringify($cartItems.get()));
  }
}

function CartIcon() {
  const count = useStore($cartCount);
  const isOpen = useStore($isCartOpen);
  return /* @__PURE__ */ jsxs(
    "button",
    {
      onClick: () => $isCartOpen.set(!isOpen),
      className: "relative p-2 text-boba-primary hover:text-boba-primary-dark transition-colors",
      "aria-label": `Cart with ${count} items`,
      children: [
        /* @__PURE__ */ jsx(ShoppingBag, { className: "h-6 w-6" }),
        count > 0 && /* @__PURE__ */ jsx("span", { className: cn(
          "absolute -top-1 -right-1",
          "bg-boba-primary text-white",
          "text-xs font-bold rounded-full h-5 w-5",
          "flex items-center justify-center",
          "animate-scale-in"
        ), children: count > 99 ? "99+" : count })
      ]
    }
  );
}

const buttonVariants = cva(
  // Base styles
  `inline-flex items-center justify-center rounded-lg 
   font-medium transition-all duration-200 
   focus-visible:outline-none focus-visible:ring-2 
   focus-visible:ring-boba-primary focus-visible:ring-offset-2
   disabled:pointer-events-none disabled:opacity-50`,
  {
    variants: {
      variant: {
        primary: `bg-boba-primary text-white 
                  hover:bg-boba-primary-dark 
                  active:scale-[0.98]`,
        secondary: `bg-boba-cream text-boba-primary 
                    border border-boba-primary/20 
                    hover:bg-boba-cream-dark`,
        ghost: `hover:bg-boba-primary/10 text-boba-primary`,
        danger: `bg-boba-error text-white hover:bg-red-600`,
        link: `text-boba-primary underline-offset-4 hover:underline`
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-5 text-base",
        lg: "h-13 px-8 text-lg",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
);
const Button = forwardRef(
  ({ className, variant, size, isLoading, children, ...props }, ref) => {
    return /* @__PURE__ */ jsxs(
      "button",
      {
        className: cn(buttonVariants({ variant, size, className })),
        ref,
        disabled: isLoading || props.disabled,
        ...props,
        children: [
          isLoading && /* @__PURE__ */ jsxs(
            "svg",
            {
              className: "mr-2 h-4 w-4 animate-spin",
              fill: "none",
              viewBox: "0 0 24 24",
              children: [
                /* @__PURE__ */ jsx(
                  "circle",
                  {
                    className: "opacity-25",
                    cx: "12",
                    cy: "12",
                    r: "10",
                    stroke: "currentColor",
                    strokeWidth: "4"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "path",
                  {
                    className: "opacity-75",
                    fill: "currentColor",
                    d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  }
                )
              ]
            }
          ),
          children
        ]
      }
    );
  }
);
Button.displayName = "Button";

function CartDrawer() {
  const isOpen = useStore($isCartOpen);
  const items = useStore($cartItems);
  const total = useStore($cartTotal);
  const cartItems = Object.values(items);
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") $isCartOpen.set(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);
  if (!isOpen) return null;
  return /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-50 flex justify-end", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in",
        onClick: () => $isCartOpen.set(false)
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-md bg-white h-full shadow-2xl animate-slide-in-right flex flex-col", children: [
      /* @__PURE__ */ jsxs("div", { className: "p-4 border-b flex items-center justify-between bg-boba-50", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-display font-bold text-boba-primary-dark", children: "Your Cart" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => $isCartOpen.set(false),
            className: "p-2 hover:bg-black/5 rounded-full transition-colors",
            children: /* @__PURE__ */ jsx(X, { className: "h-6 w-6 text-boba-primary" })
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", children: cartItems.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col items-center justify-center text-center space-y-4 text-gray-500", children: [
        /* @__PURE__ */ jsx(ShoppingBag, { className: "h-16 w-16 opacity-20" }),
        /* @__PURE__ */ jsx("p", { children: "Your cart is empty." }),
        /* @__PURE__ */ jsx(Button, { variant: "secondary", onClick: () => $isCartOpen.set(false), children: "Continue Shopping" })
      ] }) : cartItems.map((item) => /* @__PURE__ */ jsxs("div", { className: "flex gap-4 p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors", children: [
        /* @__PURE__ */ jsx("div", { className: "h-20 w-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0", children: /* @__PURE__ */ jsx("img", { src: item.image, alt: item.name, className: "h-full w-full object-cover" }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-medium text-gray-900 line-clamp-1", children: item.name }),
            /* @__PURE__ */ jsxs("p", { className: "text-sm text-boba-primary font-bold", children: [
              "$",
              item.price.toFixed(2)
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center border rounded-md", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => updateQuantity(item.variantId, item.quantity - 1),
                  className: "p-1 hover:bg-gray-100",
                  disabled: item.quantity <= 1,
                  children: /* @__PURE__ */ jsx(Minus, { className: "h-3 w-3" })
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "px-2 text-sm font-medium", children: item.quantity }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => updateQuantity(item.variantId, item.quantity + 1),
                  className: "p-1 hover:bg-gray-100",
                  children: /* @__PURE__ */ jsx(Plus, { className: "h-3 w-3" })
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => removeFromCart(item.variantId),
                className: "text-gray-400 hover:text-red-500 transition-colors",
                children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
              }
            )
          ] })
        ] })
      ] }, item.variantId)) }),
      cartItems.length > 0 && /* @__PURE__ */ jsxs("div", { className: "p-4 border-t bg-gray-50 space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-lg font-medium", children: [
          /* @__PURE__ */ jsx("span", { children: "Total" }),
          /* @__PURE__ */ jsxs("span", { children: [
            "$",
            total.toFixed(2)
          ] })
        ] }),
        /* @__PURE__ */ jsx("a", { href: "/checkout", className: "block w-full", children: /* @__PURE__ */ jsx(Button, { className: "w-full", size: "lg", children: "Checkout" }) })
      ] })
    ] })
  ] });
}

const $$Header = createComponent(($$result, $$props, $$slots) => {
  const navItems = [
    { label: "Shop", href: "/products" },
    { label: "About", href: "/about" }
  ];
  return renderTemplate`${maybeRenderHead()}<header class="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 border-b border-boba-100"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="flex items-center justify-between h-16">  <div class="flex-shrink-0"> <a href="/" class="flex items-center gap-2"> <span class="text-2xl font-display font-bold text-boba-primary-dark tracking-tight">
Boba<span class="text-boba-primary">Commerce</span> </span> </a> </div>  <nav class="hidden md:flex items-center gap-8"> ${navItems.map((item) => renderTemplate`<a${addAttribute(item.href, "href")} class="text-sm font-medium text-gray-700 hover:text-boba-primary transition-colors"> ${item.label} </a>`)} </nav>  <div class="flex items-center gap-4">  <a href="/auth/login" class="p-2 text-gray-700 hover:text-boba-primary transition-colors"> ${renderComponent($$result, "User", User, { "className": "h-5 w-5" })} </a>  ${renderComponent($$result, "CartIcon", CartIcon, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@components/react/cart/CartIcon", "client:component-export": "CartIcon" })} </div> </div> </div> </header> ${renderComponent($$result, "CartDrawer", CartDrawer, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@components/react/cart/CartDrawer", "client:component-export": "CartDrawer" })}`;
}, "/media/boba/DATA/Project/js project/react/Astro/boba-commerce/src/components/astro/layout/Header.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<footer class="bg-white border-t border-boba-100 mt-auto"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"> <div class="grid grid-cols-1 md:grid-cols-4 gap-8">  <div class="col-span-1 md:col-span-1"> <span class="text-2xl font-display font-bold text-boba-primary-dark">
Boba<span class="text-boba-primary">Commerce</span> </span> <p class="mt-4 text-sm text-gray-500">
Premium boba tea supplies and accessories for the true enthusiast.
</p> </div>  <div> <h3 class="font-bold text-gray-900 mb-4">Shop</h3> <ul class="space-y-2 text-sm text-gray-600"> <li><a href="/products?category=tea" class="hover:text-boba-primary">Teas</a></li> <li><a href="/products?category=toppings" class="hover:text-boba-primary">Toppings</a></li> <li><a href="/products?category=equipment" class="hover:text-boba-primary">Equipment</a></li> <li><a href="/products?category=kits" class="hover:text-boba-primary">Starter Kits</a></li> </ul> </div> <div> <h3 class="font-bold text-gray-900 mb-4">Support</h3> <ul class="space-y-2 text-sm text-gray-600"> <li><a href="/about" class="hover:text-boba-primary">About Us</a></li> <li><a href="/contact" class="hover:text-boba-primary">Contact</a></li> <li><a href="/faq" class="hover:text-boba-primary">FAQ</a></li> <li><a href="/shipping" class="hover:text-boba-primary">Shipping & Returns</a></li> </ul> </div>  <div> <h3 class="font-bold text-gray-900 mb-4">Stay Updated</h3> <p class="text-sm text-gray-500 mb-4">Subscribe for latest products and recipes.</p> <form class="flex gap-2"> <input type="email" placeholder="Enter your email" class="flex-1 rounded-md border-gray-300 text-sm focus:border-boba-primary focus:ring-boba-primary"> <button type="submit" class="bg-boba-primary text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-boba-primary-dark transition-colors">
Subscribe
</button> </form> </div> </div> <div class="mt-12 pt-8 border-t border-gray-100 text-center text-sm text-gray-500">
&copy; ${(/* @__PURE__ */ new Date()).getFullYear()} Boba Commerce. All rights reserved.
</div> </div> </footer>`;
}, "/media/boba/DATA/Project/js project/react/Astro/boba-commerce/src/components/astro/layout/Footer.astro", void 0);

const $$Astro = createAstro();
const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const { title, description = "Boba Commerce - The best boba in town" } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}><meta name="description"${addAttribute(description, "content")}><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700&display=swap" rel="stylesheet"><title>${title}</title>${renderHead()}</head> <body class="min-h-screen flex flex-col bg-boba-50/50"> ${renderComponent($$result, "Header", $$Header, {})} <main class="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> ${renderSlot($$result, $$slots["default"])} </main> ${renderComponent($$result, "Footer", $$Footer, {})} ${renderComponent($$result, "ToastContainer", ToastContainer, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@components/react/ui/Toast", "client:component-export": "ToastContainer" })} ${renderScript($$result, "/media/boba/DATA/Project/js project/react/Astro/boba-commerce/src/layouts/BaseLayout.astro?astro&type=script&index=0&lang.ts")} </body> </html>`;
}, "/media/boba/DATA/Project/js project/react/Astro/boba-commerce/src/layouts/BaseLayout.astro", void 0);

export { $$BaseLayout as $, Button as B, addToCart as a, addToast as b, cn as c };
