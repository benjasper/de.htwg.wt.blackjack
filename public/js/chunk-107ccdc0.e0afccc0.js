(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-107ccdc0"],{"474e":function(e,t,n){},5652:function(e,t,n){"use strict";n("474e")},a55b:function(e,t,n){"use strict";n.r(t);var o=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"center"},[n("h1",[e._v("Login")]),n("form",{attrs:{id:"loginform"}},[e._v(" E-Mail-Adresse: "),n("br"),n("input",{directives:[{name:"model",rawName:"v-model",value:e.email,expression:"email"}],attrs:{placeholder:"max@mustermann.de"},domProps:{value:e.email},on:{input:function(t){t.target.composing||(e.email=t.target.value)}}}),n("br"),n("br"),e._v(" Passwort: "),n("br"),n("input",{directives:[{name:"model",rawName:"v-model",value:e.password,expression:"password"}],attrs:{type:"password"},domProps:{value:e.password},on:{input:function(t){t.target.composing||(e.password=t.target.value)}}}),n("br"),n("br"),n("button",{on:{click:function(t){return e.login()}}},[e._v("LOGIN")])]),n("br"),n("button",{on:{click:function(t){return e.googleLogin()}}},[e._v("LOGIN MIT GOOGLE")]),n("br"),n("br"),e._v(" Noch keinen Account? "),n("br"),n("button",{on:{click:function(t){return e.gotoSignup()}}},[e._v("REGISTRIEREN!")])])},a=[],r=(n("ac1f"),n("5319"),n("d4ec")),i=n("bee2"),s=n("262e"),c=n("2caf"),u=n("9ab4"),l=n("1b40"),p=function(e){Object(s["a"])(n,e);var t=Object(c["a"])(n);function n(){var e;return Object(r["a"])(this,n),e=t.apply(this,arguments),e.email="",e.password="",e}return Object(i["a"])(n,[{key:"login",value:function(){var e=new FormData;e.append("email",this.email),e.append("password",this.password),this.$store.dispatch("login",e)}},{key:"googleLogin",value:function(){location.replace("http://localhost:9000/authenticate/google")}},{key:"gotoSignup",value:function(){this.$router.push("signup")}}]),n}(l["c"]);p=Object(u["a"])([Object(l["a"])({name:"Login"})],p);var d=p,m=d,v=(n("5652"),n("2877")),b=Object(v["a"])(m,o,a,!1,null,"5f5a1a25",null);t["default"]=b.exports}}]);
//# sourceMappingURL=chunk-107ccdc0.e0afccc0.js.map