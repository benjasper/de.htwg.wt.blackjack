(function(e){function t(t){for(var o,r,i=t[0],s=t[1],u=t[2],l=0,f=[];l<i.length;l++)r=i[l],Object.prototype.hasOwnProperty.call(a,r)&&a[r]&&f.push(a[r][0]),a[r]=0;for(o in s)Object.prototype.hasOwnProperty.call(s,o)&&(e[o]=s[o]);d&&d(t);while(f.length)f.shift()();return c.push.apply(c,u||[]),n()}function n(){for(var e,t=0;t<c.length;t++){for(var n=c[t],o=!0,r=1;r<n.length;r++){var i=n[r];0!==a[i]&&(o=!1)}o&&(c.splice(t--,1),e=s(s.s=n[0]))}return e}var o={},r={app:0},a={app:0},c=[];function i(e){return s.p+"js/"+({game:"game"}[e]||e)+"."+{"chunk-107ccdc0":"e0afccc0",game:"c3754df7"}[e]+".js"}function s(t){if(o[t])return o[t].exports;var n=o[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,s),n.l=!0,n.exports}s.e=function(e){var t=[],n={"chunk-107ccdc0":1,game:1};r[e]?t.push(r[e]):0!==r[e]&&n[e]&&t.push(r[e]=new Promise((function(t,n){for(var o="css/"+({game:"game"}[e]||e)+"."+{"chunk-107ccdc0":"36ddc28f",game:"2a89ca31"}[e]+".css",a=s.p+o,c=document.getElementsByTagName("link"),i=0;i<c.length;i++){var u=c[i],l=u.getAttribute("data-href")||u.getAttribute("href");if("stylesheet"===u.rel&&(l===o||l===a))return t()}var f=document.getElementsByTagName("style");for(i=0;i<f.length;i++){u=f[i],l=u.getAttribute("data-href");if(l===o||l===a)return t()}var d=document.createElement("link");d.rel="stylesheet",d.type="text/css",d.onload=t,d.onerror=function(t){var o=t&&t.target&&t.target.src||a,c=new Error("Loading CSS chunk "+e+" failed.\n("+o+")");c.code="CSS_CHUNK_LOAD_FAILED",c.request=o,delete r[e],d.parentNode.removeChild(d),n(c)},d.href=a;var g=document.getElementsByTagName("head")[0];g.appendChild(d)})).then((function(){r[e]=0})));var o=a[e];if(0!==o)if(o)t.push(o[2]);else{var c=new Promise((function(t,n){o=a[e]=[t,n]}));t.push(o[2]=c);var u,l=document.createElement("script");l.charset="utf-8",l.timeout=120,s.nc&&l.setAttribute("nonce",s.nc),l.src=i(e);var f=new Error;u=function(t){l.onerror=l.onload=null,clearTimeout(d);var n=a[e];if(0!==n){if(n){var o=t&&("load"===t.type?"missing":t.type),r=t&&t.target&&t.target.src;f.message="Loading chunk "+e+" failed.\n("+o+": "+r+")",f.name="ChunkLoadError",f.type=o,f.request=r,n[1](f)}a[e]=void 0}};var d=setTimeout((function(){u({type:"timeout",target:l})}),12e4);l.onerror=l.onload=u,document.head.appendChild(l)}return Promise.all(t)},s.m=e,s.c=o,s.d=function(e,t,n){s.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},s.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,t){if(1&t&&(e=s(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(s.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)s.d(n,o,function(t){return e[t]}.bind(null,o));return n},s.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="/",s.oe=function(e){throw console.error(e),e};var u=window["webpackJsonp"]=window["webpackJsonp"]||[],l=u.push.bind(u);u.push=t,u=u.slice();for(var f=0;f<u.length;f++)t(u[f]);var d=l;c.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("cd49")},"0613":function(e,t,n){"use strict";n("b0c0"),n("d3b7"),n("25f0");var o=n("d4ec"),r=n("2b0e"),a=n("2f62"),c=n("bc3a"),i=n.n(c),s=n("afbc");r["a"].use(a["a"]);var u="",l={withCredentials:!0,headers:{"Content-Type":"application/json",Accept:"application/json"},crossdomain:!0},f=function e(t,n){Object(o["a"])(this,e),this.id="",this.name="",this.id=t,this.name=n},d=new a["a"].Store({state:{status:"",token:localStorage.getItem("token")||"",user:{},signedIn:!1,playerPromise:void 0},actions:{setLoggedIn:function(e,t){var n=e.commit;localStorage.setItem("userId",t);var o=new Promise((function(e,n){i.a.get("/user?player="+t).then((function(o){var r=o.data;if("success"in r&&!1===r.success)return console.error(o),void n(o);e(new f(t,r.name))}))}));o.then((function(e){localStorage.setItem("player",JSON.stringify(e))})),localStorage.setItem("userId",t),n("SET_LOGIN",!0)},login:function(e,t){var n=e.commit,o=l;o.headers={"Content-Type":"application/x-www-form-urlencoded",Accept:"application/json"},i.a.post("https://"+u+"/signIn",t,o).then((function(e){console.log(e),n("SET_LOGIN",!0),s["a"].push("/")})).catch((function(e){console.error(e),console.log("Da ist etwas schief gelaufen.")}))},logout:function(e){var t=e.commit;i.a.get("https://"+u+"/signOut",l).then((function(){s["a"].push("/login"),t("SET_LOGIN",!1)})).catch((function(){console.log("Something went wrong")}))},register:function(e,t){e.commit;var n=l;n.headers={"Content-Type":"application/x-www-form-urlencoded",Accept:"application/json"},i.a.post("https://"+u+"/signUp",t,n).then(function(){s["a"].push("/login")}.bind(this)).catch((function(){console.log("Something went wrong")}))}},mutations:{SET_LOGIN:function(e,t){e.signedIn=t}},getters:{isLoggedIn:function(){var e=localStorage.getItem("userId");return""!==e&&void 0!==e&&null!==e},getPlayerId:function(){var e=localStorage.getItem("userId");return null===e?"":e.toString()}}});t["a"]=d},"9cde":function(e,t,n){},afbc:function(e,t,n){"use strict";n("45fc"),n("d3b7");var o=n("2b0e"),r=n("8c4f"),a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"playing-table"},[e._m(0),n("div",{staticStyle:{"text-align":"center"}},[n("h2",[e._v("Hello "+e._s(e.name)+"}")]),n("v-btn",{attrs:{to:"/rules",role:"button"}},[e._v("Rules")]),n("br"),n("br"),n("v-btn",{attrs:{to:"/game",role:"button"}},[e._v("Start Game")])],1)])},c=[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"heading"}},[n("h1",{staticStyle:{"text-align":"center"}},[e._v(" Game Menu ")])])}],i=(n("b0c0"),n("ac1f"),n("3ca3"),n("841c"),n("ddb0"),n("2b3d"),n("d4ec")),s=n("99de"),u=n("262e"),l=n("2caf"),f=n("9ab4"),d=n("1b40"),g=n("0613"),p=n("bc3a"),h=n.n(p),m=function(e){Object(u["a"])(n,e);var t=Object(l["a"])(n);function n(){var e;Object(i["a"])(this,n),e=t.call(this),e.name="Player";var o=window.location.search,r=new URLSearchParams(o),a=r.get("userId");return""===r.get("userId")||null===a||g["a"].getters.isLoggedIn?(console.log("No login needed, because"+a),g["a"].getters.isLoggedIn&&h.a.get("/user?player="+a).then((function(t){var n=t.data;"success"in n&&!1===n.success?console.error(n.msg):e.name=n.name})),Object(s["a"])(e)):(console.log("Now logging in"+a),g["a"].dispatch("setLoggedIn",r.get("userId")),location.reload(),e)}return n}(d["c"]);m=Object(f["a"])([Object(d["a"])({})],m);var v=m,b=v,y=n("2877"),w=n("6544"),I=n.n(w),S=n("8336"),O=Object(y["a"])(b,a,c,!1,null,null,null),j=O.exports;I()(O,{VBtn:S["a"]}),o["a"].use(r["a"]);var _=[{path:"/",alias:"/home",name:"Home",component:j},{path:"/login",name:"LogIn",component:function(){return n.e("chunk-107ccdc0").then(n.bind(null,"a55b"))}},{path:"/game",name:"Game",meta:{requiresAuth:!0},component:function(){return n.e("game").then(n.bind(null,"7d36"))}},{path:"/rules",name:"Rules",component:function(){return n.e("game").then(n.bind(null,"9f78"))}}],k=new r["a"]({routes:_});k.beforeEach((function(e,t,n){if(e.matched.some((function(e){return e.meta.requiresAuth}))){if(g["a"].getters.isLoggedIn)return void n();n("/login")}else n()}));t["a"]=k},cd49:function(e,t,n){"use strict";n.r(t);n("e260"),n("e6cf"),n("cca6"),n("a79d");var o=n("2b0e"),r=n("2f62"),a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("v-app",[n("v-main",[n("router-view")],1)],1)},c=[],i=o["a"].extend({name:"App",data:function(){return{}}}),s=i,u=n("2877"),l=n("6544"),f=n.n(l),d=n("7496"),g=n("f6c4"),p=Object(u["a"])(s,a,c,!1,null,null,null),h=p.exports;f()(p,{VApp:d["a"],VMain:g["a"]});var m=n("9483");Object(m["a"])("".concat("/","service-worker.js"),{ready:function(){console.log("App is being served from cache by a service worker.\nFor more details, visit https://goo.gl/AFskqB")},registered:function(){console.log("Service worker has been registered.")},cached:function(){console.log("Content has been cached for offline use.")},updatefound:function(){console.log("New content is downloading.")},updated:function(){console.log("New content is available; please refresh.")},offline:function(){console.log("No internet connection found. App is running in offline mode.")},error:function(e){console.error("Error during service worker registration:",e)}});var v=n("afbc"),b=n("f309");o["a"].use(b["a"]);var y={},w=new b["a"](y),I=(n("9cde"),n("dbaa"),n("bc3a")),S=n.n(I);o["a"].use(r["a"]),o["a"].config.productionTip=!1,new o["a"]({router:v["a"],vuetify:w,render:function(e){return e(h)}}).$mount("#app"),o["a"].prototype.$http=S.a;var O=localStorage.getItem("token");O&&(o["a"].prototype.$http.defaults.headers.common.Authorization=O)},dbaa:function(e,t,n){}});
//# sourceMappingURL=app.adce7310.js.map