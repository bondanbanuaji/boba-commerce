/* empty css                                    */
import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_BOT567rp.mjs';
import 'piccolore';
import { B as Button, $ as $$BaseLayout } from '../../chunks/BaseLayout_QRpTJ7ty.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState } from 'react';
import { I as Input } from '../../chunks/Input_BtwuZob8.mjs';
import { Loader2 } from 'lucide-react';
export { renderers } from '../../renderers.mjs';

function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    window.location.href = "/account";
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "First Name" }),
        /* @__PURE__ */ jsx(Input, { required: true })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Last Name" }),
        /* @__PURE__ */ jsx(Input, { required: true })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Email" }),
      /* @__PURE__ */ jsx(Input, { type: "email", placeholder: "you@example.com", required: true })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Password" }),
      /* @__PURE__ */ jsx(Input, { type: "password", required: true, minLength: 8 })
    ] }),
    /* @__PURE__ */ jsx(Button, { type: "submit", className: "w-full", disabled: isLoading, children: isLoading ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
      "Creating account..."
    ] }) : "Create Account" })
  ] });
}

const $$Register = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Create Account | Boba Commerce" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-[60vh] flex flex-col items-center justify-center py-12"> <div class="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-100"> <div class="text-center mb-8"> <h1 class="text-2xl font-display font-bold text-gray-900">Create Account</h1> <p class="text-sm text-gray-500 mt-2">Join the Boba Commerce community</p> </div> ${renderComponent($$result2, "RegisterForm", RegisterForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@components/react/auth/RegisterForm", "client:component-export": "RegisterForm" })} <div class="mt-6 text-center text-sm text-gray-600">
Already have an account?${" "} <a href="/auth/login" class="text-boba-primary font-medium hover:underline">
Sign in
</a> </div> </div> </div> ` })}`;
}, "/media/boba/DATA/Project/js project/react/Astro/boba-commerce/src/pages/auth/register.astro", void 0);

const $$file = "/media/boba/DATA/Project/js project/react/Astro/boba-commerce/src/pages/auth/register.astro";
const $$url = "/auth/register";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Register,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
