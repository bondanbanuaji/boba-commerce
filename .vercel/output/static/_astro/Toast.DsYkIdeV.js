import{j as t,c as i}from"./index.Cg71Lysi.js";import{u as s}from"./index.Ctr3S7GU.js";import{$ as n,r}from"./ui.Bk96mPu1.js";import{c}from"./createLucideIcon.H8DUYhgo.js";import{X as a}from"./x.h9WrMCji.js";import"./index.WFquGv8Z.js";import"./index.CASokwIO.js";/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]],m=c("circle-alert",l);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]],d=c("circle-check-big",p);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]],x=c("info",h);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]],f=c("triangle-alert",y),g={success:d,warning:f,info:x,error:m},u={success:"bg-boba-success text-white",warning:"bg-boba-warning text-white",info:"bg-boba-info text-white",error:"bg-boba-error text-white"};function M(){const e=s(n);return e.length===0?null:t.jsx("div",{className:"fixed bottom-4 right-4 z-50 flex flex-col gap-2",children:e.map(o=>t.jsx(b,{toast:o},o.id))})}function b({toast:e}){const o=g[e.type];return t.jsxs("div",{className:i("flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-[300px] animate-slide-in-right",u[e.type]),children:[t.jsx(o,{className:"h-5 w-5"}),t.jsx("p",{className:"flex-1 text-sm font-medium",children:e.message}),t.jsx("button",{onClick:()=>r(e.id),className:"opacity-70 hover:opacity-100 transition-opacity",children:t.jsx(a,{className:"h-4 w-4"})})]})}export{M as ToastContainer};
