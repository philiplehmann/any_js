// any.js 0.0.1 (rev:6d6a979)
// (c) 2011 Philip Lehmann, Lukas Westermann, at-point ag
// any.js is freely distributable under the MIT license.
// Portions of any.js are inspired or borrowed from Underscore.js,
// Prototype and jQuery.
// For all details and documentation:
// TODO: gh-pages
(function(){var g=this.document!=undefined?this.document:this,d={};this.$a=this._anyNoConflict=d;d.VERSION="0.0.1";d.ready=function(a){this.bind("DOMContentLoaded",a,false)};d.isFunc=function(a){return typeof a==="function"};d.isObj=function(a){return!Array.isArray(a)&&typeof a==="object"};d.isArr=function(a){return Array.isArray(a)};d.isStr=function(a){return typeof a==="string"};d.extend=function(a,b){for(var c in b)try{a[c]=d.isObj(b[c])?d.extend(a[c],b[c]):b[c]}catch(e){a[c]=b[c]}return a};d.json=
function(a){if(this.isStr(a))return JSON.parse(a);return JSON.stringify(a)};d.bind=function(a,b,c,e){if(a.addEventListener)a.addEventListener(b,c,e);else a.attachEvent&&a.attachEvent("on"+b,c)};d.unbind=function(a,b,c,e){if(a.removeEventListener)a.removeEventListener(b,c,e);else a.detachEvent&&a.detachEvent("on"+b,c)};d.id=function(a,b){a=b?a:g;return a.getElementById(b||a)};d.first=function(a,b){a=b?a:g;return a.querySelector(b||a)};d.all=function(a,b){a=b?a:g;return a.querySelectorAll(b||a)};d.html=
function(a){var b=document.createElement("div");b.innerHTML=a;return b.childNodes};d.data=function(a,b,c){if(c!=undefined)a.setAttribute("data-"+b,c);else return a.getAttribute("data-"+b)};d.css=function(a,b){for(var c in b)a.style[c]=b[c]};d.addClass=function(a,b){if(!a.classList)a.classList=new this._ClassList(a);return a.classList.add(b)};d.removeClass=function(a,b){if(!a.classList)a.classList=new this._ClassList(a);return a.classList.remove(b)};d.hasClass=function(a,b){if(!a.classList)a.classList=
new this._ClassList(a);return a.classList.contains(b)};d.toggleClass=function(a,b){if(!a.classList)a.classList=new this._ClassList(a);return a.classList.toggle(b)};d.animate=function(a,b,c,e,f){if(b.property!=undefined){a.style.webkitTransitionProperty=b.property;a.style.mozTransitionProperty=b.property}if(b.duration!=undefined){a.style.webkitTransitionDuration=b.duration;a.style.mozTransitionDuration=b.duration}if(b.timingFunction!=undefined){a.style.webkitTransitionTimingFunction=b.timingFunction;
a.style.mozTransitionTimingFunction=b.timingFunction}if(b.delay!=undefined){a.style.webkitTransitionDelay=b.delay;a.style.mozTransitionDelay=b.delay}if(e==undefined||e){this.bind(a,"webkitTransitionEnd",this._animationCleanup);this.bind(a,"mozTransitionEnd",this._animationCleanup)}if(d.isFunc(f)){this.bind(a,"webkitTransitionEnd",f);this.bind(a,"mozTransitionEnd",f)}this.css(a,c)};d._animationCleanup=function(a){d.animate(a.currentTarget,{property:null,duration:null,timingFunction:null,delay:null},
{},false)};d.transform=function(a,b,c,e,f){if(a!=undefined){if(this.isStr(b)&&c===undefined){if(a.matrix==undefined)a.matrix={};switch(b){case "translate":if(a.matrix.translate==undefined)a.matrix.translate={x:undefined,y:undefined,z:undefined};return a.matrix.translate;case "scale":if(a.matrix.scale==undefined)a.matrix.scale={x:undefined,y:undefined,z:undefined};return a.matrix.scale;case "rotate":if(a.matrix.rotate==undefined)a.matrix.rotate={x:undefined,y:undefined,z:undefined};return a.matrix.rotate}}else{if(!this.isObj(a.matrix))a.matrix=
{};if(a.matrix.translate==undefined)a.matrix.translate={};if(a.matrix.scale==undefined)a.matrix.scale={};if(a.matrix.rotate==undefined)a.matrix.rotate={};switch(b){case "translate":if(c!=undefined)a.matrix.translate.x=c;if(e!=undefined)a.matrix.translate.y=e;if(f!=undefined)a.matrix.translate.z=f;break;case "scale":if(c!=undefined)a.matrix.scale.x=c;if(e!=undefined)a.matrix.scale.y=e;if(f!=undefined)a.matrix.scale.z=f;break;case "rotate":if(c!=undefined)a.matrix.rotate.x=c;if(e!=undefined)a.matrix.rotate.y=
e;if(f!=undefined)a.matrix.rotate.z=f}b=(a.matrix.translate.x!=undefined&&a.matrix.translate.y!=undefined?"translate("+a.matrix.translate.x+"px,"+a.matrix.translate.y+"px)":"")+" "+(a.matrix.rotate.x!=undefined?"rotate("+a.matrix.rotate.x+"deg)":"")+" "+(a.matrix.scale.x!=undefined?"scale("+a.matrix.scale.x+")":"");a.style.webkitTransform=b;a.style.MozTransform=b}return null}};d._ClassList=function(a){this.node=a;if(!this.node.className)this.node.className="";this.list=a.className.split(" ");this.add=
function(b){if(!this.contains(b)){this.list.push(b);this.clean();this.node.className=this.list.join(" ")}};this.remove=function(b){if(this.contains(b)){this.list.splice(this.list.indexOf(b),1);this.clean();this.node.className=this.list.join(" ")}};this.contains=function(b){return this.list.indexOf(b)!==-1?true:false};this.toggle=function(b){this.contains(b)?this.remove(b):this.add(b)};this.clean=function(){for(var b=[],c=0;c<this.list.length;c++)this.list[c].length>0&&b.push(this.list[c]);this.list=
b};this.clean()};d.ajax=function(a){if(a.method==undefined)a.method="GET";if(a.method=="GET"){a.url=a.url+"?"+a.data;a.data=null}var b=new XMLHttpRequest;b.onreadystatechange=function(){if(b.readyState==4)if(b.status==200)d.isFunc(onsuccess)&&onsuccess(b.responseText);else d.isFunc(onerror)&&onerror()};b.open(a.method,a.url,true);b.send(a.data)}})();
