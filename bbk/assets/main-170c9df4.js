import{s as P,g as G,h as K,i as W,j as X,d as H,k as Y,l as Z,m as tt,n as lt,o as nt,p as et,q as at,r as ot,t as st,u as ut,v as _t,w as dt,x as it,e as rt,y as ct,z as pt,A as ft}from"./@varlet-3224955e.js";import{u as mt}from"./vue-router-b0f029af.js";import{l as vt}from"./index-31133a08.js";import{_ as ht}from"./_plugin-vue_export-helper-c27b6911.js";import{b as c,r as bt,o as yt,z as A,M as U,s as n,I as l,u as kt,i as E,F as L,J as t,Q as e,N as Ct,A as wt,B as gt,R as At,S as Mt}from"./@vue-d6f9b4e7.js";import"./@popperjs-b31fb82b.js";import"./axios-21b846bc.js";const u=f=>(At("data-v-f7e2f82e"),f=f(),Mt(),f),jt=u(()=>t("h1",null,"Minecraft for Android 版本库",-1)),xt=u(()=>t("sup",null,"1",-1)),Rt=u(()=>t("li",null," 本站所有的安装包仅供交流学习，禁止分享到任何平台，下载后请24小时内及时删除！！！ ",-1)),St=u(()=>t("li",null,"本站的所有安装包均属于基岩版",-1)),It=u(()=>t("li",null,"本站与 Mojang Studio 和 Microsoft 没有从属关系",-1)),Tt=u(()=>t("h2",null,"最新版本",-1)),Bt={class:"tab-p"},zt={class:"tab-p"},Pt={class:"api-tab"},Ut={class:"card-ul"},Et=u(()=>t("h2",null,"架构说明",-1)),Lt=u(()=>t("thead",null,[t("tr",null,[t("th",null,"架构"),t("th",null,"适用情况")])],-1)),Ot=u(()=>t("tbody",null,[t("tr",null,[t("td",null,"ARMv7"),t("td",null,"32位、老旧手机、平板设备 首选使用")]),t("tr",null,[t("td",null,"ARMv8"),t("td",null,"64位、较新手机、平板设备 首选使用")])],-1)),Vt=u(()=>t("h2",null,"API",-1)),Dt={class:"api-tab"},Nt=u(()=>t("thead",null,[t("tr",null,[t("th",null,"参数"),t("th",null,"可选"),t("th",null,"说明")])],-1)),$t=u(()=>t("tbody",null,[t("tr",null,[t("td",null,"b"),t("td",null,"是"),t("td",null,"是否为测试版(不填：获取全部，1：测试版，0：正式版)")])],-1)),Ft=u(()=>t("thead",null,[t("tr",null,[t("th",null,"参数"),t("th",null,"可选"),t("th",null,"说明")])],-1)),Qt=u(()=>t("tbody",null,[t("tr",null,[t("td",null,"s"),t("td",null,"否"),t("td",null,"查询的版本号")]),t("tr",null,[t("td",null,"m"),t("td",null,"是"),t("td",null,"是否启用模糊查询(1：启用)")]),t("tr",null,[t("td",null,"b"),t("td",null,"是"),t("td",null,"是否为测试版(不填/2：获取全部，1：测试版，0：正式版)")])],-1)),Jt=u(()=>t("thead",null,[t("tr",null,[t("th",null,"参数"),t("th",null,"可选"),t("th",null,"说明")])],-1)),qt=u(()=>t("tbody",null,[t("tr",null,[t("td",null,"v"),t("td",null,"否"),t("td",null,"查询的大版本号(例如：1.20.x)")]),t("tr",null,[t("td",null,"b"),t("td",null,"是"),t("td",null,"是否为测试版(不填：获取全部，1：测试版，0：正式版)")])],-1)),Gt=u(()=>t("h2",null,"友情链接",-1)),Kt=u(()=>t("h2",null,null,-1)),Wt=u(()=>t("h2",null,null,-1)),Xt=u(()=>t("h2",null,null,-1)),Ht=u(()=>t("h2",null,null,-1)),Yt={__name:"main",setup(f){mt();const M=c(["addr","attention"]),m=c(0),v=c(0),w=bt([]);let d=c(!1);const j=c(!0);async function x(b,a){const o=JSON.parse(b.link),r=Object.keys(o).map(y=>({name:y,icon:"download"})),_=await pt({actions:r,title:"下载推荐(OneDrive_365>OneDrive_E5>123盘)"});_!=="close"&&(a==="v7"?window.open(o[_.name].ARMv7,"_blank"):o[_.name].ARMv8===""?P.warning("此版本没有ARMv8架构的安装包(>≈1.16.X版本才有)"):window.open(o[_.name].ARMv8,"_blank"))}const O=()=>{window.location.href="minecraft://"};async function V(b){let a;try{const{data:o}=await vt(b);if(o.status===201)return P.error("获取最新版本号失败！");a=o.message,j.value=!1,w.splice(0,w.length,...a)}catch{d.value=!0}}yt(()=>{V()});const h=c(!1);return(b,a)=>{const o=W,R=X,r=H,_=Y,y=Z,D=tt,S=lt,I=nt,p=et,T=at,g=ot,i=st,N=ft,k=ut,B=_t,$=dt,C=it,z=rt,F=G,Q=ct,J=K;return A(),U(L,null,[n(F,{justify:"center",gutter:10},{default:l(()=>[n(o,{class:"j-left",span:22},{default:l(()=>[n(o,null,{default:l(()=>[jt]),_:1})]),_:1}),n(o,{class:"j-left",span:22},{default:l(()=>[t("p",null,[e("这是一个的第三方的资源平台，我们持续给 "),t("span",{onClick:a[0]||(a[0]=s=>h.value=!h.value)},[e(" 网上各大版本库"),xt]),e(" 提供安装包(Android)，同时也是全网安装包(Android)供应的源头之一 ")]),n(R,{show:h.value,"onUpdate:show":a[1]||(a[1]=s=>h.value=s),duration:3e3},{default:l(()=>[e(" 苦力怕论坛、minebbs、小黑论坛等各大版本库平台以及各大搬运工搬运到QQ群、第三方应用商店等 ")]),_:1},8,["show"])]),_:1}),n(o,{span:22},{default:l(()=>[n(D,{modelValue:M.value,"onUpdate:modelValue":a[2]||(a[2]=s=>M.value=s)},{default:l(()=>[n(y,{title:"本站地址",name:"addr"},{icon:l(()=>[n(r,{name:"fire",color:"#00bfa5"})]),default:l(()=>[t("ul",null,[t("li",null,[n(_,{target:"_blank",type:"primary",href:"https://zihao-il.github.io/",underline:"none"},{default:l(()=>[e(" zihao-il.github.io ")]),_:1})]),t("li",null,[n(_,{target:"_blank",type:"primary",href:"https://mc233.endyun.ltd/",underline:"none"},{default:l(()=>[e(" mc233.endyun.ltd（推荐） ")]),_:1})]),t("li",null,[n(_,{target:"_blank",type:"primary",href:"http://bbk.endyun.ltd/",underline:"none"},{default:l(()=>[e(" bbk.endyun.ltd（本站） ")]),_:1})]),t("li",null,[n(_,{target:"_blank",type:"primary",href:"https://www.123pan.com/s/dhm9-6bD0A.html",underline:"none"},{default:l(()=>[e(" 版本库APP下载 ")]),_:1})])])]),_:1}),n(y,{title:"注意",name:"attention"},{icon:l(()=>[n(r,{name:"alert-outline",color:"#ff9100"})]),default:l(()=>[t("ul",null,[Rt,t("li",null,[e("如需要游玩请前往 "),n(_,{target:"_blank",type:"primary",href:"https://www.minecraft.net/",underline:"none"},{default:l(()=>[e(" Minecraft官网 ")]),_:1}),e(" 购买正版！！！ ")]),St,It])]),_:1})]),_:1},8,["modelValue"])]),_:1}),n(o,{class:"j-left",span:22},{default:l(()=>[Tt]),_:1}),n(o,{class:"j-left",span:22},{default:l(()=>[n(T,{active:m.value,"onUpdate:active":a[3]||(a[3]=s=>m.value=s)},{default:l(()=>[n(p,null,{default:l(()=>[e(" 最新正式版 "),t("p",Bt,[n(I,{placement:"top","offset-x":"80",content:"可以用领域、服务器，游戏稳定特性少"},{default:l(()=>[n(S,{color:"#3a7afe",dot:""})]),_:1})])]),_:1}),n(p,null,{default:l(()=>[e(" 最新测试版 "),t("p",zt,[n(I,{placement:"top",content:"可以体验更新的测试功能，游戏不稳定特性多"},{default:l(()=>[n(S,{color:"#3a7afe",dot:""})]),_:1})])]),_:1})]),_:1},8,["active"])]),_:1}),t("div",Pt,[n($,{title:"",rows:3,loading:j.value},{default:l(()=>[n(B,{active:m.value,"onUpdate:active":a[4]||(a[4]=s=>m.value=s)},{default:l(()=>[(A(!0),U(L,null,Ct(w,s=>(A(),wt(k,null,{default:l(()=>[n(N,{title:s.version,subtitle:s.is_beta===0?"正式版":"测试版",layout:"column",ripple:"",outline:"outline",class:gt(s.is_beta===0?"cardr":"cardb")},{description:l(()=>[n(g,null,{default:l(()=>[t("ul",Ut,[t("li",null,[e("更新日志： "),n(_,{type:"primary",target:"_blank",href:"https://minecraft.fandom.com/zh/wiki/%E5%9F%BA%E5%B2%A9%E7%89%88"+s.version,underline:"none"},{default:l(()=>[e("Minecraft Wiki ")]),_:2},1032,["href"])])])]),_:2},1024)]),extra:l(()=>[n(g,null,{default:l(()=>[n(i,{plain:"",onClick:q=>x(s,"v7"),type:"primary"},{right:l(()=>[n(r,{name:"download"})]),default:l(()=>[e(" ARMv7 ")]),_:2},1032,["onClick"]),n(i,{plain:"",onClick:q=>x(s,"v8"),type:"primary"},{right:l(()=>[n(r,{name:"download"})]),default:l(()=>[e(" ARMv8 ")]),_:2},1032,["onClick"])]),_:2},1024)]),_:2},1032,["title","subtitle","class"])]),_:2},1024))),256))]),_:1},8,["active"])]),_:1},8,["loading"])]),n(o,{class:"j-left",span:22},{default:l(()=>[Et]),_:1}),n(o,{class:"j-left",span:22},{default:l(()=>[n(C,null,{default:l(()=>[Lt,Ot]),_:1})]),_:1}),n(o,{class:"j-left",span:22},{default:l(()=>[Vt]),_:1}),n(o,{class:"j-left",span:22},{default:l(()=>[n(T,{active:v.value,"onUpdate:active":a[5]||(a[5]=s=>v.value=s)},{default:l(()=>[n(p,null,{default:l(()=>[e("最新版本")]),_:1}),n(p,null,{default:l(()=>[e("搜索版本")]),_:1}),n(p,null,{default:l(()=>[e("获取版本列表")]),_:1})]),_:1},8,["active"])]),_:1}),t("div",Dt,[n(B,{active:v.value,"onUpdate:active":a[6]||(a[6]=s=>v.value=s)},{default:l(()=>[n(k,null,{default:l(()=>[n(i,{class:"chip-top",round:!1,block:""},{default:l(()=>[e("POST: http://bbk.endyun.ltd:9000/api/last_version ")]),_:1}),n(i,{class:"chip-bottom",round:!1,block:""},{default:l(()=>[e('data = {"b": "1"} ')]),_:1}),n(C,null,{default:l(()=>[Nt,$t]),_:1})]),_:1}),n(k,null,{default:l(()=>[n(i,{class:"chip-top chip-bottom",round:!1,block:""},{default:l(()=>[e("GET: http://bbk.endyun.ltd:9000/api/search_version?s=1.20.1&m=1&b=2 ")]),_:1}),n(C,null,{default:l(()=>[Ft,Qt]),_:1})]),_:1}),n(k,null,{default:l(()=>[n(i,{class:"chip-top",round:!1,block:""},{default:l(()=>[e("POST: http://bbk.endyun.ltd:9000/api/get_version ")]),_:1}),n(i,{class:"chip-bottom",round:!1,block:""},{default:l(()=>[e('data = {"v": "1.20.x", "b": "1"} ')]),_:1}),n(C,null,{default:l(()=>[Jt,qt]),_:1})]),_:1})]),_:1},8,["active"])]),n(o,{class:"j-left",span:22},{default:l(()=>[Gt]),_:1}),n(o,{class:"j-left",span:22},{default:l(()=>[n(g,null,{default:l(()=>[t("ul",null,[t("li",null,[n(_,{type:"primary",target:"_blank",href:"http://bbk.endyun.ltd/",underline:"none"},{default:l(()=>[e("zihao_il的版本库 ")]),_:1})])])]),_:1}),n(z,{class:"fixed-button",round:"",type:"primary",onClick:O},{default:l(()=>[e(" MC启动！ ")]),_:1})]),_:1}),n(o,{class:"j-left",span:22},{default:l(()=>[Kt,Wt,Xt]),_:1}),n(o,{class:"j-left",span:22},{default:l(()=>[Ht]),_:1})]),_:1}),n(J,{"default-style":!1,show:kt(d),"onUpdate:show":a[8]||(a[8]=s=>E(d)?d.value=s:d=s)},{default:l(()=>[n(Q,{class:"result",type:"empty",title:"无法获取版本列表"},{description:l(()=>[t("p",null,[e(" 请前往 "),n(_,{class:"href-link",type:"primary",target:"_blank",href:"https://mc233.endyun.ltd/",underline:"none"},{default:l(()=>[e("静态站 ")]),_:1}),e(" 或联系管理员修复！ ")])]),footer:l(()=>[n(z,{color:"var(--result-empty-color)","text-color":"#fff",onClick:a[7]||(a[7]=s=>E(d)?d.value=!1:d=!1)},{default:l(()=>[e(" 知道了 ")]),_:1})]),_:1})]),_:1},8,["show"])],64)}}},sl=ht(Yt,[["__scopeId","data-v-f7e2f82e"]]);export{sl as default};