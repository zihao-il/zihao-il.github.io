import{s as M,q as X,g as G,h as H,p as Y,B as Z,C as ee,i as te,k as ae,w as ne,D as se,E as oe,e as le,y as re,z as ie,r as ue,d as ce,t as _e,A as me}from"./@varlet-3224955e.js";import{s as pe,g as ve}from"./index-31133a08.js";import{_ as de}from"./_plugin-vue_export-helper-c27b6911.js";import{r as fe,b as i,o as ge,z as h,M as E,s as n,I as t,u as L,i as w,F as $,Q as r,N as ke,J as y,A as be,B as Ce}from"./@vue-d6f9b4e7.js";import"./@popperjs-b31fb82b.js";import"./axios-21b846bc.js";const Ie={__name:"download",setup(he){const g=fe([]);let c=i(!1);const k=i(!0);async function S(a,e){const o=JSON.parse(a.link),v=Object.keys(o).map(C=>({name:C,icon:"download"})),l=await ie({actions:v,title:"下载推荐(OneDrive_365>OneDrive_E5>123盘)"});l!=="close"&&(e==="v7"?window.open(o[l.name].ARMv7,"_blank"):o[l.name].ARMv8===""?M.warning("此版本没有ARMv8架构的安装包(>≈1.16.X版本才有)"):window.open(o[l.name].ARMv8,"_blank"))}async function d(a,e,o){let u;if(o===!0){const{data:l}=await pe(a);if(l.status===201)return M.error("无此版本号！");u=l.message}else try{const{data:l}=await ve(a);u=l.message,k.value=!1}catch{c.value=!0,m.value=!1,f.value=!0;return}const v=i(u.slice().reverse());e===!0?g.splice(0,g.length,...v.value):g.push(...v.value)}ge(()=>{let a=setInterval(function(){let e=sessionStorage.getItem("Beta");e!==null&&(clearInterval(a),d({v:e}),sessionStorage.setItem("version",e))},100)});const p=i("");i("");let _=i(!0);function z(){_.value=_.value===!1}const N=()=>{switch(b.value){case"全版本":case 0:sessionStorage.setItem("version",sessionStorage.getItem("Beta"));break;case"正式版":case 1:sessionStorage.setItem("version",sessionStorage.getItem("Release"));break;case"测试版":case 2:sessionStorage.setItem("version",sessionStorage.getItem("Beta"));break}};function T(){k.value=!0;let a,e;switch(b.value){case"全版本":e="2";break;case"正式版":e="0";break;case"测试版":e="1";break}p.value!==""?p.value.split(".")[1]&&(_.value===!0?a="1":a="0",d({s:p.value,m:a,b:e},!0,!0),k.value=!1,m.value=!1,f.value=!0):(N(),m.value=!0,f.value=!1,d({v:sessionStorage.getItem("version"),b:e},!0,!1),B())}const b=i(0),I=(a,e)=>{sessionStorage.setItem("isBeta",a),d({v:sessionStorage.getItem(e),b:a},!0),sessionStorage.setItem("version",sessionStorage.getItem(e))};function U(a){switch(p.value="",sessionStorage.setItem("version",sessionStorage.getItem("Beta")),a){case"全版本":I("","Beta");break;case"正式版":I("0","Release");break;case"测试版":I("1","Beta");break}}const m=i(!1);i(!1),i([]);const f=i(!1);function B(){setTimeout(()=>{let a=sessionStorage.getItem("isBeta"),e=sessionStorage.getItem("version");if(e==="1.2.x"){m.value=!1,f.value=!0;return}let o=parseInt(e.split(".")[1])-1;o=`1.${o}.x`,sessionStorage.setItem("version",o);let u;a===""?u={v:o}:u={v:o,b:a},d(u),m.value=!1},1e3)}const D=a=>{const e=a.split(".");let o=`${e[0]}.${e[1]}`;return parseFloat(o)>1.1?`https://minecraft.fandom.com/zh/wiki/%E5%9F%BA%E5%B2%A9%E7%89%88${a}`:`https://minecraft.fandom.com/zh/wiki/%E6%90%BA%E5%B8%A6%E7%89%88${a}`};return(a,e)=>{const o=Y,u=X,v=Z,l=ee,C=te,x=ae,A=ue,R=ce,V=_e,F=me,O=ne,P=se,j=oe,J=G,q=le,K=re,Q=H;return h(),E($,null,[n(u,{active:b.value,"onUpdate:active":e[0]||(e[0]=s=>b.value=s),onClick:U},{default:t(()=>[n(o,{name:"全版本"},{default:t(()=>[r("全版本")]),_:1}),n(o,{name:"正式版"},{default:t(()=>[r("正式版")]),_:1}),n(o,{name:"测试版"},{default:t(()=>[r("测试版")]),_:1})]),_:1},8,["active"]),n(J,{justify:"center",gutter:10},{default:t(()=>[n(C,{span:22},{default:t(()=>[n(v,{variant:"outlined",placeholder:"请输入版本号",onInput:T,modelValue:p.value,"onUpdate:modelValue":e[1]||(e[1]=s=>p.value=s)},null,8,["modelValue"]),n(l,{onClick:z,modelValue:L(_),"onUpdate:modelValue":e[2]||(e[2]=s=>w(_)?_.value=s:_=s),class:"mSwitch"},{default:t(()=>[r("模糊搜索")]),_:1},8,["modelValue"])]),_:1}),n(P,{"loading-text":"正在努力输出中...","finished-text":"一滴都没有了","error-text":"出错了出错了",finished:f.value,offset:"30",loading:m.value,"onUpdate:loading":e[3]||(e[3]=s=>m.value=s),check:"",onLoad:B},{default:t(()=>[n(O,{title:"",card:"",rows:3,loading:k.value},{default:t(()=>[(h(!0),E($,null,ke(g,s=>(h(),be(C,{key:s.version_all},{default:t(()=>[n(F,{title:s.version,subtitle:s.is_beta===0?"正式版":"测试版",layout:"column",ripple:"",outline:"outline",class:Ce(s.is_beta===0?"cardr":"cardb")},{description:t(()=>[n(A,null,{default:t(()=>[y("ul",null,[y("li",null,[r("更新日志： "),n(x,{type:"primary",target:"_blank",href:D(s.version),underline:"none"},{default:t(()=>[r("Minecraft Wiki ")]),_:2},1032,["href"])])])]),_:2},1024)]),extra:t(()=>[n(A,null,{default:t(()=>[n(V,{plain:"",onClick:W=>S(s,"v7"),type:"primary"},{right:t(()=>[n(R,{name:"download"})]),default:t(()=>[r(" ARMv7 ")]),_:2},1032,["onClick"]),n(V,{plain:"",onClick:W=>S(s,"v8"),type:"primary"},{right:t(()=>[n(R,{name:"download"})]),default:t(()=>[r(" ARMv8 ")]),_:2},1032,["onClick"])]),_:2},1024)]),_:2},1032,["title","subtitle","class"])]),_:2},1024))),128))]),_:1},8,["loading"])]),_:1},8,["finished","loading"]),n(j,{duration:300})]),_:1}),n(Q,{"default-style":!1,show:L(c),"onUpdate:show":e[5]||(e[5]=s=>w(c)?c.value=s:c=s)},{default:t(()=>[n(K,{class:"result",type:"empty",title:"无法获取版本列表"},{description:t(()=>[y("p",null,[r(" 请前往 "),n(x,{class:"href-link",type:"primary",target:"_blank",href:"https://mc233.endyun.ltd/",underline:"none"},{default:t(()=>[r("静态站 ")]),_:1}),r(" 或联系管理员修复！ ")])]),footer:t(()=>[n(q,{color:"var(--result-empty-color)","text-color":"#fff",onClick:e[4]||(e[4]=s=>w(c)?c.value=!1:c=!1)},{default:t(()=>[r(" 知道了 ")]),_:1})]),_:1})]),_:1},8,["show"])],64)}}},Re=de(Ie,[["__scopeId","data-v-c9971559"]]);export{Re as default};