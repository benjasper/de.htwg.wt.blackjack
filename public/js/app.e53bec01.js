(function(e){function t(t){for(var o,a,s=t[0],i=t[1],u=t[2],l=0,d=[];l<s.length;l++)a=s[l],Object.prototype.hasOwnProperty.call(r,a)&&r[a]&&d.push(r[a][0]),r[a]=0;for(o in i)Object.prototype.hasOwnProperty.call(i,o)&&(e[o]=i[o]);g&&g(t);while(d.length)d.shift()();return c.push.apply(c,u||[]),n()}function n(){for(var e,t=0;t<c.length;t++){for(var n=c[t],o=!0,a=1;a<n.length;a++){var s=n[a];0!==r[s]&&(o=!1)}o&&(c.splice(t--,1),e=i(i.s=n[0]))}return e}var o={},a={app:0},r={app:0},c=[];function s(e){return i.p+"js/"+({game:"game"}[e]||e)+"."+{"chunk-0bd12dc5":"979c86e6","chunk-3863ded4":"9d4aeae0","chunk-e18ccb40":"8696e2b4",game:"c40438e9"}[e]+".js"}function i(t){if(o[t])return o[t].exports;var n=o[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.e=function(e){var t=[],n={"chunk-0bd12dc5":1,"chunk-3863ded4":1,"chunk-e18ccb40":1,game:1};a[e]?t.push(a[e]):0!==a[e]&&n[e]&&t.push(a[e]=new Promise((function(t,n){for(var o="css/"+({game:"game"}[e]||e)+"."+{"chunk-0bd12dc5":"0a3ff035","chunk-3863ded4":"2f50408f","chunk-e18ccb40":"9a4902a5",game:"c2e62638"}[e]+".css",r=i.p+o,c=document.getElementsByTagName("link"),s=0;s<c.length;s++){var u=c[s],l=u.getAttribute("data-href")||u.getAttribute("href");if("stylesheet"===u.rel&&(l===o||l===r))return t()}var d=document.getElementsByTagName("style");for(s=0;s<d.length;s++){u=d[s],l=u.getAttribute("data-href");if(l===o||l===r)return t()}var g=document.createElement("link");g.rel="stylesheet",g.type="text/css",g.onload=t,g.onerror=function(t){var o=t&&t.target&&t.target.src||r,c=new Error("Loading CSS chunk "+e+" failed.\n("+o+")");c.code="CSS_CHUNK_LOAD_FAILED",c.request=o,delete a[e],g.parentNode.removeChild(g),n(c)},g.href=r;var f=document.getElementsByTagName("head")[0];f.appendChild(g)})).then((function(){a[e]=0})));var o=r[e];if(0!==o)if(o)t.push(o[2]);else{var c=new Promise((function(t,n){o=r[e]=[t,n]}));t.push(o[2]=c);var u,l=document.createElement("script");l.charset="utf-8",l.timeout=120,i.nc&&l.setAttribute("nonce",i.nc),l.src=s(e);var d=new Error;u=function(t){l.onerror=l.onload=null,clearTimeout(g);var n=r[e];if(0!==n){if(n){var o=t&&("load"===t.type?"missing":t.type),a=t&&t.target&&t.target.src;d.message="Loading chunk "+e+" failed.\n("+o+": "+a+")",d.name="ChunkLoadError",d.type=o,d.request=a,n[1](d)}r[e]=void 0}};var g=setTimeout((function(){u({type:"timeout",target:l})}),12e4);l.onerror=l.onload=u,document.head.appendChild(l)}return Promise.all(t)},i.m=e,i.c=o,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)i.d(n,o,function(t){return e[t]}.bind(null,o));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="/",i.oe=function(e){throw console.error(e),e};var u=window["webpackJsonp"]=window["webpackJsonp"]||[],l=u.push.bind(u);u.push=t,u=u.slice();for(var d=0;d<u.length;d++)t(u[d]);var g=l;c.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("cd49")},"0613":function(e,t,n){"use strict";n("b0c0"),n("d3b7"),n("25f0");var o=n("d4ec"),a=n("2b0e"),r=n("2f62"),c=n("bc3a"),s=n.n(c),i=n("afbc");a["a"].use(r["a"]);var u={withCredentials:!0,headers:{"X-Requested-With":"vue","Content-Type":"application/json",Accept:"application/json"},crossdomain:!0},l=function e(t,n){Object(o["a"])(this,e),this.id="",this.name="",this.id=t,this.name=n},d=new r["a"].Store({state:{status:"",token:localStorage.getItem("token")||"",user:{},signedIn:!1,playerPromise:void 0},actions:{setLoggedIn:function(e,t){var n=e.commit;localStorage.setItem("userId",t);var o=new Promise((function(e,n){s.a.get("/user?player="+t).then((function(o){var a=o.data;if("success"in a&&!1===a.success)return console.error(o),void n(o);e(new l(t,a.name))}))}));o.then((function(e){localStorage.setItem("player",JSON.stringify(e))})),localStorage.setItem("userId",t),n("SET_LOGIN",!0),i["a"].push("/")},login:function(e,t){var n=e.commit;console.log(t);var o=u;o.headers={"X-Requested-With":"vue","Content-Type":"application/x-www-form-urlencoded",Accept:"application/json"},s.a.post("/signIn",t,o).then((function(e){console.log(e.data);var t=e.data.userId;localStorage.setItem("userId",t),n("SET_LOGIN",!0),localStorage.setItem("userId",t);var o=new Promise((function(e,n){s.a.get("/user?player="+t).then((function(o){var a=o.data;if("success"in a&&!1===a.success)return console.error(o),void n(o);e(new l(t,a.name))}))}));o.then((function(e){localStorage.setItem("player",JSON.stringify(e))})),i["a"].push("/")})).catch((function(e){console.error(e),console.log("Da ist etwas schief gelaufen.")}))},logout:function(e){var t=e.commit;localStorage.clear(),s.a.get("/signOut",u).then((function(){i["a"].push("/login"),t("SET_LOGIN",!1)})).catch((function(){i["a"].push("/login"),t("SET_LOGIN",!1),console.log("Something went wrong")}))},register:function(e,t){e.commit;var n=u;n.headers={"X-Requested-With":"vue","Content-Type":"application/x-www-form-urlencoded",Accept:"application/json"},s.a.post("/signUp",t,n).then(function(){i["a"].push("/login")}.bind(this)).catch((function(){i["a"].push("/login"),console.log("Something went wrong")}))}},mutations:{SET_LOGIN:function(e,t){e.signedIn=t}},getters:{isLoggedIn:function(){var e=localStorage.getItem("userId");return""!==e&&void 0!==e&&null!==e},getPlayerId:function(){var e=localStorage.getItem("userId");return null===e?"":e.toString()}}});t["a"]=d},"9cde":function(e,t,n){},afbc:function(e,t,n){"use strict";n("45fc"),n("d3b7");var o=n("2b0e"),a=n("8c4f"),r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"playing-table d-block"},[e._m(0),n("v-row",[n("v-col",{staticClass:"m-auto text-center",attrs:{cols:"12"}},[n("h2",[e._v("Hello "+e._s(e.name))])])],1),n("v-row",[n("v-col",{staticClass:"m-auto text-center",attrs:{cols:"12"}},[n("v-btn",{attrs:{to:"/rules",role:"button"}},[e._v("Rules")])],1)],1),n("v-row",[e.isLoggedIn?e._e():n("v-col",{staticClass:"m-auto text-center",attrs:{cols:"12"}},[n("v-btn",{attrs:{to:"/signin",role:"button"}},[e._v("Sign up")])],1)],1),n("v-row",[e.isLoggedIn?e._e():n("v-col",{staticClass:"m-auto text-center",attrs:{cols:"12"}},[n("v-btn",{attrs:{to:"/login",role:"button"}},[e._v("Log in")])],1)],1),n("v-row",[n("v-col",{staticClass:"m-auto text-center",attrs:{cols:"12"}},[n("v-btn",{attrs:{to:"/game",role:"button",color:"info"}},[e._v("Start Game")])],1)],1),n("v-row",[this.isLoggedIn?n("v-col",{staticClass:"m-auto text-center",attrs:{cols:"12"}},[n("v-btn",{attrs:{role:"button",color:"error"},on:{click:e.logout}},[e._v("Log out")])],1):e._e()],1)],1)},c=[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"heading"}},[n("h1",{staticStyle:{"text-align":"center"}},[e._v(" Game Menu ")])])}],s=(n("b0c0"),n("ac1f"),n("3ca3"),n("841c"),n("ddb0"),n("2b3d"),n("d4ec")),i=n("bee2"),u=n("262e"),l=n("2caf"),d=n("9ab4"),g=n("1b40"),f=n("0613"),p=n("bc3a"),h=n.n(p),m=function(e){Object(u["a"])(n,e);var t=Object(l["a"])(n);function n(){var e;return Object(s["a"])(this,n),e=t.call(this),e.name="Player",e.isLoggedIn=f["a"].getters.isLoggedIn,e.setupLogin(),e}return Object(i["a"])(n,[{key:"setupLogin",value:function(){var e=this,t=window.location.search,n=new URLSearchParams(t),o=n.get("userId");if(""===n.get("userId")||null===o||f["a"].getters.isLoggedIn)return console.log("No login needed, because"+o),void(f["a"].getters.isLoggedIn&&(o=f["a"].getters.getPlayerId,h.a.get("/user?player="+o).then((function(t){var n=t.data;"success"in n&&!1===n.success?console.error(n.msg):e.name=n.name}))));console.log("Now logging in"+o),f["a"].dispatch("setLoggedIn",n.get("userId")),location.reload()}},{key:"logout",value:function(){f["a"].dispatch("logout")}}]),n}(g["c"]);m=Object(d["a"])([Object(g["a"])({})],m);var v=m,b=v,y=n("2877"),w=n("6544"),I=n.n(w),S=n("8336"),_=n("62ad"),k=n("0fd9"),O=Object(y["a"])(b,r,c,!1,null,null,null),L=O.exports;I()(O,{VBtn:S["a"],VCol:_["a"],VRow:k["a"]}),o["a"].use(a["a"]);var j=[{path:"/",alias:"/home",name:"Home",component:L},{path:"/signin",name:"Signin",component:function(){return Promise.all([n.e("chunk-0bd12dc5"),n.e("chunk-e18ccb40")]).then(n.bind(null,"4a33"))}},{path:"/login",name:"LogIn",component:function(){return Promise.all([n.e("chunk-0bd12dc5"),n.e("chunk-3863ded4")]).then(n.bind(null,"a55b"))}},{path:"/game",name:"Game",meta:{requiresAuth:!0},component:function(){return Promise.all([n.e("chunk-0bd12dc5"),n.e("game")]).then(n.bind(null,"7d36"))}},{path:"/rules",name:"Rules",component:function(){return Promise.all([n.e("chunk-0bd12dc5"),n.e("game")]).then(n.bind(null,"9f78"))}}],P=new a["a"]({routes:j});P.beforeEach((function(e,t,n){if(e.matched.some((function(e){return e.meta.requiresAuth}))){if(f["a"].getters.isLoggedIn)return void n();n("/login")}else n()}));t["a"]=P},cd49:function(e,t,n){"use strict";n.r(t);n("e260"),n("e6cf"),n("cca6"),n("a79d");var o=n("2b0e"),a=n("2f62"),r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("v-app",[n("v-main",[n("router-view")],1)],1)},c=[],s=o["a"].extend({name:"App",data:function(){return{}}}),i=s,u=n("2877"),l=n("6544"),d=n.n(l),g=n("7496"),f=n("f6c4"),p=Object(u["a"])(i,r,c,!1,null,null,null),h=p.exports;d()(p,{VApp:g["a"],VMain:f["a"]});var m=n("afbc"),v=n("f309");o["a"].use(v["a"]);var b={},y=new v["a"](b),w=(n("9cde"),n("dbaa"),n("bc3a")),I=n.n(w);o["a"].use(a["a"]),o["a"].config.productionTip=!1,new o["a"]({router:m["a"],vuetify:y,render:function(e){return e(h)}}).$mount("#app"),o["a"].prototype.$http=I.a;var S=localStorage.getItem("token");S&&(o["a"].prototype.$http.defaults.headers.common.Authorization=S)},dbaa:function(e,t,n){}});
//# sourceMappingURL=app.e53bec01.js.map