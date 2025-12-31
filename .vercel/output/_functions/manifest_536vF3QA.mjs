import 'piccolore';
import { p as decodeKey } from './chunks/astro/server_BOT567rp.mjs';
import 'clsx';
import './chunks/astro-designed-error-pages_cnk7mqHd.mjs';
import 'es-module-lexer';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/noop-middleware_Clnni6Pz.mjs';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///media/boba/DATA/Project/js%20project/react/Astro/boba-commerce/","cacheDir":"file:///media/boba/DATA/Project/js%20project/react/Astro/boba-commerce/node_modules/.astro/","outDir":"file:///media/boba/DATA/Project/js%20project/react/Astro/boba-commerce/dist/","srcDir":"file:///media/boba/DATA/Project/js%20project/react/Astro/boba-commerce/src/","publicDir":"file:///media/boba/DATA/Project/js%20project/react/Astro/boba-commerce/public/","buildClientDir":"file:///media/boba/DATA/Project/js%20project/react/Astro/boba-commerce/dist/client/","buildServerDir":"file:///media/boba/DATA/Project/js%20project/react/Astro/boba-commerce/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_actions/[...path]","pattern":"^\\/_actions(?:\\/(.*?))?\\/?$","segments":[[{"content":"_actions","dynamic":false,"spread":false}],[{"content":"...path","dynamic":true,"spread":true}]],"params":["...path"],"component":"node_modules/astro/dist/actions/runtime/route.js","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/login.C-Hct4I1.css"}],"routeData":{"route":"/auth/login","isIndex":false,"type":"page","pattern":"^\\/auth\\/login\\/?$","segments":[[{"content":"auth","dynamic":false,"spread":false}],[{"content":"login","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/auth/login.astro","pathname":"/auth/login","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/login.C-Hct4I1.css"}],"routeData":{"route":"/auth/register","isIndex":false,"type":"page","pattern":"^\\/auth\\/register\\/?$","segments":[[{"content":"auth","dynamic":false,"spread":false}],[{"content":"register","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/auth/register.astro","pathname":"/auth/register","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/login.C-Hct4I1.css"}],"routeData":{"route":"/cart","isIndex":false,"type":"page","pattern":"^\\/cart\\/?$","segments":[[{"content":"cart","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/cart.astro","pathname":"/cart","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/login.C-Hct4I1.css"}],"routeData":{"route":"/checkout/success","isIndex":false,"type":"page","pattern":"^\\/checkout\\/success\\/?$","segments":[[{"content":"checkout","dynamic":false,"spread":false}],[{"content":"success","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/checkout/success.astro","pathname":"/checkout/success","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/login.C-Hct4I1.css"}],"routeData":{"route":"/checkout","isIndex":true,"type":"page","pattern":"^\\/checkout\\/?$","segments":[[{"content":"checkout","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/checkout/index.astro","pathname":"/checkout","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/login.C-Hct4I1.css"}],"routeData":{"route":"/products/[slug]","isIndex":false,"type":"page","pattern":"^\\/products\\/([^/]+?)\\/?$","segments":[[{"content":"products","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}]],"params":["slug"],"component":"src/pages/products/[slug].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/login.C-Hct4I1.css"}],"routeData":{"route":"/products","isIndex":true,"type":"page","pattern":"^\\/products\\/?$","segments":[[{"content":"products","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/products/index.astro","pathname":"/products","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/login.C-Hct4I1.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/media/boba/DATA/Project/js project/react/Astro/boba-commerce/src/pages/auth/login.astro",{"propagation":"none","containsHead":true}],["/media/boba/DATA/Project/js project/react/Astro/boba-commerce/src/pages/auth/register.astro",{"propagation":"none","containsHead":true}],["/media/boba/DATA/Project/js project/react/Astro/boba-commerce/src/pages/cart.astro",{"propagation":"none","containsHead":true}],["/media/boba/DATA/Project/js project/react/Astro/boba-commerce/src/pages/checkout/index.astro",{"propagation":"none","containsHead":true}],["/media/boba/DATA/Project/js project/react/Astro/boba-commerce/src/pages/checkout/success.astro",{"propagation":"none","containsHead":true}],["/media/boba/DATA/Project/js project/react/Astro/boba-commerce/src/pages/index.astro",{"propagation":"none","containsHead":true}],["/media/boba/DATA/Project/js project/react/Astro/boba-commerce/src/pages/products/[slug].astro",{"propagation":"none","containsHead":true}],["/media/boba/DATA/Project/js project/react/Astro/boba-commerce/src/pages/products/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000astro-internal:middleware":"_astro-internal_middleware.mjs","\u0000virtual:astro:actions/entrypoint":"entrypoint.mjs","\u0000@astro-page:node_modules/astro/dist/actions/runtime/route@_@js":"pages/_actions/_---path_.astro.mjs","\u0000@astro-page:src/pages/auth/login@_@astro":"pages/auth/login.astro.mjs","\u0000@astro-page:src/pages/auth/register@_@astro":"pages/auth/register.astro.mjs","\u0000@astro-page:src/pages/cart@_@astro":"pages/cart.astro.mjs","\u0000@astro-page:src/pages/checkout/success@_@astro":"pages/checkout/success.astro.mjs","\u0000@astro-page:src/pages/checkout/index@_@astro":"pages/checkout.astro.mjs","\u0000@astro-page:src/pages/products/[slug]@_@astro":"pages/products/_slug_.astro.mjs","\u0000@astro-page:src/pages/products/index@_@astro":"pages/products.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_536vF3QA.mjs","/media/boba/DATA/Project/js project/react/Astro/boba-commerce/node_modules/@astrojs/vercel/dist/image/build-service.js":"chunks/build-service_Cwwc7L8e.mjs","@components/react/auth/LoginForm":"_astro/LoginForm.GeydstrE.js","@components/react/auth/RegisterForm":"_astro/RegisterForm.DRfER0pM.js","@components/react/product/ProductGallery":"_astro/ProductGallery.Bps-JkI0.js","@components/react/cart/CartIcon":"_astro/CartIcon.CmpRThxn.js","@components/react/cart/CartDrawer":"_astro/CartDrawer.BGk0E-hc.js","@components/react/checkout/CheckoutForm":"_astro/CheckoutForm.DwDK7KuW.js","/media/boba/DATA/Project/js project/react/Astro/boba-commerce/src/layouts/BaseLayout.astro?astro&type=script&index=0&lang.ts":"_astro/BaseLayout.astro_astro_type_script_index_0_lang.B1pcLZH5.js","@components/react/cart/CartSummary":"_astro/CartSummary.4jqZyU7_.js","@components/react/product/ProductDetailForm":"_astro/ProductDetailForm.XeEPTAFW.js","@components/react/ui/Toast":"_astro/Toast.DsYkIdeV.js","@astrojs/react/client.js":"_astro/client.9unXo8s5.js","@components/react/cart/AddToCartButton":"_astro/AddToCartButton.DIHmNFwq.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/login.C-Hct4I1.css","/favicon.svg","/_astro/AddToCartButton.DIHmNFwq.js","/_astro/BaseLayout.astro_astro_type_script_index_0_lang.B1pcLZH5.js","/_astro/Button.BQcI447G.js","/_astro/CartDrawer.BGk0E-hc.js","/_astro/CartIcon.CmpRThxn.js","/_astro/CartSummary.4jqZyU7_.js","/_astro/CheckoutForm.DwDK7KuW.js","/_astro/LoginForm.GeydstrE.js","/_astro/ProductDetailForm.XeEPTAFW.js","/_astro/ProductGallery.Bps-JkI0.js","/_astro/RegisterForm.DRfER0pM.js","/_astro/Toast.DsYkIdeV.js","/_astro/cart.DagnSXBD.js","/_astro/client.9unXo8s5.js","/_astro/createLucideIcon.H8DUYhgo.js","/_astro/index.CASokwIO.js","/_astro/index.Cg71Lysi.js","/_astro/index.Ctr3S7GU.js","/_astro/index.WFquGv8Z.js","/_astro/loader-circle.DOxAuByr.js","/_astro/plus.CO4mEePD.js","/_astro/shopping-bag.DHgMLe65.js","/_astro/trash-2.BxMnLcV1.js","/_astro/ui.Bk96mPu1.js","/_astro/x.h9WrMCji.js"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"serverIslandNameMap":[],"key":"6Ov0kc9CzUwxqks/Ft4Fdl4ClfadlQ8QiG3g5gyHyyY="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
