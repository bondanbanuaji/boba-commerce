import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_DhNJnWay.mjs';
import { manifest } from './manifest_536vF3QA.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/_actions/_---path_.astro.mjs');
const _page2 = () => import('./pages/auth/login.astro.mjs');
const _page3 = () => import('./pages/auth/register.astro.mjs');
const _page4 = () => import('./pages/cart.astro.mjs');
const _page5 = () => import('./pages/checkout/success.astro.mjs');
const _page6 = () => import('./pages/checkout.astro.mjs');
const _page7 = () => import('./pages/products/_slug_.astro.mjs');
const _page8 = () => import('./pages/products.astro.mjs');
const _page9 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["node_modules/astro/dist/actions/runtime/route.js", _page1],
    ["src/pages/auth/login.astro", _page2],
    ["src/pages/auth/register.astro", _page3],
    ["src/pages/cart.astro", _page4],
    ["src/pages/checkout/success.astro", _page5],
    ["src/pages/checkout/index.astro", _page6],
    ["src/pages/products/[slug].astro", _page7],
    ["src/pages/products/index.astro", _page8],
    ["src/pages/index.astro", _page9]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./entrypoint.mjs'),
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = {
    "middlewareSecret": "4aeae61e-5fdf-440d-a77b-9f8bbcf170d8",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
