// any.core.js 0.0.1 (rev:6ffcdf6)
// (c) 2011 Philip Lehmann, Lukas Westermann, at-point ag
// any.js is freely distributable under the MIT license.
// Portions of any.js are inspired or borrowed from Underscore.js,
// Prototype and jQuery.
// For all details and documentation:
// TODO: gh-pages
(function(){var g=this.document?this.document:this,d={};this.$a=this._anyNoConflict=d;d.VERSION="0.0.1";d.ready=function(a){this.bind(document,"DOMContentLoaded",a,false)};d.CHROME="chrome";d.FIREFOX="firefox";d.FENNEC="fennec";d.SAFARI="safari";d.MOBILE_SAFARI="mobile_safari";d._BROWSERS={};d._BROWSERS[d.CHROME]=/chrome.*safari/gi;d._BROWSERS[d.FIREFOX]=/Firefox\/4/gi;d._BROWSERS[d.FENNEC]=/fennec/gi;d._BROWSERS[d.SAFARI]=/version.*safari/gi;d._BROWSERS[d.MOBILE_SAFARI]=/version.*mobile.*safari/gi;
d.browserDetection=function(){for(var a in this._BROWSERS)if(this.isBrowser(a))return a;return false};d.isBrowser=function(a){return navigator.userAgent.match(d._BROWSERS[a])!==null};d.isFunc=function(a){return typeof a==="function"};d.isObj=function(a){return!Array.isArray(a)&&typeof a==="object"};d.isArr=function(a){return Array.isArray(a)};d.isCol=function(a){return a instanceof NodeList||a instanceof HTMLCollection};d.isStr=function(a){return typeof a==="string"};d.extend=function(a,b){if(a==
undefined)a={};for(var c in b)try{a[c]=d.isObj(b[c])?d.extend(a[c],b[c]):b[c]}catch(e){a[c]=b[c]}return a};d.json=function(a){if(this.isStr(a))return JSON.parse(a);return JSON.stringify(a)};d.ready=function(a){if(g.addEventListener)g.addEventListener("DOMContentLoaded",a,false);else if(g.readyState&&g.readyState==="complete")a();else g.readyState&&g.attachEvent?g.attachEvent("onreadystatechange",function(){g.readyState==="complete"&&a()}):d.bind(g,"load",a)};d.bind=function(a,b,c,e,f){e=e!==true?
false:true;if(this.isArr(a)||this.isCol(a))for(var h=0;h<a.length;h++)this.bind(a[h],b,c,e,f);else if(this.isFunc(a.addEventListener))return f?a.addEventListener(b,function(i){return c(i,f)},e):a.addEventListener(b,c,e);else if(this.isFunc(a.attachEvent))return f?a.attachEvent("on"+b,function(i){return c(i,f)}):a.attachEvent("on"+b,c)};d.unbind=function(a,b,c,e,f){e=e!==true?false:true;if(this.isArr(a)||this.isCol(a))for(var h=0;h<a.length;h++)this.unbind(a[h],b,c,e);else if(this.isFunc(a.removeEventListener))return f?
a.removeEventListener(b,function(i){return c(i,f)},e):a.removeEventListener(b,c,e);else if(this.isFunc(a.detachEvent))return f?a.detachEvent("on"+b,function(i){return c(i,f)}):a.detachEvent("on"+b,c)};d._supportsEvent=function(a,b){b=b||document.createElement("div");return"on"+a in b};d.id=function(){return(arguments.length>1?arguments[0]:g).getElementById(arguments.length>1?arguments[1]:arguments[0])};d.elsByClass=function(){return(arguments.length>1?arguments[0]:g).getElementsByClassName(arguments.length>
1?arguments[1]:arguments[0])};d.elsByTag=function(a,b){a=arguments.length>1?arguments[0]:g;b=arguments.length>1?arguments[1]:arguments[0];return a.getElementsByTagName(b)};d.first=function(){var a=arguments.length>1?arguments[0]:g,b=arguments.length>1?arguments[1]:arguments[0];if(this.isFunc(a.querySelector))return a.querySelector(b);else if(this.isFunc(Sizzle)){a=Sizzle(b,a);if(a.length>0)return a[0];return null}};d.all=function(){var a=arguments.length>1?arguments[0]:g,b=arguments.length>1?arguments[1]:
arguments[0];if(this.isFunc(a.querySelectorAll))return a.querySelectorAll(b);else if(this.isFunc(Sizzle))return Sizzle(b,a)};d.html=function(a){var b=document.createElement("div");b.innerHTML=a;return b.childNodes};d.data=function(a,b,c){if(c!=undefined)if(a.dataset)a.dataset[b]=c;else a.setAttribute("data-"+b,c);else return a.dataset?a.dataset[b]:a.getAttribute("data-"+b)};d.css=function(a,b){if(this.isArr(a)||this.isCol(a))for(var c=0;c<a.length;c++)this.css(a[c],b);else for(c in b)a.style[c]=b[c]};
d.show=function(a){this.css(a,{display:""})};d.hide=function(a){this.css(a,{display:"none"})};d.toggle=function(a){if(this.isArr(a)||this.isCol(a))for(var b=0;b<a.length;b++)this.toggle(a[b]);else a.style.display=="none"?this.show(a):this.hide(a)};d.addClass=function(a,b){if(this.isArr(a)||this.isCol(a))for(var c=0;c<a.length;c++)this.addClass(a[c],b);else{if(!a.classList)a.classList=new this._ClassList(a);return a.classList.add(b)}};d.removeClass=function(a,b){if(this.isArr(a)||this.isCol(a))for(var c=
0;c<a.length;c++)this.removeClass(a[c],b);else{if(!a.classList)a.classList=new this._ClassList(a);return a.classList.remove(b)}};d.hasClass=function(a,b){if(!a.classList)a.classList=new this._ClassList(a);return a.classList.contains(b)};d.toggleClass=function(a,b){if(this.isArr(a)||this.isCol(a))for(var c=0;c<a.length;c++)this.toggleClass(a[c],b);else{if(!a.classList)a.classList=new this._ClassList(a);return a.classList.toggle(b)}};d.animate=function(a,b,c,e,f){if(this.isArr(a)||this.isCol(a))for(var h=
0;h<a.length;h++)this.animate(a[h],b,c,e,f);else{if(b.property!=undefined){a.style.webkitTransitionProperty=b.property;a.style.mozTransitionProperty=b.property}if(b.duration!=undefined){a.style.webkitTransitionDuration=b.duration;a.style.mozTransitionDuration=b.duration}if(b.timingFunction!=undefined){a.style.webkitTransitionTimingFunction=b.timingFunction;a.style.mozTransitionTimingFunction=b.timingFunction}if(b.delay!=undefined){a.style.webkitTransitionDelay=b.delay;a.style.mozTransitionDelay=b.delay}if(e==
undefined||e){this.bind(a,"webkitTransitionEnd",this._animationCleanup);this.bind(a,"mozTransitionEnd",this._animationCleanup)}if(d.isFunc(f)){this.bind(a,"webkitTransitionEnd",f);this.bind(a,"mozTransitionEnd",f)}this.css(a,c)}};d._animationCleanup=function(a){d.animate(a.currentTarget,{property:null,duration:null,timingFunction:null,delay:null},{},false)};d.transform=function(a,b,c,e,f,h){if(a!=undefined)if(this.isStr(b)&&c===undefined){if(a.matrix==undefined)a.matrix={};switch(b){case "translate":if(a.matrix.translate==
undefined)a.matrix.translate={x:undefined,y:undefined,z:undefined};return a.matrix.translate;case "scale":if(a.matrix.scale==undefined)a.matrix.scale={x:undefined,y:undefined,z:undefined};return a.matrix.scale;case "rotate":if(a.matrix.rotate==undefined)a.matrix.rotate={x:undefined,y:undefined,z:undefined};return a.matrix.rotate}return null}else{if(!this.isObj(a.matrix))a.matrix={};if(a.matrix.translate==undefined)a.matrix.translate={};if(a.matrix.scale==undefined)a.matrix.scale={};if(a.matrix.rotate==
undefined)a.matrix.rotate={};switch(b){case "translate":if(c!=undefined)a.matrix.translate.x=c;if(e!=undefined)a.matrix.translate.y=e;if(f!=undefined)a.matrix.translate.z=f;break;case "scale":if(c!=undefined)a.matrix.scale.x=c;if(e!=undefined)a.matrix.scale.y=e;if(f!=undefined)a.matrix.scale.z=f;break;case "rotate":if(c!=undefined)a.matrix.rotate.x=c;if(e!=undefined)a.matrix.rotate.y=e;if(f!=undefined)a.matrix.rotate.z=f}b=(a.matrix.translate.x!=undefined&&a.matrix.translate.y!=undefined?"translate("+
a.matrix.translate.x+"px,"+a.matrix.translate.y+"px)":"")+" "+(a.matrix.rotate.x!=undefined?"rotate("+a.matrix.rotate.x+"deg)":"")+" "+(a.matrix.scale.x!=undefined?"scale("+a.matrix.scale.x+")":"");if(h!==true){a.style.webkitTransform=b;a.style.MozTransform=b;a.style.oTransform=b;a.style.transform=b}else return b}};d._ClassList=function(a){this.node=a;if(!this.node.className)this.node.className="";this.list=a.className.split(" ");this.add=function(b){if(!this.contains(b)){this.list.push(b);this.clean();
this.node.className=this.list.join(" ")}};this.remove=function(b){if(this.contains(b)){this.list.splice(this.list.indexOf(b),1);this.clean();this.node.className=this.list.join(" ")}};this.contains=function(b){return this.list.indexOf(b)!==-1?true:false};this.toggle=function(b){this.contains(b)?this.remove(b):this.add(b)};this.clean=function(){for(var b=[],c=0;c<this.list.length;c++)this.list[c].length>0&&b.push(this.list[c]);this.list=b};this.clean()};d.ajax=function(a){if(a.method==undefined)a.method=
"GET";if(this.isObj(a.data)&&a.data!=undefined){var b=[],c;for(c in a.data)b.push(c+"="+encodeURIComponent(a.data[c]));a.data=b.join("&")}if(a.method=="GET"&&a.data!=undefined){a.url=a.url+"?"+a.data;a.data=null}var e=new XMLHttpRequest;e.onreadystatechange=function(){if(e.readyState==4)if(e.status==200){if(d.isFunc(a.onsuccess))a.onsuccess(e)}else if(d.isFunc(a.onerror))a.onerror(e)};e.open(a.method,a.url,true);e.send(a.data)}})();
