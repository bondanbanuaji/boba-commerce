/* empty css                                    */
import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_BOT567rp.mjs';
import 'piccolore';
import { B as Button, $ as $$BaseLayout } from '../../chunks/BaseLayout_QRpTJ7ty.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState } from 'react';
import { I as Input } from '../../chunks/Input_BtwuZob8.mjs';
import { Loader2 } from 'lucide-react';
export { renderers } from '../../renderers.mjs';

function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    window.location.href = "/account";
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Email" }),
      /* @__PURE__ */ jsx(Input, { type: "email", placeholder: "you@example.com", required: true })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Password" }),
        /* @__PURE__ */ jsx("a", { href: "/auth/forgot-password", class: "text-xs text-boba-primary hover:underline", children: "Forgot password?" })
      ] }),
      /* @__PURE__ */ jsx(Input, { type: "password", required: true })
    ] }),
    /* @__PURE__ */ jsx(Button, { type: "submit", className: "w-full", disabled: isLoading, children: isLoading ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
      "Signing in..."
    ] }) : "Sign In" })
  ] });
}

const $$Login = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Sign In | Boba Commerce" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-[60vh] flex flex-col items-center justify-center py-12"> <div class="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-100"> <div class="text-center mb-8"> <h1 class="text-2xl font-display font-bold text-gray-900">Welcome Back</h1> <p class="text-sm text-gray-500 mt-2">Sign in to your account to continue</p> </div> ${renderComponent($$result2, "LoginForm", LoginForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@components/react/auth/LoginForm", "client:component-export": "LoginForm" })} <div class="mt-6 text-center text-sm text-gray-600">
Don't have an account?${" "} <a href="/auth/register" class="text-boba-primary font-medium hover:underline">
Sign up
</a> </div> </div> </div> ` })}`;
}, "/media/boba/DATA/Project/js project/react/Astro/boba-commerce/src/pages/auth/login.astro", void 0);

const $$file = "/media/boba/DATA/Project/js project/react/Astro/boba-commerce/src/pages/auth/login.astro";
const $$url = "/auth/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Login,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
