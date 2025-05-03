import{r as rt,R as N,w as ot,_ as ht,a as gt,c as bt,P as d,b as Ln}from"./index-CD-NJnkg.js";function oi(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];return rt.useMemo(function(){return t.every(function(n){return n==null})?null:function(n){t.forEach(function(a){Mn(a,n)})}},t)}function Mn(t,e){if(t!=null)if(In(t))t(e);else try{t.current=e}catch{throw new Error('Cannot assign value "'.concat(e,'" to ref "').concat(t,'"'))}}function In(t){return!!(t&&{}.toString.call(t)=="[object Function]")}function Tn(t,e){if(t==null)return{};var n={};for(var a in t)if({}.hasOwnProperty.call(t,a)){if(e.includes(a))continue;n[a]=t[a]}return n}function Lt(t,e){return Lt=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(n,a){return n.__proto__=a,n},Lt(t,e)}function zn(t,e){t.prototype=Object.create(e.prototype),t.prototype.constructor=t,Lt(t,e)}var ce={disabled:!1},Ue=N.createContext(null),Fn=function(e){return e.scrollTop},J="unmounted",U="exited",W="entering",B="entered",Mt="exiting",j=function(t){zn(e,t);function e(a,r){var i;i=t.call(this,a,r)||this;var s=r,o=s&&!s.isMounting?a.enter:a.appear,f;return i.appearStatus=null,a.in?o?(f=U,i.appearStatus=W):f=B:a.unmountOnExit||a.mountOnEnter?f=J:f=U,i.state={status:f},i.nextCallback=null,i}e.getDerivedStateFromProps=function(r,i){var s=r.in;return s&&i.status===J?{status:U}:null};var n=e.prototype;return n.componentDidMount=function(){this.updateStatus(!0,this.appearStatus)},n.componentDidUpdate=function(r){var i=null;if(r!==this.props){var s=this.state.status;this.props.in?s!==W&&s!==B&&(i=W):(s===W||s===B)&&(i=Mt)}this.updateStatus(!1,i)},n.componentWillUnmount=function(){this.cancelNextCallback()},n.getTimeouts=function(){var r=this.props.timeout,i,s,o;return i=s=o=r,r!=null&&typeof r!="number"&&(i=r.exit,s=r.enter,o=r.appear!==void 0?r.appear:s),{exit:i,enter:s,appear:o}},n.updateStatus=function(r,i){if(r===void 0&&(r=!1),i!==null)if(this.cancelNextCallback(),i===W){if(this.props.unmountOnExit||this.props.mountOnEnter){var s=this.props.nodeRef?this.props.nodeRef.current:ot.findDOMNode(this);s&&Fn(s)}this.performEnter(r)}else this.performExit();else this.props.unmountOnExit&&this.state.status===U&&this.setState({status:J})},n.performEnter=function(r){var i=this,s=this.props.enter,o=this.context?this.context.isMounting:r,f=this.props.nodeRef?[o]:[ot.findDOMNode(this),o],c=f[0],u=f[1],h=this.getTimeouts(),p=o?h.appear:h.enter;if(!r&&!s||ce.disabled){this.safeSetState({status:B},function(){i.props.onEntered(c)});return}this.props.onEnter(c,u),this.safeSetState({status:W},function(){i.props.onEntering(c,u),i.onTransitionEnd(p,function(){i.safeSetState({status:B},function(){i.props.onEntered(c,u)})})})},n.performExit=function(){var r=this,i=this.props.exit,s=this.getTimeouts(),o=this.props.nodeRef?void 0:ot.findDOMNode(this);if(!i||ce.disabled){this.safeSetState({status:U},function(){r.props.onExited(o)});return}this.props.onExit(o),this.safeSetState({status:Mt},function(){r.props.onExiting(o),r.onTransitionEnd(s.exit,function(){r.safeSetState({status:U},function(){r.props.onExited(o)})})})},n.cancelNextCallback=function(){this.nextCallback!==null&&(this.nextCallback.cancel(),this.nextCallback=null)},n.safeSetState=function(r,i){i=this.setNextCallback(i),this.setState(r,i)},n.setNextCallback=function(r){var i=this,s=!0;return this.nextCallback=function(o){s&&(s=!1,i.nextCallback=null,r(o))},this.nextCallback.cancel=function(){s=!1},this.nextCallback},n.onTransitionEnd=function(r,i){this.setNextCallback(i);var s=this.props.nodeRef?this.props.nodeRef.current:ot.findDOMNode(this),o=r==null&&!this.props.addEndListener;if(!s||o){setTimeout(this.nextCallback,0);return}if(this.props.addEndListener){var f=this.props.nodeRef?[this.nextCallback]:[s,this.nextCallback],c=f[0],u=f[1];this.props.addEndListener(c,u)}r!=null&&setTimeout(this.nextCallback,r)},n.render=function(){var r=this.state.status;if(r===J)return null;var i=this.props,s=i.children;i.in,i.mountOnEnter,i.unmountOnExit,i.appear,i.enter,i.exit,i.timeout,i.addEndListener,i.onEnter,i.onEntering,i.onEntered,i.onExit,i.onExiting,i.onExited,i.nodeRef;var o=Tn(i,["children","in","mountOnEnter","unmountOnExit","appear","enter","exit","timeout","addEndListener","onEnter","onEntering","onEntered","onExit","onExiting","onExited","nodeRef"]);return N.createElement(Ue.Provider,{value:null},typeof s=="function"?s(r,o):N.cloneElement(N.Children.only(s),o))},e}(N.Component);j.contextType=Ue;j.propTypes={};function X(){}j.defaultProps={in:!1,mountOnEnter:!1,unmountOnExit:!1,appear:!1,enter:!0,exit:!0,onEnter:X,onEntering:X,onEntered:X,onExit:X,onExiting:X,onExited:X};j.UNMOUNTED=J;j.EXITED=U;j.ENTERING=W;j.ENTERED=B;j.EXITING=Mt;var We=rt.forwardRef(function(t,e){var n=t.className,a=t.dark,r=t.disabled,i=t.white,s=ht(t,["className","dark","disabled","white"]);return N.createElement("button",gt({type:"button",className:bt("btn","btn-close",{"btn-close-white":i},r,n),"aria-label":"Close",disabled:r},a&&{"data-coreui-theme":"dark"},s,{ref:e}))});We.propTypes={className:d.string,dark:d.bool,disabled:d.bool,white:d.bool};We.displayName="CCloseButton";var Qt=rt.forwardRef(function(t,e){var n=t.children,a=t.active,r=t.as,i=r===void 0?"a":r,s=t.className,o=t.disabled,f=ht(t,["children","active","as","className","disabled"]);return N.createElement(i,gt({className:bt(s,{active:a,disabled:o})},a&&{"aria-current":"page"},i==="a"&&o&&{"aria-disabled":!0,tabIndex:-1},(i==="a"||i==="button")&&{onClick:function(c){c.preventDefault,!o&&f.onClick&&f.onClick(c)}},{disabled:o},f,{ref:e}),n)});Qt.propTypes={active:d.bool,as:d.elementType,children:d.node,className:d.string,disabled:d.bool};Qt.displayName="CLink";var Ye=rt.forwardRef(function(t,e){var n,a=t.children,r=t.as,i=r===void 0?"button":r,s=t.className,o=t.color,f=t.shape,c=t.size,u=t.type,h=u===void 0?"button":u,p=t.variant,b=ht(t,["children","as","className","color","shape","size","type","variant"]);return N.createElement(Qt,gt({as:b.href?"a":i},!b.href&&{type:h},{className:bt("btn",(n={},n["btn-".concat(o)]=o&&!p,n["btn-".concat(p,"-").concat(o)]=o&&p,n["btn-".concat(c)]=c,n),f,s)},b,{ref:e}),a)});Ye.propTypes={as:d.elementType,children:d.node,className:d.string,color:Ln,shape:d.string,size:d.oneOf(["sm","lg"]),type:d.oneOf(["button","submit","reset"]),variant:d.oneOf(["outline","ghost"])};Ye.displayName="CButton";var _n=["xxl","xl","lg","md","sm","fluid"],He=rt.forwardRef(function(t,e){var n=t.children,a=t.className,r=ht(t,["children","className"]),i=[];return _n.forEach(function(s){var o=r[s];delete r[s],o&&i.push("container-".concat(s))}),N.createElement("div",gt({className:bt(i.length>0?i:"container",a)},r,{ref:e}),n)});He.propTypes={children:d.node,className:d.string,sm:d.bool,md:d.bool,lg:d.bool,xl:d.bool,xxl:d.bool,fluid:d.bool};He.displayName="CContainer";/*!
 * Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com
 * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
 * Copyright 2024 Fonticons, Inc.
 */function Rn(t,e,n){return(e=jn(e))in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function fe(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);e&&(a=a.filter(function(r){return Object.getOwnPropertyDescriptor(t,r).enumerable})),n.push.apply(n,a)}return n}function l(t){for(var e=1;e<arguments.length;e++){var n=arguments[e]!=null?arguments[e]:{};e%2?fe(Object(n),!0).forEach(function(a){Rn(t,a,n[a])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):fe(Object(n)).forEach(function(a){Object.defineProperty(t,a,Object.getOwnPropertyDescriptor(n,a))})}return t}function Dn(t,e){if(typeof t!="object"||!t)return t;var n=t[Symbol.toPrimitive];if(n!==void 0){var a=n.call(t,e);if(typeof a!="object")return a;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}function jn(t){var e=Dn(t,"string");return typeof e=="symbol"?e:e+""}const ue=()=>{};let Jt={},Ge={},Xe=null,Be={mark:ue,measure:ue};try{typeof window<"u"&&(Jt=window),typeof document<"u"&&(Ge=document),typeof MutationObserver<"u"&&(Xe=MutationObserver),typeof performance<"u"&&(Be=performance)}catch{}const{userAgent:de=""}=Jt.navigator||{},_=Jt,g=Ge,me=Xe,lt=Be;_.document;const z=!!g.documentElement&&!!g.head&&typeof g.addEventListener=="function"&&typeof g.createElement=="function",$e=~de.indexOf("MSIE")||~de.indexOf("Trident/");var Un=/fa(s|r|l|t|d|dr|dl|dt|b|k|kd|ss|sr|sl|st|sds|sdr|sdl|sdt)?[\-\ ]/,Wn=/Font ?Awesome ?([56 ]*)(Solid|Regular|Light|Thin|Duotone|Brands|Free|Pro|Sharp Duotone|Sharp|Kit)?.*/i,Ve={classic:{fa:"solid",fas:"solid","fa-solid":"solid",far:"regular","fa-regular":"regular",fal:"light","fa-light":"light",fat:"thin","fa-thin":"thin",fab:"brands","fa-brands":"brands"},duotone:{fa:"solid",fad:"solid","fa-solid":"solid","fa-duotone":"solid",fadr:"regular","fa-regular":"regular",fadl:"light","fa-light":"light",fadt:"thin","fa-thin":"thin"},sharp:{fa:"solid",fass:"solid","fa-solid":"solid",fasr:"regular","fa-regular":"regular",fasl:"light","fa-light":"light",fast:"thin","fa-thin":"thin"},"sharp-duotone":{fa:"solid",fasds:"solid","fa-solid":"solid",fasdr:"regular","fa-regular":"regular",fasdl:"light","fa-light":"light",fasdt:"thin","fa-thin":"thin"}},Yn={GROUP:"duotone-group",PRIMARY:"primary",SECONDARY:"secondary"},Ke=["fa-classic","fa-duotone","fa-sharp","fa-sharp-duotone"],E="classic",yt="duotone",Hn="sharp",Gn="sharp-duotone",qe=[E,yt,Hn,Gn],Xn={classic:{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},duotone:{900:"fad",400:"fadr",300:"fadl",100:"fadt"},sharp:{900:"fass",400:"fasr",300:"fasl",100:"fast"},"sharp-duotone":{900:"fasds",400:"fasdr",300:"fasdl",100:"fasdt"}},Bn={"Font Awesome 6 Free":{900:"fas",400:"far"},"Font Awesome 6 Pro":{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},"Font Awesome 6 Brands":{400:"fab",normal:"fab"},"Font Awesome 6 Duotone":{900:"fad",400:"fadr",normal:"fadr",300:"fadl",100:"fadt"},"Font Awesome 6 Sharp":{900:"fass",400:"fasr",normal:"fasr",300:"fasl",100:"fast"},"Font Awesome 6 Sharp Duotone":{900:"fasds",400:"fasdr",normal:"fasdr",300:"fasdl",100:"fasdt"}},$n=new Map([["classic",{defaultShortPrefixId:"fas",defaultStyleId:"solid",styleIds:["solid","regular","light","thin","brands"],futureStyleIds:[],defaultFontWeight:900}],["sharp",{defaultShortPrefixId:"fass",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["duotone",{defaultShortPrefixId:"fad",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["sharp-duotone",{defaultShortPrefixId:"fasds",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}]]),Vn={classic:{solid:"fas",regular:"far",light:"fal",thin:"fat",brands:"fab"},duotone:{solid:"fad",regular:"fadr",light:"fadl",thin:"fadt"},sharp:{solid:"fass",regular:"fasr",light:"fasl",thin:"fast"},"sharp-duotone":{solid:"fasds",regular:"fasdr",light:"fasdl",thin:"fasdt"}},Kn=["fak","fa-kit","fakd","fa-kit-duotone"],pe={kit:{fak:"kit","fa-kit":"kit"},"kit-duotone":{fakd:"kit-duotone","fa-kit-duotone":"kit-duotone"}},qn=["kit"],Qn={kit:{"fa-kit":"fak"}},Jn=["fak","fakd"],Zn={kit:{fak:"fa-kit"}},he={kit:{kit:"fak"},"kit-duotone":{"kit-duotone":"fakd"}},ct={GROUP:"duotone-group",SWAP_OPACITY:"swap-opacity",PRIMARY:"primary",SECONDARY:"secondary"},ta=["fa-classic","fa-duotone","fa-sharp","fa-sharp-duotone"],ea=["fak","fa-kit","fakd","fa-kit-duotone"],na={"Font Awesome Kit":{400:"fak",normal:"fak"},"Font Awesome Kit Duotone":{400:"fakd",normal:"fakd"}},aa={classic:{"fa-brands":"fab","fa-duotone":"fad","fa-light":"fal","fa-regular":"far","fa-solid":"fas","fa-thin":"fat"},duotone:{"fa-regular":"fadr","fa-light":"fadl","fa-thin":"fadt"},sharp:{"fa-solid":"fass","fa-regular":"fasr","fa-light":"fasl","fa-thin":"fast"},"sharp-duotone":{"fa-solid":"fasds","fa-regular":"fasdr","fa-light":"fasdl","fa-thin":"fasdt"}},ra={classic:["fas","far","fal","fat","fad"],duotone:["fadr","fadl","fadt"],sharp:["fass","fasr","fasl","fast"],"sharp-duotone":["fasds","fasdr","fasdl","fasdt"]},It={classic:{fab:"fa-brands",fad:"fa-duotone",fal:"fa-light",far:"fa-regular",fas:"fa-solid",fat:"fa-thin"},duotone:{fadr:"fa-regular",fadl:"fa-light",fadt:"fa-thin"},sharp:{fass:"fa-solid",fasr:"fa-regular",fasl:"fa-light",fast:"fa-thin"},"sharp-duotone":{fasds:"fa-solid",fasdr:"fa-regular",fasdl:"fa-light",fasdt:"fa-thin"}},ia=["fa-solid","fa-regular","fa-light","fa-thin","fa-duotone","fa-brands"],Tt=["fa","fas","far","fal","fat","fad","fadr","fadl","fadt","fab","fass","fasr","fasl","fast","fasds","fasdr","fasdl","fasdt",...ta,...ia],sa=["solid","regular","light","thin","duotone","brands"],Qe=[1,2,3,4,5,6,7,8,9,10],oa=Qe.concat([11,12,13,14,15,16,17,18,19,20]),la=[...Object.keys(ra),...sa,"2xs","xs","sm","lg","xl","2xl","beat","border","fade","beat-fade","bounce","flip-both","flip-horizontal","flip-vertical","flip","fw","inverse","layers-counter","layers-text","layers","li","pull-left","pull-right","pulse","rotate-180","rotate-270","rotate-90","rotate-by","shake","spin-pulse","spin-reverse","spin","stack-1x","stack-2x","stack","ul",ct.GROUP,ct.SWAP_OPACITY,ct.PRIMARY,ct.SECONDARY].concat(Qe.map(t=>"".concat(t,"x"))).concat(oa.map(t=>"w-".concat(t))),ca={"Font Awesome 5 Free":{900:"fas",400:"far"},"Font Awesome 5 Pro":{900:"fas",400:"far",normal:"far",300:"fal"},"Font Awesome 5 Brands":{400:"fab",normal:"fab"},"Font Awesome 5 Duotone":{900:"fad"}};const I="___FONT_AWESOME___",zt=16,Je="fa",Ze="svg-inline--fa",H="data-fa-i2svg",Ft="data-fa-pseudo-element",fa="data-fa-pseudo-element-pending",Zt="data-prefix",te="data-icon",ge="fontawesome-i2svg",ua="async",da=["HTML","HEAD","STYLE","SCRIPT"],tn=(()=>{try{return!0}catch{return!1}})();function it(t){return new Proxy(t,{get(e,n){return n in e?e[n]:e[E]}})}const en=l({},Ve);en[E]=l(l(l(l({},{"fa-duotone":"duotone"}),Ve[E]),pe.kit),pe["kit-duotone"]);const ma=it(en),_t=l({},Vn);_t[E]=l(l(l(l({},{duotone:"fad"}),_t[E]),he.kit),he["kit-duotone"]);const be=it(_t),Rt=l({},It);Rt[E]=l(l({},Rt[E]),Zn.kit);const ee=it(Rt),Dt=l({},aa);Dt[E]=l(l({},Dt[E]),Qn.kit);it(Dt);const pa=Un,nn="fa-layers-text",ha=Wn,ga=l({},Xn);it(ga);const ba=["class","data-prefix","data-icon","data-fa-transform","data-fa-mask"],Ct=Yn,ya=[...qn,...la],tt=_.FontAwesomeConfig||{};function va(t){var e=g.querySelector("script["+t+"]");if(e)return e.getAttribute(t)}function xa(t){return t===""?!0:t==="false"?!1:t==="true"?!0:t}g&&typeof g.querySelector=="function"&&[["data-family-prefix","familyPrefix"],["data-css-prefix","cssPrefix"],["data-family-default","familyDefault"],["data-style-default","styleDefault"],["data-replacement-class","replacementClass"],["data-auto-replace-svg","autoReplaceSvg"],["data-auto-add-css","autoAddCss"],["data-auto-a11y","autoA11y"],["data-search-pseudo-elements","searchPseudoElements"],["data-observe-mutations","observeMutations"],["data-mutate-approach","mutateApproach"],["data-keep-original-source","keepOriginalSource"],["data-measure-performance","measurePerformance"],["data-show-missing-icons","showMissingIcons"]].forEach(e=>{let[n,a]=e;const r=xa(va(n));r!=null&&(tt[a]=r)});const an={styleDefault:"solid",familyDefault:E,cssPrefix:Je,replacementClass:Ze,autoReplaceSvg:!0,autoAddCss:!0,autoA11y:!0,searchPseudoElements:!1,observeMutations:!0,mutateApproach:"async",keepOriginalSource:!0,measurePerformance:!1,showMissingIcons:!0};tt.familyPrefix&&(tt.cssPrefix=tt.familyPrefix);const q=l(l({},an),tt);q.autoReplaceSvg||(q.observeMutations=!1);const m={};Object.keys(an).forEach(t=>{Object.defineProperty(m,t,{enumerable:!0,set:function(e){q[t]=e,et.forEach(n=>n(m))},get:function(){return q[t]}})});Object.defineProperty(m,"familyPrefix",{enumerable:!0,set:function(t){q.cssPrefix=t,et.forEach(e=>e(m))},get:function(){return q.cssPrefix}});_.FontAwesomeConfig=m;const et=[];function Ea(t){return et.push(t),()=>{et.splice(et.indexOf(t),1)}}const F=zt,P={size:16,x:0,y:0,rotate:0,flipX:!1,flipY:!1};function Aa(t){if(!t||!z)return;const e=g.createElement("style");e.setAttribute("type","text/css"),e.innerHTML=t;const n=g.head.childNodes;let a=null;for(let r=n.length-1;r>-1;r--){const i=n[r],s=(i.tagName||"").toUpperCase();["STYLE","LINK"].indexOf(s)>-1&&(a=i)}return g.head.insertBefore(e,a),t}const ka="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";function nt(){let t=12,e="";for(;t-- >0;)e+=ka[Math.random()*62|0];return e}function Q(t){const e=[];for(let n=(t||[]).length>>>0;n--;)e[n]=t[n];return e}function ne(t){return t.classList?Q(t.classList):(t.getAttribute("class")||"").split(" ").filter(e=>e)}function rn(t){return"".concat(t).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function Ca(t){return Object.keys(t||{}).reduce((e,n)=>e+"".concat(n,'="').concat(rn(t[n]),'" '),"").trim()}function vt(t){return Object.keys(t||{}).reduce((e,n)=>e+"".concat(n,": ").concat(t[n].trim(),";"),"")}function ae(t){return t.size!==P.size||t.x!==P.x||t.y!==P.y||t.rotate!==P.rotate||t.flipX||t.flipY}function Oa(t){let{transform:e,containerWidth:n,iconWidth:a}=t;const r={transform:"translate(".concat(n/2," 256)")},i="translate(".concat(e.x*32,", ").concat(e.y*32,") "),s="scale(".concat(e.size/16*(e.flipX?-1:1),", ").concat(e.size/16*(e.flipY?-1:1),") "),o="rotate(".concat(e.rotate," 0 0)"),f={transform:"".concat(i," ").concat(s," ").concat(o)},c={transform:"translate(".concat(a/2*-1," -256)")};return{outer:r,inner:f,path:c}}function Sa(t){let{transform:e,width:n=zt,height:a=zt,startCentered:r=!1}=t,i="";return r&&$e?i+="translate(".concat(e.x/F-n/2,"em, ").concat(e.y/F-a/2,"em) "):r?i+="translate(calc(-50% + ".concat(e.x/F,"em), calc(-50% + ").concat(e.y/F,"em)) "):i+="translate(".concat(e.x/F,"em, ").concat(e.y/F,"em) "),i+="scale(".concat(e.size/F*(e.flipX?-1:1),", ").concat(e.size/F*(e.flipY?-1:1),") "),i+="rotate(".concat(e.rotate,"deg) "),i}var Na=`:root, :host {
  --fa-font-solid: normal 900 1em/1 "Font Awesome 6 Free";
  --fa-font-regular: normal 400 1em/1 "Font Awesome 6 Free";
  --fa-font-light: normal 300 1em/1 "Font Awesome 6 Pro";
  --fa-font-thin: normal 100 1em/1 "Font Awesome 6 Pro";
  --fa-font-duotone: normal 900 1em/1 "Font Awesome 6 Duotone";
  --fa-font-duotone-regular: normal 400 1em/1 "Font Awesome 6 Duotone";
  --fa-font-duotone-light: normal 300 1em/1 "Font Awesome 6 Duotone";
  --fa-font-duotone-thin: normal 100 1em/1 "Font Awesome 6 Duotone";
  --fa-font-brands: normal 400 1em/1 "Font Awesome 6 Brands";
  --fa-font-sharp-solid: normal 900 1em/1 "Font Awesome 6 Sharp";
  --fa-font-sharp-regular: normal 400 1em/1 "Font Awesome 6 Sharp";
  --fa-font-sharp-light: normal 300 1em/1 "Font Awesome 6 Sharp";
  --fa-font-sharp-thin: normal 100 1em/1 "Font Awesome 6 Sharp";
  --fa-font-sharp-duotone-solid: normal 900 1em/1 "Font Awesome 6 Sharp Duotone";
  --fa-font-sharp-duotone-regular: normal 400 1em/1 "Font Awesome 6 Sharp Duotone";
  --fa-font-sharp-duotone-light: normal 300 1em/1 "Font Awesome 6 Sharp Duotone";
  --fa-font-sharp-duotone-thin: normal 100 1em/1 "Font Awesome 6 Sharp Duotone";
}

svg:not(:root).svg-inline--fa, svg:not(:host).svg-inline--fa {
  overflow: visible;
  box-sizing: content-box;
}

.svg-inline--fa {
  display: var(--fa-display, inline-block);
  height: 1em;
  overflow: visible;
  vertical-align: -0.125em;
}
.svg-inline--fa.fa-2xs {
  vertical-align: 0.1em;
}
.svg-inline--fa.fa-xs {
  vertical-align: 0em;
}
.svg-inline--fa.fa-sm {
  vertical-align: -0.0714285705em;
}
.svg-inline--fa.fa-lg {
  vertical-align: -0.2em;
}
.svg-inline--fa.fa-xl {
  vertical-align: -0.25em;
}
.svg-inline--fa.fa-2xl {
  vertical-align: -0.3125em;
}
.svg-inline--fa.fa-pull-left {
  margin-right: var(--fa-pull-margin, 0.3em);
  width: auto;
}
.svg-inline--fa.fa-pull-right {
  margin-left: var(--fa-pull-margin, 0.3em);
  width: auto;
}
.svg-inline--fa.fa-li {
  width: var(--fa-li-width, 2em);
  top: 0.25em;
}
.svg-inline--fa.fa-fw {
  width: var(--fa-fw-width, 1.25em);
}

.fa-layers svg.svg-inline--fa {
  bottom: 0;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;
}

.fa-layers-counter, .fa-layers-text {
  display: inline-block;
  position: absolute;
  text-align: center;
}

.fa-layers {
  display: inline-block;
  height: 1em;
  position: relative;
  text-align: center;
  vertical-align: -0.125em;
  width: 1em;
}
.fa-layers svg.svg-inline--fa {
  transform-origin: center center;
}

.fa-layers-text {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transform-origin: center center;
}

.fa-layers-counter {
  background-color: var(--fa-counter-background-color, #ff253a);
  border-radius: var(--fa-counter-border-radius, 1em);
  box-sizing: border-box;
  color: var(--fa-inverse, #fff);
  line-height: var(--fa-counter-line-height, 1);
  max-width: var(--fa-counter-max-width, 5em);
  min-width: var(--fa-counter-min-width, 1.5em);
  overflow: hidden;
  padding: var(--fa-counter-padding, 0.25em 0.5em);
  right: var(--fa-right, 0);
  text-overflow: ellipsis;
  top: var(--fa-top, 0);
  transform: scale(var(--fa-counter-scale, 0.25));
  transform-origin: top right;
}

.fa-layers-bottom-right {
  bottom: var(--fa-bottom, 0);
  right: var(--fa-right, 0);
  top: auto;
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: bottom right;
}

.fa-layers-bottom-left {
  bottom: var(--fa-bottom, 0);
  left: var(--fa-left, 0);
  right: auto;
  top: auto;
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: bottom left;
}

.fa-layers-top-right {
  top: var(--fa-top, 0);
  right: var(--fa-right, 0);
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: top right;
}

.fa-layers-top-left {
  left: var(--fa-left, 0);
  right: auto;
  top: var(--fa-top, 0);
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: top left;
}

.fa-1x {
  font-size: 1em;
}

.fa-2x {
  font-size: 2em;
}

.fa-3x {
  font-size: 3em;
}

.fa-4x {
  font-size: 4em;
}

.fa-5x {
  font-size: 5em;
}

.fa-6x {
  font-size: 6em;
}

.fa-7x {
  font-size: 7em;
}

.fa-8x {
  font-size: 8em;
}

.fa-9x {
  font-size: 9em;
}

.fa-10x {
  font-size: 10em;
}

.fa-2xs {
  font-size: 0.625em;
  line-height: 0.1em;
  vertical-align: 0.225em;
}

.fa-xs {
  font-size: 0.75em;
  line-height: 0.0833333337em;
  vertical-align: 0.125em;
}

.fa-sm {
  font-size: 0.875em;
  line-height: 0.0714285718em;
  vertical-align: 0.0535714295em;
}

.fa-lg {
  font-size: 1.25em;
  line-height: 0.05em;
  vertical-align: -0.075em;
}

.fa-xl {
  font-size: 1.5em;
  line-height: 0.0416666682em;
  vertical-align: -0.125em;
}

.fa-2xl {
  font-size: 2em;
  line-height: 0.03125em;
  vertical-align: -0.1875em;
}

.fa-fw {
  text-align: center;
  width: 1.25em;
}

.fa-ul {
  list-style-type: none;
  margin-left: var(--fa-li-margin, 2.5em);
  padding-left: 0;
}
.fa-ul > li {
  position: relative;
}

.fa-li {
  left: calc(-1 * var(--fa-li-width, 2em));
  position: absolute;
  text-align: center;
  width: var(--fa-li-width, 2em);
  line-height: inherit;
}

.fa-border {
  border-color: var(--fa-border-color, #eee);
  border-radius: var(--fa-border-radius, 0.1em);
  border-style: var(--fa-border-style, solid);
  border-width: var(--fa-border-width, 0.08em);
  padding: var(--fa-border-padding, 0.2em 0.25em 0.15em);
}

.fa-pull-left {
  float: left;
  margin-right: var(--fa-pull-margin, 0.3em);
}

.fa-pull-right {
  float: right;
  margin-left: var(--fa-pull-margin, 0.3em);
}

.fa-beat {
  animation-name: fa-beat;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-bounce {
  animation-name: fa-bounce;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));
}

.fa-fade {
  animation-name: fa-fade;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
}

.fa-beat-fade {
  animation-name: fa-beat-fade;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
}

.fa-flip {
  animation-name: fa-flip;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-shake {
  animation-name: fa-shake;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin {
  animation-name: fa-spin;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 2s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin-reverse {
  --fa-animation-direction: reverse;
}

.fa-pulse,
.fa-spin-pulse {
  animation-name: fa-spin;
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, steps(8));
}

@media (prefers-reduced-motion: reduce) {
  .fa-beat,
.fa-bounce,
.fa-fade,
.fa-beat-fade,
.fa-flip,
.fa-pulse,
.fa-shake,
.fa-spin,
.fa-spin-pulse {
    animation-delay: -1ms;
    animation-duration: 1ms;
    animation-iteration-count: 1;
    transition-delay: 0s;
    transition-duration: 0s;
  }
}
@keyframes fa-beat {
  0%, 90% {
    transform: scale(1);
  }
  45% {
    transform: scale(var(--fa-beat-scale, 1.25));
  }
}
@keyframes fa-bounce {
  0% {
    transform: scale(1, 1) translateY(0);
  }
  10% {
    transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);
  }
  30% {
    transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));
  }
  50% {
    transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);
  }
  57% {
    transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));
  }
  64% {
    transform: scale(1, 1) translateY(0);
  }
  100% {
    transform: scale(1, 1) translateY(0);
  }
}
@keyframes fa-fade {
  50% {
    opacity: var(--fa-fade-opacity, 0.4);
  }
}
@keyframes fa-beat-fade {
  0%, 100% {
    opacity: var(--fa-beat-fade-opacity, 0.4);
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(var(--fa-beat-fade-scale, 1.125));
  }
}
@keyframes fa-flip {
  50% {
    transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));
  }
}
@keyframes fa-shake {
  0% {
    transform: rotate(-15deg);
  }
  4% {
    transform: rotate(15deg);
  }
  8%, 24% {
    transform: rotate(-18deg);
  }
  12%, 28% {
    transform: rotate(18deg);
  }
  16% {
    transform: rotate(-22deg);
  }
  20% {
    transform: rotate(22deg);
  }
  32% {
    transform: rotate(-12deg);
  }
  36% {
    transform: rotate(12deg);
  }
  40%, 100% {
    transform: rotate(0deg);
  }
}
@keyframes fa-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.fa-rotate-90 {
  transform: rotate(90deg);
}

.fa-rotate-180 {
  transform: rotate(180deg);
}

.fa-rotate-270 {
  transform: rotate(270deg);
}

.fa-flip-horizontal {
  transform: scale(-1, 1);
}

.fa-flip-vertical {
  transform: scale(1, -1);
}

.fa-flip-both,
.fa-flip-horizontal.fa-flip-vertical {
  transform: scale(-1, -1);
}

.fa-rotate-by {
  transform: rotate(var(--fa-rotate-angle, 0));
}

.fa-stack {
  display: inline-block;
  vertical-align: middle;
  height: 2em;
  position: relative;
  width: 2.5em;
}

.fa-stack-1x,
.fa-stack-2x {
  bottom: 0;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;
  z-index: var(--fa-stack-z-index, auto);
}

.svg-inline--fa.fa-stack-1x {
  height: 1em;
  width: 1.25em;
}
.svg-inline--fa.fa-stack-2x {
  height: 2em;
  width: 2.5em;
}

.fa-inverse {
  color: var(--fa-inverse, #fff);
}

.sr-only,
.fa-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.sr-only-focusable:not(:focus),
.fa-sr-only-focusable:not(:focus) {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.svg-inline--fa .fa-primary {
  fill: var(--fa-primary-color, currentColor);
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa .fa-secondary {
  fill: var(--fa-secondary-color, currentColor);
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-primary {
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-secondary {
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa mask .fa-primary,
.svg-inline--fa mask .fa-secondary {
  fill: black;
}`;function sn(){const t=Je,e=Ze,n=m.cssPrefix,a=m.replacementClass;let r=Na;if(n!==t||a!==e){const i=new RegExp("\\.".concat(t,"\\-"),"g"),s=new RegExp("\\--".concat(t,"\\-"),"g"),o=new RegExp("\\.".concat(e),"g");r=r.replace(i,".".concat(n,"-")).replace(s,"--".concat(n,"-")).replace(o,".".concat(a))}return r}let ye=!1;function Ot(){m.autoAddCss&&!ye&&(Aa(sn()),ye=!0)}var wa={mixout(){return{dom:{css:sn,insertCss:Ot}}},hooks(){return{beforeDOMElementCreation(){Ot()},beforeI2svg(){Ot()}}}};const T=_||{};T[I]||(T[I]={});T[I].styles||(T[I].styles={});T[I].hooks||(T[I].hooks={});T[I].shims||(T[I].shims=[]);var L=T[I];const on=[],ln=function(){g.removeEventListener("DOMContentLoaded",ln),dt=1,on.map(t=>t())};let dt=!1;z&&(dt=(g.documentElement.doScroll?/^loaded|^c/:/^loaded|^i|^c/).test(g.readyState),dt||g.addEventListener("DOMContentLoaded",ln));function Pa(t){z&&(dt?setTimeout(t,0):on.push(t))}function st(t){const{tag:e,attributes:n={},children:a=[]}=t;return typeof t=="string"?rn(t):"<".concat(e," ").concat(Ca(n),">").concat(a.map(st).join(""),"</").concat(e,">")}function ve(t,e,n){if(t&&t[e]&&t[e][n])return{prefix:e,iconName:n,icon:t[e][n]}}var St=function(e,n,a,r){var i=Object.keys(e),s=i.length,o=n,f,c,u;for(a===void 0?(f=1,u=e[i[0]]):(f=0,u=a);f<s;f++)c=i[f],u=o(u,e[c],c,e);return u};function La(t){const e=[];let n=0;const a=t.length;for(;n<a;){const r=t.charCodeAt(n++);if(r>=55296&&r<=56319&&n<a){const i=t.charCodeAt(n++);(i&64512)==56320?e.push(((r&1023)<<10)+(i&1023)+65536):(e.push(r),n--)}else e.push(r)}return e}function jt(t){const e=La(t);return e.length===1?e[0].toString(16):null}function Ma(t,e){const n=t.length;let a=t.charCodeAt(e),r;return a>=55296&&a<=56319&&n>e+1&&(r=t.charCodeAt(e+1),r>=56320&&r<=57343)?(a-55296)*1024+r-56320+65536:a}function xe(t){return Object.keys(t).reduce((e,n)=>{const a=t[n];return!!a.icon?e[a.iconName]=a.icon:e[n]=a,e},{})}function Ut(t,e){let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{};const{skipHooks:a=!1}=n,r=xe(e);typeof L.hooks.addPack=="function"&&!a?L.hooks.addPack(t,xe(e)):L.styles[t]=l(l({},L.styles[t]||{}),r),t==="fas"&&Ut("fa",e)}const{styles:at,shims:Ia}=L,cn=Object.keys(ee),Ta=cn.reduce((t,e)=>(t[e]=Object.keys(ee[e]),t),{});let re=null,fn={},un={},dn={},mn={},pn={};function za(t){return~ya.indexOf(t)}function Fa(t,e){const n=e.split("-"),a=n[0],r=n.slice(1).join("-");return a===t&&r!==""&&!za(r)?r:null}const hn=()=>{const t=a=>St(at,(r,i,s)=>(r[s]=St(i,a,{}),r),{});fn=t((a,r,i)=>(r[3]&&(a[r[3]]=i),r[2]&&r[2].filter(o=>typeof o=="number").forEach(o=>{a[o.toString(16)]=i}),a)),un=t((a,r,i)=>(a[i]=i,r[2]&&r[2].filter(o=>typeof o=="string").forEach(o=>{a[o]=i}),a)),pn=t((a,r,i)=>{const s=r[2];return a[i]=i,s.forEach(o=>{a[o]=i}),a});const e="far"in at||m.autoFetchSvg,n=St(Ia,(a,r)=>{const i=r[0];let s=r[1];const o=r[2];return s==="far"&&!e&&(s="fas"),typeof i=="string"&&(a.names[i]={prefix:s,iconName:o}),typeof i=="number"&&(a.unicodes[i.toString(16)]={prefix:s,iconName:o}),a},{names:{},unicodes:{}});dn=n.names,mn=n.unicodes,re=xt(m.styleDefault,{family:m.familyDefault})};Ea(t=>{re=xt(t.styleDefault,{family:m.familyDefault})});hn();function ie(t,e){return(fn[t]||{})[e]}function _a(t,e){return(un[t]||{})[e]}function Y(t,e){return(pn[t]||{})[e]}function gn(t){return dn[t]||{prefix:null,iconName:null}}function Ra(t){const e=mn[t],n=ie("fas",t);return e||(n?{prefix:"fas",iconName:n}:null)||{prefix:null,iconName:null}}function R(){return re}const bn=()=>({prefix:null,iconName:null,rest:[]});function Da(t){let e=E;const n=cn.reduce((a,r)=>(a[r]="".concat(m.cssPrefix,"-").concat(r),a),{});return qe.forEach(a=>{(t.includes(n[a])||t.some(r=>Ta[a].includes(r)))&&(e=a)}),e}function xt(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{family:n=E}=e,a=ma[n][t];if(n===yt&&!t)return"fad";const r=be[n][t]||be[n][a],i=t in L.styles?t:null;return r||i||null}function ja(t){let e=[],n=null;return t.forEach(a=>{const r=Fa(m.cssPrefix,a);r?n=r:a&&e.push(a)}),{iconName:n,rest:e}}function Ee(t){return t.sort().filter((e,n,a)=>a.indexOf(e)===n)}function Et(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{skipLookups:n=!1}=e;let a=null;const r=Tt.concat(ea),i=Ee(t.filter(h=>r.includes(h))),s=Ee(t.filter(h=>!Tt.includes(h))),o=i.filter(h=>(a=h,!Ke.includes(h))),[f=null]=o,c=Da(i),u=l(l({},ja(s)),{},{prefix:xt(f,{family:c})});return l(l(l({},u),Ha({values:t,family:c,styles:at,config:m,canonical:u,givenPrefix:a})),Ua(n,a,u))}function Ua(t,e,n){let{prefix:a,iconName:r}=n;if(t||!a||!r)return{prefix:a,iconName:r};const i=e==="fa"?gn(r):{},s=Y(a,r);return r=i.iconName||s||r,a=i.prefix||a,a==="far"&&!at.far&&at.fas&&!m.autoFetchSvg&&(a="fas"),{prefix:a,iconName:r}}const Wa=qe.filter(t=>t!==E||t!==yt),Ya=Object.keys(It).filter(t=>t!==E).map(t=>Object.keys(It[t])).flat();function Ha(t){const{values:e,family:n,canonical:a,givenPrefix:r="",styles:i={},config:s={}}=t,o=n===yt,f=e.includes("fa-duotone")||e.includes("fad"),c=s.familyDefault==="duotone",u=a.prefix==="fad"||a.prefix==="fa-duotone";if(!o&&(f||c||u)&&(a.prefix="fad"),(e.includes("fa-brands")||e.includes("fab"))&&(a.prefix="fab"),!a.prefix&&Wa.includes(n)&&(Object.keys(i).find(p=>Ya.includes(p))||s.autoFetchSvg)){const p=$n.get(n).defaultShortPrefixId;a.prefix=p,a.iconName=Y(a.prefix,a.iconName)||a.iconName}return(a.prefix==="fa"||r==="fa")&&(a.prefix=R()||"fas"),a}class Ga{constructor(){this.definitions={}}add(){for(var e=arguments.length,n=new Array(e),a=0;a<e;a++)n[a]=arguments[a];const r=n.reduce(this._pullDefinitions,{});Object.keys(r).forEach(i=>{this.definitions[i]=l(l({},this.definitions[i]||{}),r[i]),Ut(i,r[i]);const s=ee[E][i];s&&Ut(s,r[i]),hn()})}reset(){this.definitions={}}_pullDefinitions(e,n){const a=n.prefix&&n.iconName&&n.icon?{0:n}:n;return Object.keys(a).map(r=>{const{prefix:i,iconName:s,icon:o}=a[r],f=o[2];e[i]||(e[i]={}),f.length>0&&f.forEach(c=>{typeof c=="string"&&(e[i][c]=o)}),e[i][s]=o}),e}}let Ae=[],$={};const K={},Xa=Object.keys(K);function Ba(t,e){let{mixoutsTo:n}=e;return Ae=t,$={},Object.keys(K).forEach(a=>{Xa.indexOf(a)===-1&&delete K[a]}),Ae.forEach(a=>{const r=a.mixout?a.mixout():{};if(Object.keys(r).forEach(i=>{typeof r[i]=="function"&&(n[i]=r[i]),typeof r[i]=="object"&&Object.keys(r[i]).forEach(s=>{n[i]||(n[i]={}),n[i][s]=r[i][s]})}),a.hooks){const i=a.hooks();Object.keys(i).forEach(s=>{$[s]||($[s]=[]),$[s].push(i[s])})}a.provides&&a.provides(K)}),n}function Wt(t,e){for(var n=arguments.length,a=new Array(n>2?n-2:0),r=2;r<n;r++)a[r-2]=arguments[r];return($[t]||[]).forEach(s=>{e=s.apply(null,[e,...a])}),e}function G(t){for(var e=arguments.length,n=new Array(e>1?e-1:0),a=1;a<e;a++)n[a-1]=arguments[a];($[t]||[]).forEach(i=>{i.apply(null,n)})}function D(){const t=arguments[0],e=Array.prototype.slice.call(arguments,1);return K[t]?K[t].apply(null,e):void 0}function Yt(t){t.prefix==="fa"&&(t.prefix="fas");let{iconName:e}=t;const n=t.prefix||R();if(e)return e=Y(n,e)||e,ve(yn.definitions,n,e)||ve(L.styles,n,e)}const yn=new Ga,$a=()=>{m.autoReplaceSvg=!1,m.observeMutations=!1,G("noAuto")},Va={i2svg:function(){let t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return z?(G("beforeI2svg",t),D("pseudoElements2svg",t),D("i2svg",t)):Promise.reject(new Error("Operation requires a DOM of some kind."))},watch:function(){let t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};const{autoReplaceSvgRoot:e}=t;m.autoReplaceSvg===!1&&(m.autoReplaceSvg=!0),m.observeMutations=!0,Pa(()=>{qa({autoReplaceSvgRoot:e}),G("watch",t)})}},Ka={icon:t=>{if(t===null)return null;if(typeof t=="object"&&t.prefix&&t.iconName)return{prefix:t.prefix,iconName:Y(t.prefix,t.iconName)||t.iconName};if(Array.isArray(t)&&t.length===2){const e=t[1].indexOf("fa-")===0?t[1].slice(3):t[1],n=xt(t[0]);return{prefix:n,iconName:Y(n,e)||e}}if(typeof t=="string"&&(t.indexOf("".concat(m.cssPrefix,"-"))>-1||t.match(pa))){const e=Et(t.split(" "),{skipLookups:!0});return{prefix:e.prefix||R(),iconName:Y(e.prefix,e.iconName)||e.iconName}}if(typeof t=="string"){const e=R();return{prefix:e,iconName:Y(e,t)||t}}}},C={noAuto:$a,config:m,dom:Va,parse:Ka,library:yn,findIconDefinition:Yt,toHtml:st},qa=function(){let t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};const{autoReplaceSvgRoot:e=g}=t;(Object.keys(L.styles).length>0||m.autoFetchSvg)&&z&&m.autoReplaceSvg&&C.dom.i2svg({node:e})};function At(t,e){return Object.defineProperty(t,"abstract",{get:e}),Object.defineProperty(t,"html",{get:function(){return t.abstract.map(n=>st(n))}}),Object.defineProperty(t,"node",{get:function(){if(!z)return;const n=g.createElement("div");return n.innerHTML=t.html,n.children}}),t}function Qa(t){let{children:e,main:n,mask:a,attributes:r,styles:i,transform:s}=t;if(ae(s)&&n.found&&!a.found){const{width:o,height:f}=n,c={x:o/f/2,y:.5};r.style=vt(l(l({},i),{},{"transform-origin":"".concat(c.x+s.x/16,"em ").concat(c.y+s.y/16,"em")}))}return[{tag:"svg",attributes:r,children:e}]}function Ja(t){let{prefix:e,iconName:n,children:a,attributes:r,symbol:i}=t;const s=i===!0?"".concat(e,"-").concat(m.cssPrefix,"-").concat(n):i;return[{tag:"svg",attributes:{style:"display: none;"},children:[{tag:"symbol",attributes:l(l({},r),{},{id:s}),children:a}]}]}function se(t){const{icons:{main:e,mask:n},prefix:a,iconName:r,transform:i,symbol:s,title:o,maskId:f,titleId:c,extra:u,watchable:h=!1}=t,{width:p,height:b}=n.found?n:e,k=Jn.includes(a),O=[m.replacementClass,r?"".concat(m.cssPrefix,"-").concat(r):""].filter(S=>u.classes.indexOf(S)===-1).filter(S=>S!==""||!!S).concat(u.classes).join(" ");let y={children:[],attributes:l(l({},u.attributes),{},{"data-prefix":a,"data-icon":r,class:O,role:u.attributes.role||"img",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 ".concat(p," ").concat(b)})};const x=k&&!~u.classes.indexOf("fa-fw")?{width:"".concat(p/b*16*.0625,"em")}:{};h&&(y.attributes[H]=""),o&&(y.children.push({tag:"title",attributes:{id:y.attributes["aria-labelledby"]||"title-".concat(c||nt())},children:[o]}),delete y.attributes.title);const v=l(l({},y),{},{prefix:a,iconName:r,main:e,mask:n,maskId:f,transform:i,symbol:s,styles:l(l({},x),u.styles)}),{children:A,attributes:M}=n.found&&e.found?D("generateAbstractMask",v)||{children:[],attributes:{}}:D("generateAbstractIcon",v)||{children:[],attributes:{}};return v.children=A,v.attributes=M,s?Ja(v):Qa(v)}function ke(t){const{content:e,width:n,height:a,transform:r,title:i,extra:s,watchable:o=!1}=t,f=l(l(l({},s.attributes),i?{title:i}:{}),{},{class:s.classes.join(" ")});o&&(f[H]="");const c=l({},s.styles);ae(r)&&(c.transform=Sa({transform:r,startCentered:!0,width:n,height:a}),c["-webkit-transform"]=c.transform);const u=vt(c);u.length>0&&(f.style=u);const h=[];return h.push({tag:"span",attributes:f,children:[e]}),i&&h.push({tag:"span",attributes:{class:"sr-only"},children:[i]}),h}function Za(t){const{content:e,title:n,extra:a}=t,r=l(l(l({},a.attributes),n?{title:n}:{}),{},{class:a.classes.join(" ")}),i=vt(a.styles);i.length>0&&(r.style=i);const s=[];return s.push({tag:"span",attributes:r,children:[e]}),n&&s.push({tag:"span",attributes:{class:"sr-only"},children:[n]}),s}const{styles:Nt}=L;function Ht(t){const e=t[0],n=t[1],[a]=t.slice(4);let r=null;return Array.isArray(a)?r={tag:"g",attributes:{class:"".concat(m.cssPrefix,"-").concat(Ct.GROUP)},children:[{tag:"path",attributes:{class:"".concat(m.cssPrefix,"-").concat(Ct.SECONDARY),fill:"currentColor",d:a[0]}},{tag:"path",attributes:{class:"".concat(m.cssPrefix,"-").concat(Ct.PRIMARY),fill:"currentColor",d:a[1]}}]}:r={tag:"path",attributes:{fill:"currentColor",d:a}},{found:!0,width:e,height:n,icon:r}}const tr={found:!1,width:512,height:512};function er(t,e){!tn&&!m.showMissingIcons&&t&&console.error('Icon with name "'.concat(t,'" and prefix "').concat(e,'" is missing.'))}function Gt(t,e){let n=e;return e==="fa"&&m.styleDefault!==null&&(e=R()),new Promise((a,r)=>{if(n==="fa"){const i=gn(t)||{};t=i.iconName||t,e=i.prefix||e}if(t&&e&&Nt[e]&&Nt[e][t]){const i=Nt[e][t];return a(Ht(i))}er(t,e),a(l(l({},tr),{},{icon:m.showMissingIcons&&t?D("missingIconAbstract")||{}:{}}))})}const Ce=()=>{},Xt=m.measurePerformance&&lt&&lt.mark&&lt.measure?lt:{mark:Ce,measure:Ce},Z='FA "6.7.2"',nr=t=>(Xt.mark("".concat(Z," ").concat(t," begins")),()=>vn(t)),vn=t=>{Xt.mark("".concat(Z," ").concat(t," ends")),Xt.measure("".concat(Z," ").concat(t),"".concat(Z," ").concat(t," begins"),"".concat(Z," ").concat(t," ends"))};var oe={begin:nr,end:vn};const ft=()=>{};function Oe(t){return typeof(t.getAttribute?t.getAttribute(H):null)=="string"}function ar(t){const e=t.getAttribute?t.getAttribute(Zt):null,n=t.getAttribute?t.getAttribute(te):null;return e&&n}function rr(t){return t&&t.classList&&t.classList.contains&&t.classList.contains(m.replacementClass)}function ir(){return m.autoReplaceSvg===!0?ut.replace:ut[m.autoReplaceSvg]||ut.replace}function sr(t){return g.createElementNS("http://www.w3.org/2000/svg",t)}function or(t){return g.createElement(t)}function xn(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{ceFn:n=t.tag==="svg"?sr:or}=e;if(typeof t=="string")return g.createTextNode(t);const a=n(t.tag);return Object.keys(t.attributes||[]).forEach(function(i){a.setAttribute(i,t.attributes[i])}),(t.children||[]).forEach(function(i){a.appendChild(xn(i,{ceFn:n}))}),a}function lr(t){let e=" ".concat(t.outerHTML," ");return e="".concat(e,"Font Awesome fontawesome.com "),e}const ut={replace:function(t){const e=t[0];if(e.parentNode)if(t[1].forEach(n=>{e.parentNode.insertBefore(xn(n),e)}),e.getAttribute(H)===null&&m.keepOriginalSource){let n=g.createComment(lr(e));e.parentNode.replaceChild(n,e)}else e.remove()},nest:function(t){const e=t[0],n=t[1];if(~ne(e).indexOf(m.replacementClass))return ut.replace(t);const a=new RegExp("".concat(m.cssPrefix,"-.*"));if(delete n[0].attributes.id,n[0].attributes.class){const i=n[0].attributes.class.split(" ").reduce((s,o)=>(o===m.replacementClass||o.match(a)?s.toSvg.push(o):s.toNode.push(o),s),{toNode:[],toSvg:[]});n[0].attributes.class=i.toSvg.join(" "),i.toNode.length===0?e.removeAttribute("class"):e.setAttribute("class",i.toNode.join(" "))}const r=n.map(i=>st(i)).join(`
`);e.setAttribute(H,""),e.innerHTML=r}};function Se(t){t()}function En(t,e){const n=typeof e=="function"?e:ft;if(t.length===0)n();else{let a=Se;m.mutateApproach===ua&&(a=_.requestAnimationFrame||Se),a(()=>{const r=ir(),i=oe.begin("mutate");t.map(r),i(),n()})}}let le=!1;function An(){le=!0}function Bt(){le=!1}let mt=null;function Ne(t){if(!me||!m.observeMutations)return;const{treeCallback:e=ft,nodeCallback:n=ft,pseudoElementsCallback:a=ft,observeMutationsRoot:r=g}=t;mt=new me(i=>{if(le)return;const s=R();Q(i).forEach(o=>{if(o.type==="childList"&&o.addedNodes.length>0&&!Oe(o.addedNodes[0])&&(m.searchPseudoElements&&a(o.target),e(o.target)),o.type==="attributes"&&o.target.parentNode&&m.searchPseudoElements&&a(o.target.parentNode),o.type==="attributes"&&Oe(o.target)&&~ba.indexOf(o.attributeName))if(o.attributeName==="class"&&ar(o.target)){const{prefix:f,iconName:c}=Et(ne(o.target));o.target.setAttribute(Zt,f||s),c&&o.target.setAttribute(te,c)}else rr(o.target)&&n(o.target)})}),z&&mt.observe(r,{childList:!0,attributes:!0,characterData:!0,subtree:!0})}function cr(){mt&&mt.disconnect()}function fr(t){const e=t.getAttribute("style");let n=[];return e&&(n=e.split(";").reduce((a,r)=>{const i=r.split(":"),s=i[0],o=i.slice(1);return s&&o.length>0&&(a[s]=o.join(":").trim()),a},{})),n}function ur(t){const e=t.getAttribute("data-prefix"),n=t.getAttribute("data-icon"),a=t.innerText!==void 0?t.innerText.trim():"";let r=Et(ne(t));return r.prefix||(r.prefix=R()),e&&n&&(r.prefix=e,r.iconName=n),r.iconName&&r.prefix||(r.prefix&&a.length>0&&(r.iconName=_a(r.prefix,t.innerText)||ie(r.prefix,jt(t.innerText))),!r.iconName&&m.autoFetchSvg&&t.firstChild&&t.firstChild.nodeType===Node.TEXT_NODE&&(r.iconName=t.firstChild.data)),r}function dr(t){const e=Q(t.attributes).reduce((r,i)=>(r.name!=="class"&&r.name!=="style"&&(r[i.name]=i.value),r),{}),n=t.getAttribute("title"),a=t.getAttribute("data-fa-title-id");return m.autoA11y&&(n?e["aria-labelledby"]="".concat(m.replacementClass,"-title-").concat(a||nt()):(e["aria-hidden"]="true",e.focusable="false")),e}function mr(){return{iconName:null,title:null,titleId:null,prefix:null,transform:P,symbol:!1,mask:{iconName:null,prefix:null,rest:[]},maskId:null,extra:{classes:[],styles:{},attributes:{}}}}function we(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{styleParser:!0};const{iconName:n,prefix:a,rest:r}=ur(t),i=dr(t),s=Wt("parseNodeAttributes",{},t);let o=e.styleParser?fr(t):[];return l({iconName:n,title:t.getAttribute("title"),titleId:t.getAttribute("data-fa-title-id"),prefix:a,transform:P,mask:{iconName:null,prefix:null,rest:[]},maskId:null,symbol:!1,extra:{classes:r,styles:o,attributes:i}},s)}const{styles:pr}=L;function kn(t){const e=m.autoReplaceSvg==="nest"?we(t,{styleParser:!1}):we(t);return~e.extra.classes.indexOf(nn)?D("generateLayersText",t,e):D("generateSvgReplacementMutation",t,e)}function hr(){return[...Kn,...Tt]}function Pe(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;if(!z)return Promise.resolve();const n=g.documentElement.classList,a=u=>n.add("".concat(ge,"-").concat(u)),r=u=>n.remove("".concat(ge,"-").concat(u)),i=m.autoFetchSvg?hr():Ke.concat(Object.keys(pr));i.includes("fa")||i.push("fa");const s=[".".concat(nn,":not([").concat(H,"])")].concat(i.map(u=>".".concat(u,":not([").concat(H,"])"))).join(", ");if(s.length===0)return Promise.resolve();let o=[];try{o=Q(t.querySelectorAll(s))}catch{}if(o.length>0)a("pending"),r("complete");else return Promise.resolve();const f=oe.begin("onTree"),c=o.reduce((u,h)=>{try{const p=kn(h);p&&u.push(p)}catch(p){tn||p.name==="MissingIcon"&&console.error(p)}return u},[]);return new Promise((u,h)=>{Promise.all(c).then(p=>{En(p,()=>{a("active"),a("complete"),r("pending"),typeof e=="function"&&e(),f(),u()})}).catch(p=>{f(),h(p)})})}function gr(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;kn(t).then(n=>{n&&En([n],e)})}function br(t){return function(e){let n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const a=(e||{}).icon?e:Yt(e||{});let{mask:r}=n;return r&&(r=(r||{}).icon?r:Yt(r||{})),t(a,l(l({},n),{},{mask:r}))}}const yr=function(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{transform:n=P,symbol:a=!1,mask:r=null,maskId:i=null,title:s=null,titleId:o=null,classes:f=[],attributes:c={},styles:u={}}=e;if(!t)return;const{prefix:h,iconName:p,icon:b}=t;return At(l({type:"icon"},t),()=>(G("beforeDOMElementCreation",{iconDefinition:t,params:e}),m.autoA11y&&(s?c["aria-labelledby"]="".concat(m.replacementClass,"-title-").concat(o||nt()):(c["aria-hidden"]="true",c.focusable="false")),se({icons:{main:Ht(b),mask:r?Ht(r.icon):{found:!1,width:null,height:null,icon:{}}},prefix:h,iconName:p,transform:l(l({},P),n),symbol:a,title:s,maskId:i,titleId:o,extra:{attributes:c,styles:u,classes:f}})))};var vr={mixout(){return{icon:br(yr)}},hooks(){return{mutationObserverCallbacks(t){return t.treeCallback=Pe,t.nodeCallback=gr,t}}},provides(t){t.i2svg=function(e){const{node:n=g,callback:a=()=>{}}=e;return Pe(n,a)},t.generateSvgReplacementMutation=function(e,n){const{iconName:a,title:r,titleId:i,prefix:s,transform:o,symbol:f,mask:c,maskId:u,extra:h}=n;return new Promise((p,b)=>{Promise.all([Gt(a,s),c.iconName?Gt(c.iconName,c.prefix):Promise.resolve({found:!1,width:512,height:512,icon:{}})]).then(k=>{let[O,y]=k;p([e,se({icons:{main:O,mask:y},prefix:s,iconName:a,transform:o,symbol:f,maskId:u,title:r,titleId:i,extra:h,watchable:!0})])}).catch(b)})},t.generateAbstractIcon=function(e){let{children:n,attributes:a,main:r,transform:i,styles:s}=e;const o=vt(s);o.length>0&&(a.style=o);let f;return ae(i)&&(f=D("generateAbstractTransformGrouping",{main:r,transform:i,containerWidth:r.width,iconWidth:r.width})),n.push(f||r.icon),{children:n,attributes:a}}}},xr={mixout(){return{layer(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{classes:n=[]}=e;return At({type:"layer"},()=>{G("beforeDOMElementCreation",{assembler:t,params:e});let a=[];return t(r=>{Array.isArray(r)?r.map(i=>{a=a.concat(i.abstract)}):a=a.concat(r.abstract)}),[{tag:"span",attributes:{class:["".concat(m.cssPrefix,"-layers"),...n].join(" ")},children:a}]})}}}},Er={mixout(){return{counter(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{title:n=null,classes:a=[],attributes:r={},styles:i={}}=e;return At({type:"counter",content:t},()=>(G("beforeDOMElementCreation",{content:t,params:e}),Za({content:t.toString(),title:n,extra:{attributes:r,styles:i,classes:["".concat(m.cssPrefix,"-layers-counter"),...a]}})))}}}},Ar={mixout(){return{text(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{transform:n=P,title:a=null,classes:r=[],attributes:i={},styles:s={}}=e;return At({type:"text",content:t},()=>(G("beforeDOMElementCreation",{content:t,params:e}),ke({content:t,transform:l(l({},P),n),title:a,extra:{attributes:i,styles:s,classes:["".concat(m.cssPrefix,"-layers-text"),...r]}})))}}},provides(t){t.generateLayersText=function(e,n){const{title:a,transform:r,extra:i}=n;let s=null,o=null;if($e){const f=parseInt(getComputedStyle(e).fontSize,10),c=e.getBoundingClientRect();s=c.width/f,o=c.height/f}return m.autoA11y&&!a&&(i.attributes["aria-hidden"]="true"),Promise.resolve([e,ke({content:e.innerHTML,width:s,height:o,transform:r,title:a,extra:i,watchable:!0})])}}};const kr=new RegExp('"',"ug"),Le=[1105920,1112319],Me=l(l(l(l({},{FontAwesome:{normal:"fas",400:"fas"}}),Bn),ca),na),$t=Object.keys(Me).reduce((t,e)=>(t[e.toLowerCase()]=Me[e],t),{}),Cr=Object.keys($t).reduce((t,e)=>{const n=$t[e];return t[e]=n[900]||[...Object.entries(n)][0][1],t},{});function Or(t){const e=t.replace(kr,""),n=Ma(e,0),a=n>=Le[0]&&n<=Le[1],r=e.length===2?e[0]===e[1]:!1;return{value:jt(r?e[0]:e),isSecondary:a||r}}function Sr(t,e){const n=t.replace(/^['"]|['"]$/g,"").toLowerCase(),a=parseInt(e),r=isNaN(a)?"normal":a;return($t[n]||{})[r]||Cr[n]}function Ie(t,e){const n="".concat(fa).concat(e.replace(":","-"));return new Promise((a,r)=>{if(t.getAttribute(n)!==null)return a();const s=Q(t.children).filter(p=>p.getAttribute(Ft)===e)[0],o=_.getComputedStyle(t,e),f=o.getPropertyValue("font-family"),c=f.match(ha),u=o.getPropertyValue("font-weight"),h=o.getPropertyValue("content");if(s&&!c)return t.removeChild(s),a();if(c&&h!=="none"&&h!==""){const p=o.getPropertyValue("content");let b=Sr(f,u);const{value:k,isSecondary:O}=Or(p),y=c[0].startsWith("FontAwesome");let x=ie(b,k),v=x;if(y){const A=Ra(k);A.iconName&&A.prefix&&(x=A.iconName,b=A.prefix)}if(x&&!O&&(!s||s.getAttribute(Zt)!==b||s.getAttribute(te)!==v)){t.setAttribute(n,v),s&&t.removeChild(s);const A=mr(),{extra:M}=A;M.attributes[Ft]=e,Gt(x,b).then(S=>{const wn=se(l(l({},A),{},{icons:{main:S,mask:bn()},prefix:b,iconName:v,extra:M,watchable:!0})),kt=g.createElementNS("http://www.w3.org/2000/svg","svg");e==="::before"?t.insertBefore(kt,t.firstChild):t.appendChild(kt),kt.outerHTML=wn.map(Pn=>st(Pn)).join(`
`),t.removeAttribute(n),a()}).catch(r)}else a()}else a()})}function Nr(t){return Promise.all([Ie(t,"::before"),Ie(t,"::after")])}function wr(t){return t.parentNode!==document.head&&!~da.indexOf(t.tagName.toUpperCase())&&!t.getAttribute(Ft)&&(!t.parentNode||t.parentNode.tagName!=="svg")}function Te(t){if(z)return new Promise((e,n)=>{const a=Q(t.querySelectorAll("*")).filter(wr).map(Nr),r=oe.begin("searchPseudoElements");An(),Promise.all(a).then(()=>{r(),Bt(),e()}).catch(()=>{r(),Bt(),n()})})}var Pr={hooks(){return{mutationObserverCallbacks(t){return t.pseudoElementsCallback=Te,t}}},provides(t){t.pseudoElements2svg=function(e){const{node:n=g}=e;m.searchPseudoElements&&Te(n)}}};let ze=!1;var Lr={mixout(){return{dom:{unwatch(){An(),ze=!0}}}},hooks(){return{bootstrap(){Ne(Wt("mutationObserverCallbacks",{}))},noAuto(){cr()},watch(t){const{observeMutationsRoot:e}=t;ze?Bt():Ne(Wt("mutationObserverCallbacks",{observeMutationsRoot:e}))}}}};const Fe=t=>{let e={size:16,x:0,y:0,flipX:!1,flipY:!1,rotate:0};return t.toLowerCase().split(" ").reduce((n,a)=>{const r=a.toLowerCase().split("-"),i=r[0];let s=r.slice(1).join("-");if(i&&s==="h")return n.flipX=!0,n;if(i&&s==="v")return n.flipY=!0,n;if(s=parseFloat(s),isNaN(s))return n;switch(i){case"grow":n.size=n.size+s;break;case"shrink":n.size=n.size-s;break;case"left":n.x=n.x-s;break;case"right":n.x=n.x+s;break;case"up":n.y=n.y-s;break;case"down":n.y=n.y+s;break;case"rotate":n.rotate=n.rotate+s;break}return n},e)};var Mr={mixout(){return{parse:{transform:t=>Fe(t)}}},hooks(){return{parseNodeAttributes(t,e){const n=e.getAttribute("data-fa-transform");return n&&(t.transform=Fe(n)),t}}},provides(t){t.generateAbstractTransformGrouping=function(e){let{main:n,transform:a,containerWidth:r,iconWidth:i}=e;const s={transform:"translate(".concat(r/2," 256)")},o="translate(".concat(a.x*32,", ").concat(a.y*32,") "),f="scale(".concat(a.size/16*(a.flipX?-1:1),", ").concat(a.size/16*(a.flipY?-1:1),") "),c="rotate(".concat(a.rotate," 0 0)"),u={transform:"".concat(o," ").concat(f," ").concat(c)},h={transform:"translate(".concat(i/2*-1," -256)")},p={outer:s,inner:u,path:h};return{tag:"g",attributes:l({},p.outer),children:[{tag:"g",attributes:l({},p.inner),children:[{tag:n.icon.tag,children:n.icon.children,attributes:l(l({},n.icon.attributes),p.path)}]}]}}}};const wt={x:0,y:0,width:"100%",height:"100%"};function _e(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;return t.attributes&&(t.attributes.fill||e)&&(t.attributes.fill="black"),t}function Ir(t){return t.tag==="g"?t.children:[t]}var Tr={hooks(){return{parseNodeAttributes(t,e){const n=e.getAttribute("data-fa-mask"),a=n?Et(n.split(" ").map(r=>r.trim())):bn();return a.prefix||(a.prefix=R()),t.mask=a,t.maskId=e.getAttribute("data-fa-mask-id"),t}}},provides(t){t.generateAbstractMask=function(e){let{children:n,attributes:a,main:r,mask:i,maskId:s,transform:o}=e;const{width:f,icon:c}=r,{width:u,icon:h}=i,p=Oa({transform:o,containerWidth:u,iconWidth:f}),b={tag:"rect",attributes:l(l({},wt),{},{fill:"white"})},k=c.children?{children:c.children.map(_e)}:{},O={tag:"g",attributes:l({},p.inner),children:[_e(l({tag:c.tag,attributes:l(l({},c.attributes),p.path)},k))]},y={tag:"g",attributes:l({},p.outer),children:[O]},x="mask-".concat(s||nt()),v="clip-".concat(s||nt()),A={tag:"mask",attributes:l(l({},wt),{},{id:x,maskUnits:"userSpaceOnUse",maskContentUnits:"userSpaceOnUse"}),children:[b,y]},M={tag:"defs",children:[{tag:"clipPath",attributes:{id:v},children:Ir(h)},A]};return n.push(M,{tag:"rect",attributes:l({fill:"currentColor","clip-path":"url(#".concat(v,")"),mask:"url(#".concat(x,")")},wt)}),{children:n,attributes:a}}}},zr={provides(t){let e=!1;_.matchMedia&&(e=_.matchMedia("(prefers-reduced-motion: reduce)").matches),t.missingIconAbstract=function(){const n=[],a={fill:"currentColor"},r={attributeType:"XML",repeatCount:"indefinite",dur:"2s"};n.push({tag:"path",attributes:l(l({},a),{},{d:"M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z"})});const i=l(l({},r),{},{attributeName:"opacity"}),s={tag:"circle",attributes:l(l({},a),{},{cx:"256",cy:"364",r:"28"}),children:[]};return e||s.children.push({tag:"animate",attributes:l(l({},r),{},{attributeName:"r",values:"28;14;28;28;14;28;"})},{tag:"animate",attributes:l(l({},i),{},{values:"1;0;1;1;0;1;"})}),n.push(s),n.push({tag:"path",attributes:l(l({},a),{},{opacity:"1",d:"M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z"}),children:e?[]:[{tag:"animate",attributes:l(l({},i),{},{values:"1;0;0;0;0;1;"})}]}),e||n.push({tag:"path",attributes:l(l({},a),{},{opacity:"0",d:"M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z"}),children:[{tag:"animate",attributes:l(l({},i),{},{values:"0;0;1;1;0;0;"})}]}),{tag:"g",attributes:{class:"missing"},children:n}}}},Fr={hooks(){return{parseNodeAttributes(t,e){const n=e.getAttribute("data-fa-symbol"),a=n===null?!1:n===""?!0:n;return t.symbol=a,t}}}},_r=[wa,vr,xr,Er,Ar,Pr,Lr,Mr,Tr,zr,Fr];Ba(_r,{mixoutsTo:C});C.noAuto;C.config;C.library;C.dom;const Vt=C.parse;C.findIconDefinition;C.toHtml;const Rr=C.icon;C.layer;C.text;C.counter;function Re(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);e&&(a=a.filter(function(r){return Object.getOwnPropertyDescriptor(t,r).enumerable})),n.push.apply(n,a)}return n}function w(t){for(var e=1;e<arguments.length;e++){var n=arguments[e]!=null?arguments[e]:{};e%2?Re(Object(n),!0).forEach(function(a){V(t,a,n[a])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):Re(Object(n)).forEach(function(a){Object.defineProperty(t,a,Object.getOwnPropertyDescriptor(n,a))})}return t}function pt(t){"@babel/helpers - typeof";return pt=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(e){return typeof e}:function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},pt(t)}function V(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function Dr(t,e){if(t==null)return{};var n={},a=Object.keys(t),r,i;for(i=0;i<a.length;i++)r=a[i],!(e.indexOf(r)>=0)&&(n[r]=t[r]);return n}function jr(t,e){if(t==null)return{};var n=Dr(t,e),a,r;if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);for(r=0;r<i.length;r++)a=i[r],!(e.indexOf(a)>=0)&&Object.prototype.propertyIsEnumerable.call(t,a)&&(n[a]=t[a])}return n}function Kt(t){return Ur(t)||Wr(t)||Yr(t)||Hr()}function Ur(t){if(Array.isArray(t))return qt(t)}function Wr(t){if(typeof Symbol<"u"&&t[Symbol.iterator]!=null||t["@@iterator"]!=null)return Array.from(t)}function Yr(t,e){if(t){if(typeof t=="string")return qt(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);if(n==="Object"&&t.constructor&&(n=t.constructor.name),n==="Map"||n==="Set")return Array.from(t);if(n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return qt(t,e)}}function qt(t,e){(e==null||e>t.length)&&(e=t.length);for(var n=0,a=new Array(e);n<e;n++)a[n]=t[n];return a}function Hr(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function Gr(t){var e,n=t.beat,a=t.fade,r=t.beatFade,i=t.bounce,s=t.shake,o=t.flash,f=t.spin,c=t.spinPulse,u=t.spinReverse,h=t.pulse,p=t.fixedWidth,b=t.inverse,k=t.border,O=t.listItem,y=t.flip,x=t.size,v=t.rotation,A=t.pull,M=(e={"fa-beat":n,"fa-fade":a,"fa-beat-fade":r,"fa-bounce":i,"fa-shake":s,"fa-flash":o,"fa-spin":f,"fa-spin-reverse":u,"fa-spin-pulse":c,"fa-pulse":h,"fa-fw":p,"fa-inverse":b,"fa-border":k,"fa-li":O,"fa-flip":y===!0,"fa-flip-horizontal":y==="horizontal"||y==="both","fa-flip-vertical":y==="vertical"||y==="both"},V(e,"fa-".concat(x),typeof x<"u"&&x!==null),V(e,"fa-rotate-".concat(v),typeof v<"u"&&v!==null&&v!==0),V(e,"fa-pull-".concat(A),typeof A<"u"&&A!==null),V(e,"fa-swap-opacity",t.swapOpacity),e);return Object.keys(M).map(function(S){return M[S]?S:null}).filter(function(S){return S})}function Xr(t){return t=t-0,t===t}function Cn(t){return Xr(t)?t:(t=t.replace(/[\-_\s]+(.)?/g,function(e,n){return n?n.toUpperCase():""}),t.substr(0,1).toLowerCase()+t.substr(1))}var Br=["style"];function $r(t){return t.charAt(0).toUpperCase()+t.slice(1)}function Vr(t){return t.split(";").map(function(e){return e.trim()}).filter(function(e){return e}).reduce(function(e,n){var a=n.indexOf(":"),r=Cn(n.slice(0,a)),i=n.slice(a+1).trim();return r.startsWith("webkit")?e[$r(r)]=i:e[r]=i,e},{})}function On(t,e){var n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{};if(typeof e=="string")return e;var a=(e.children||[]).map(function(f){return On(t,f)}),r=Object.keys(e.attributes||{}).reduce(function(f,c){var u=e.attributes[c];switch(c){case"class":f.attrs.className=u,delete e.attributes.class;break;case"style":f.attrs.style=Vr(u);break;default:c.indexOf("aria-")===0||c.indexOf("data-")===0?f.attrs[c.toLowerCase()]=u:f.attrs[Cn(c)]=u}return f},{attrs:{}}),i=n.style,s=i===void 0?{}:i,o=jr(n,Br);return r.attrs.style=w(w({},r.attrs.style),s),t.apply(void 0,[e.tag,w(w({},r.attrs),o)].concat(Kt(a)))}var Sn=!1;try{Sn=!0}catch{}function Kr(){if(!Sn&&console&&typeof console.error=="function"){var t;(t=console).error.apply(t,arguments)}}function De(t){if(t&&pt(t)==="object"&&t.prefix&&t.iconName&&t.icon)return t;if(Vt.icon)return Vt.icon(t);if(t===null)return null;if(t&&pt(t)==="object"&&t.prefix&&t.iconName)return t;if(Array.isArray(t)&&t.length===2)return{prefix:t[0],iconName:t[1]};if(typeof t=="string")return{prefix:"fas",iconName:t}}function Pt(t,e){return Array.isArray(e)&&e.length>0||!Array.isArray(e)&&e?V({},t,e):{}}var je={border:!1,className:"",mask:null,maskId:null,fixedWidth:!1,inverse:!1,flip:!1,icon:null,listItem:!1,pull:null,pulse:!1,rotation:null,size:null,spin:!1,spinPulse:!1,spinReverse:!1,beat:!1,fade:!1,beatFade:!1,bounce:!1,shake:!1,symbol:!1,title:"",titleId:null,transform:null,swapOpacity:!1},Nn=N.forwardRef(function(t,e){var n=w(w({},je),t),a=n.icon,r=n.mask,i=n.symbol,s=n.className,o=n.title,f=n.titleId,c=n.maskId,u=De(a),h=Pt("classes",[].concat(Kt(Gr(n)),Kt((s||"").split(" ")))),p=Pt("transform",typeof n.transform=="string"?Vt.transform(n.transform):n.transform),b=Pt("mask",De(r)),k=Rr(u,w(w(w(w({},h),p),b),{},{symbol:i,title:o,titleId:f,maskId:c}));if(!k)return Kr("Could not find icon",u),null;var O=k.abstract,y={ref:e};return Object.keys(n).forEach(function(x){je.hasOwnProperty(x)||(y[x]=n[x])}),qr(O[0],y)});Nn.displayName="FontAwesomeIcon";Nn.propTypes={beat:d.bool,border:d.bool,beatFade:d.bool,bounce:d.bool,className:d.string,fade:d.bool,flash:d.bool,mask:d.oneOfType([d.object,d.array,d.string]),maskId:d.string,fixedWidth:d.bool,inverse:d.bool,flip:d.oneOf([!0,!1,"horizontal","vertical","both"]),icon:d.oneOfType([d.object,d.array,d.string]),listItem:d.bool,pull:d.oneOf(["right","left"]),pulse:d.bool,rotation:d.oneOf([0,90,180,270]),shake:d.bool,size:d.oneOf(["2xs","xs","sm","lg","xl","2xl","1x","2x","3x","4x","5x","6x","7x","8x","9x","10x"]),spin:d.bool,spinPulse:d.bool,spinReverse:d.bool,symbol:d.oneOfType([d.bool,d.string]),title:d.string,titleId:d.string,transform:d.oneOfType([d.string,d.object]),swapOpacity:d.bool};var qr=On.bind(null,N.createElement);/*!
 * Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com
 * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
 * Copyright 2024 Fonticons, Inc.
 */const Qr={prefix:"fas",iconName:"calendar-days",icon:[448,512,["calendar-alt"],"f073","M128 0c17.7 0 32 14.3 32 32l0 32 128 0 0-32c0-17.7 14.3-32 32-32s32 14.3 32 32l0 32 48 0c26.5 0 48 21.5 48 48l0 48L0 160l0-48C0 85.5 21.5 64 48 64l48 0 0-32c0-17.7 14.3-32 32-32zM0 192l448 0 0 272c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 192zm64 80l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm128 0l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zM64 400l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zm112 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16z"]},li=Qr,Jr={prefix:"fas",iconName:"right-from-bracket",icon:[512,512,["sign-out-alt"],"f2f5","M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"]},ci=Jr,fi={prefix:"fas",iconName:"bars",icon:[448,512,["navicon"],"f0c9","M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"]},ui={prefix:"fas",iconName:"lock",icon:[448,512,[128274],"f023","M144 144l0 48 160 0 0-48c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192l0-48C80 64.5 144.5 0 224 0s144 64.5 144 144l0 48 16 0c35.3 0 64 28.7 64 64l0 192c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 256c0-35.3 28.7-64 64-64l16 0z"]},Zr={prefix:"fas",iconName:"pen-to-square",icon:[512,512,["edit"],"f044","M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z"]},di=Zr,mi={prefix:"fas",iconName:"money-bill",icon:[576,512,[],"f0d6","M64 64C28.7 64 0 92.7 0 128L0 384c0 35.3 28.7 64 64 64l448 0c35.3 0 64-28.7 64-64l0-256c0-35.3-28.7-64-64-64L64 64zm64 320l-64 0 0-64c35.3 0 64 28.7 64 64zM64 192l0-64 64 0c0 35.3-28.7 64-64 64zM448 384c0-35.3 28.7-64 64-64l0 64-64 0zm64-192c-35.3 0-64-28.7-64-64l64 0 0 64zM288 160a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"]},pi={prefix:"fas",iconName:"user",icon:[448,512,[128100,62144],"f007","M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"]},hi={prefix:"fas",iconName:"file-invoice-dollar",icon:[384,512,[],"f571","M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-288-128 0c-17.7 0-32-14.3-32-32L224 0 64 0zM256 0l0 128 128 0L256 0zM64 80c0-8.8 7.2-16 16-16l64 0c8.8 0 16 7.2 16 16s-7.2 16-16 16L80 96c-8.8 0-16-7.2-16-16zm0 64c0-8.8 7.2-16 16-16l64 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-64 0c-8.8 0-16-7.2-16-16zm128 72c8.8 0 16 7.2 16 16l0 17.3c8.5 1.2 16.7 3.1 24.1 5.1c8.5 2.3 13.6 11 11.3 19.6s-11 13.6-19.6 11.3c-11.1-3-22-5.2-32.1-5.3c-8.4-.1-17.4 1.8-23.6 5.5c-5.7 3.4-8.1 7.3-8.1 12.8c0 3.7 1.3 6.5 7.3 10.1c6.9 4.1 16.6 7.1 29.2 10.9l.5 .1s0 0 0 0s0 0 0 0c11.3 3.4 25.3 7.6 36.3 14.6c12.1 7.6 22.4 19.7 22.7 38.2c.3 19.3-9.6 33.3-22.9 41.6c-7.7 4.8-16.4 7.6-25.1 9.1l0 17.1c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-17.8c-11.2-2.1-21.7-5.7-30.9-8.9c0 0 0 0 0 0c-2.1-.7-4.2-1.4-6.2-2.1c-8.4-2.8-12.9-11.9-10.1-20.2s11.9-12.9 20.2-10.1c2.5 .8 4.8 1.6 7.1 2.4c0 0 0 0 0 0s0 0 0 0s0 0 0 0c13.6 4.6 24.6 8.4 36.3 8.7c9.1 .3 17.9-1.7 23.7-5.3c5.1-3.2 7.9-7.3 7.8-14c-.1-4.6-1.8-7.8-7.7-11.6c-6.8-4.3-16.5-7.4-29-11.2l-1.6-.5s0 0 0 0c-11-3.3-24.3-7.3-34.8-13.7c-12-7.2-22.6-18.9-22.7-37.3c-.1-19.4 10.8-32.8 23.8-40.5c7.5-4.4 15.8-7.2 24.1-8.7l0-17.3c0-8.8 7.2-16 16-16z"]},ti={prefix:"fas",iconName:"circle-check",icon:[512,512,[61533,"check-circle"],"f058","M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"]},gi=ti,ei={prefix:"fas",iconName:"shield-halved",icon:[512,512,["shield-alt"],"f3ed","M256 0c4.6 0 9.2 1 13.4 2.9L457.7 82.8c22 9.3 38.4 31 38.3 57.2c-.5 99.2-41.3 280.7-213.6 363.2c-16.7 8-36.1 8-52.8 0C57.3 420.7 16.5 239.2 16 140c-.1-26.2 16.3-47.9 38.3-57.2L242.7 2.9C246.8 1 251.4 0 256 0zm0 66.8l0 378.1C394 378 431.1 230.1 432 141.4L256 66.8s0 0 0 0z"]},bi=ei,yi={prefix:"fas",iconName:"filter",icon:[512,512,[],"f0b0","M3.9 54.9C10.5 40.9 24.5 32 40 32l432 0c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9 320 448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6l0-79.1L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z"]},vi={prefix:"fas",iconName:"hand-holding-heart",icon:[576,512,[],"f4be","M163.9 136.9c-29.4-29.8-29.4-78.2 0-108s77-29.8 106.4 0l17.7 18 17.7-18c29.4-29.8 77-29.8 106.4 0s29.4 78.2 0 108L310.5 240.1c-6.2 6.3-14.3 9.4-22.5 9.4s-16.3-3.1-22.5-9.4L163.9 136.9zM568.2 336.3c13.1 17.8 9.3 42.8-8.5 55.9L433.1 485.5c-23.4 17.2-51.6 26.5-80.7 26.5L192 512 32 512c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l36.8 0 44.9-36c22.7-18.2 50.9-28 80-28l78.3 0 16 0 64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0-16 0c-8.8 0-16 7.2-16 16s7.2 16 16 16l120.6 0 119.7-88.2c17.8-13.1 42.8-9.3 55.9 8.5zM193.6 384c0 0 0 0 0 0l-.9 0c.3 0 .6 0 .9 0z"]},xi={prefix:"fas",iconName:"chart-line",icon:[512,512,["line-chart"],"f201","M64 64c0-17.7-14.3-32-32-32S0 46.3 0 64L0 400c0 44.2 35.8 80 80 80l400 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 416c-8.8 0-16-7.2-16-16L64 64zm406.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L320 210.7l-57.4-57.4c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L240 221.3l57.4 57.4c12.5 12.5 32.8 12.5 45.3 0l128-128z"]},Ei={prefix:"fas",iconName:"trash",icon:[448,512,[],"f1f8","M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"]},Ai={prefix:"fas",iconName:"file-pdf",icon:[512,512,[],"f1c1","M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 144-208 0c-35.3 0-64 28.7-64 64l0 144-48 0c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128zM176 352l32 0c30.9 0 56 25.1 56 56s-25.1 56-56 56l-16 0 0 32c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-48 0-80c0-8.8 7.2-16 16-16zm32 80c13.3 0 24-10.7 24-24s-10.7-24-24-24l-16 0 0 48 16 0zm96-80l32 0c26.5 0 48 21.5 48 48l0 64c0 26.5-21.5 48-48 48l-32 0c-8.8 0-16-7.2-16-16l0-128c0-8.8 7.2-16 16-16zm32 128c8.8 0 16-7.2 16-16l0-64c0-8.8-7.2-16-16-16l-16 0 0 96 16 0zm80-112c0-8.8 7.2-16 16-16l48 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0 0 32 32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0 0 48c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-64 0-64z"]},ki={prefix:"fas",iconName:"envelope",icon:[512,512,[128386,9993,61443],"f0e0","M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48L48 64zM0 176L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-208L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"]},ni={prefix:"fas",iconName:"circle-info",icon:[512,512,["info-circle"],"f05a","M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"]},Ci=ni,Oi={prefix:"fas",iconName:"clock",icon:[512,512,[128339,"clock-four"],"f017","M256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0zM232 120l0 136c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2 280 120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"]},Si={prefix:"fas",iconName:"download",icon:[512,512,[],"f019","M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 242.7-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7 288 32zM64 352c-35.3 0-64 28.7-64 64l0 32c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-32c0-35.3-28.7-64-64-64l-101.5 0-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352 64 352zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"]},Ni={prefix:"fas",iconName:"sun",icon:[512,512,[9728],"f185","M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l107.9 19.8c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L446.9 256l62.3 90.3c3.1 4.5 3.7 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391 391 371.1 498.9c-1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L256 446.9l-90.3 62.3c-4.5 3.1-10.2 3.7-15.2 1.6s-8.6-6.6-9.6-11.9L121 391 13.1 371.1c-5.3-1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L65.1 256 2.8 165.7c-3.1-4.5-3.7-10.2-1.6-15.2s6.6-8.6 11.9-9.6L121 121 140.9 13.1c1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L256 65.1 346.3 2.8c4.5-3.1 10.2-3.7 15.2-1.6zM160 256a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zm224 0a128 128 0 1 0 -256 0 128 128 0 1 0 256 0z"]},wi={prefix:"fas",iconName:"file",icon:[384,512,[128196,128459,61462],"f15b","M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 288c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128z"]},ai={prefix:"fas",iconName:"gauge-high",icon:[512,512,[62461,"tachometer-alt","tachometer-alt-fast"],"f625","M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM288 96a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM256 416c35.3 0 64-28.7 64-64c0-17.4-6.9-33.1-18.1-44.6L366 161.7c5.3-12.1-.2-26.3-12.3-31.6s-26.3 .2-31.6 12.3L257.9 288c-.6 0-1.3 0-1.9 0c-35.3 0-64 28.7-64 64s28.7 64 64 64zM176 144a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM96 288a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm352-32a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"]},Pi=ai,ri={prefix:"fas",iconName:"magnifying-glass",icon:[512,512,[128269,"search"],"f002","M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"]},Li=ri,Mi={prefix:"fas",iconName:"chevron-down",icon:[512,512,[],"f078","M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"]},ii={prefix:"fas",iconName:"circle-half-stroke",icon:[512,512,[9680,"adjust"],"f042","M448 256c0-106-86-192-192-192l0 384c106 0 192-86 192-192zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z"]},Ii=ii,Ti={prefix:"fas",iconName:"plus",icon:[448,512,[10133,61543,"add"],"2b","M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"]},zi={prefix:"fas",iconName:"moon",icon:[384,512,[127769,9214],"f186","M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z"]},Fi={prefix:"fas",iconName:"paper-plane",icon:[512,512,[61913],"f1d8","M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480l0-83.6c0-4 1.5-7.8 4.2-10.8L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z"]};export{yi as A,Ai as B,Qt as C,bi as D,Si as E,Nn as F,Ci as G,Fi as H,j as T,Ye as a,He as b,ci as c,fi as d,zi as e,ui as f,Ii as g,Ni as h,Pi as i,li as j,gi as k,hi as l,xi as m,vi as n,We as o,pi as p,ki as q,Ti as r,di as s,Ei as t,oi as u,Oi as v,mi as w,Li as x,wi as y,Mi as z};
