import{s as h,_ as w,a as C,b as x,c as k,d as B,e as I,f as R}from"./@varlet-3224955e.js";import{u as y,R as S}from"./vue-router-b0f029af.js";import{g as N}from"./index-31133a08.js";import{_ as T}from"./_plugin-vue_export-helper-c27b6911.js";import{b as _,z as M,M as P,s as t,I as l,u as z,F as D}from"./@vue-d6f9b4e7.js";import"./@popperjs-b31fb82b.js";import"./axios-21b846bc.js";const E={__name:"index",setup(F){const c=y(),a=_(window.sessionStorage.getItem("activePath"));async function m(){let e;const{data:o}=await N({v:"larversion"});if(o.status===201)return h.error("获取总版本号失败！");e=o.message,sessionStorage.setItem("isBeta",""),sessionStorage.setItem("Release",e[0].Release),sessionStorage.setItem("Beta",e[0].Beta)}m();function n(e){window.sessionStorage.setItem("activePath",e),a.value=e,document.documentElement.scrollTop=0,document.body.scrollTop=0,c.push(e),e==="download"&&m()}const u=c.currentRoute.value.name;n(u);let s=null;const r=_(!1);function d(){s=s?null:x.dark,r.value=!r.value,k(s)}return(e,o)=>{const p=B,v=I,f=w,i=R,g=C;return M(),P(D,null,[t(f,{title:"MC版本库","title-position":"center"},{right:l(()=>[t(v,{color:"transparent","text-color":"#fff",round:"",text:"",onClick:d},{default:l(()=>[t(p,{name:r.value?"weather-night":"white-balance-sunny",size:24},null,8,["name"])]),_:1})]),_:1}),t(z(S)),t(g,{active:a.value,"onUpdate:active":o[0]||(o[0]=b=>a.value=b)},{default:l(()=>[t(i,{label:"主页",name:"main",icon:"home",onClick:n}),t(i,{label:"下载",name:"download",icon:"download",onClick:n}),t(i,{label:"关于",name:"about",icon:"account-circle",onClick:n})]),_:1},8,["active"])],64)}}},G=T(E,[["__scopeId","data-v-4a830946"]]);export{G as default};