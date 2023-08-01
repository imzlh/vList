/* libass V0.0.11~2020.8.16 Copyright(C) weizhenye */
(function(t,e){typeof exports==="object"&&typeof module!=="undefined"?module.exports=e():typeof define==="function"&&define.amd?define(e):(t=t||self,t.ASS=e())})(this,function(){"use strict";function l(t){var e=t.toLowerCase().trim().split(/\s*;\s*/);if(e[0]==="banner"){return{name:e[0],delay:e[1]*1||0,leftToRight:e[2]*1||0,fadeAwayWidth:e[3]*1||0}}if(/^scroll\s/.test(e[0])){return{name:e[0],y1:Math.min(e[1]*1,e[2]*1),y2:Math.max(e[1]*1,e[2]*1),delay:e[3]*1||0,fadeAwayHeight:e[4]*1||0}}return null}function y(t){return t.toLowerCase().replace(/([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?)/g," $1 ").replace(/([mnlbspc])/g," $1 ").trim().replace(/\s+/g," ").split(/\s(?=[mnlbspc])/).map(function(t){return t.split(" ").filter(function(t,e){return!(e&&Number.isNaN(t*1))})})}var t=["b","i","u","s","fsp","k","K","kf","ko","kt","fe","q","p","pbo","a","an","fscx","fscy","fax","fay","frx","fry","frz","fr","be","blur","bord","xbord","ybord","shad","xshad","yshad"];var x=t.map(function(t){return{name:t,regex:new RegExp("^"+t+"-?\\d")}});function b(t){var e;var a={};for(var r=0;r<x.length;r++){var i=x[r];var n=i.name;var s=i.regex;if(s.test(t)){a[n]=t.slice(n.length)*1;return a}}if(/^fn/.test(t)){a.fn=t.slice(2)}else if(/^r/.test(t)){a.r=t.slice(1)}else if(/^fs[\d+-]/.test(t)){a.fs=t.slice(2)}else if(/^\d?c&?H?[0-9a-f]+|^\d?c$/i.test(t)){var o=t.match(/^(\d?)c&?H?(\w*)/);var l=o[1];var f=o[2];a["c"+(l||1)]=f&&("000000"+f).slice(-6)}else if(/^\da&?H?[0-9a-f]+/i.test(t)){var h=t.match(/^(\d)a&?H?(\w\w)/);var v=h[1];var c=h[2];a["a"+v]=c}else if(/^alpha&?H?[0-9a-f]+/i.test(t)){e=t.match(/^alpha&?H?([0-9a-f]+)/i),a.alpha=e[1];a.alpha=("00"+a.alpha).slice(-2)}else if(/^(?:pos|org|move|fad|fade)\(/.test(t)){var d=t.match(/^(\w+)\((.*?)\)?$/);var p=d[1];var u=d[2];a[p]=u.trim().split(/\s*,\s*/).map(Number)}else if(/^i?clip/.test(t)){var g=t.match(/^i?clip\((.*?)\)?$/)[1].trim().split(/\s*,\s*/);a.clip={inverse:/iclip/.test(t),scale:1,drawing:null,dots:null};if(g.length===1){a.clip.drawing=y(g[0])}if(g.length===2){a.clip.scale=g[0]*1;a.clip.drawing=y(g[1])}if(g.length===4){a.clip.dots=g.map(Number)}}else if(/^t\(/.test(t)){var m=t.match(/^t\((.*?)\)?$/)[1].trim().replace(/\\.*/,function(t){return t.replace(/,/g,"\n")}).split(/\s*,\s*/);if(!m[0]){return a}a.t={t1:0,t2:0,accel:1,tags:m[m.length-1].replace(/\n/g,",").split("\\").slice(1).map(b)};if(m.length===2){a.t.accel=m[0]*1}if(m.length===3){a.t.t1=m[0]*1;a.t.t2=m[1]*1}if(m.length===4){a.t.t1=m[0]*1;a.t.t2=m[1]*1;a.t.accel=m[2]*1}}return a}function s(t){var e=[];var a=0;var r="";for(var i=0;i<t.length;i++){var n=t[i];if(n==="("){a++}if(n===")"){a--}if(a<0){a=0}if(!a&&n==="\\"){if(r){e.push(r)}r=""}else{r+=n}}e.push(r);return e.map(b)}function f(t){var e=t.split(/{([^{}]*?)}/);var a=[];if(e[0].length){a.push({tags:[],text:e[0],drawing:[]})}for(var r=1;r<e.length;r+=2){var i=s(e[r]);var n=i.reduce(function(t,e){return e.p===undefined?t:!!e.p},false);a.push({tags:i,text:n?"":e[r+1],drawing:n?y(e[r+1]):[]})}return{raw:t,combined:a.map(function(t){return t.text}).join(""),parsed:a}}function h(t){var e=t.split(":");return e[0]*3600+e[1]*60+e[2]*1}function c(t,e){var a=t.split(",");if(a.length>e.length){var r=a.slice(e.length-1).join();a=a.slice(0,e.length-1);a.push(r)}var i={};for(var n=0;n<a.length;n++){var s=e[n];var o=a[n].trim();switch(s){case"Layer":case"MarginL":case"MarginR":case"MarginV":i[s]=o*1;break;case"Start":case"End":i[s]=h(o);break;case"Effect":i[s]=l(o);break;case"Text":i[s]=f(o);break;default:i[s]=o}}return i}function d(t){return t.match(/Format\s*:\s*(.*)/i)[1].split(/\s*,\s*/)}function p(t){return t.match(/Style\s*:\s*(.*)/i)[1].split(/\s*,\s*/)}function i(t){var e={info:{},styles:{format:[],style:[]},events:{format:[],comment:[],dialogue:[]}};var a=t.split(/\r?\n/);var r=0;for(var i=0;i<a.length;i++){var n=a[i].trim();if(/^;/.test(n)){continue}if(/^\[Script Info\]/i.test(n)){r=1}else if(/^\[V4\+? Styles\]/i.test(n)){r=2}else if(/^\[Events\]/i.test(n)){r=3}else if(/^\[.*\]/.test(n)){r=0}if(r===0){continue}if(r===1){if(/:/.test(n)){var s=n.match(/(.*?)\s*:\s*(.*)/);var o=s[1];var l=s[2];e.info[o]=l}}if(r===2){if(/^Format\s*:/i.test(n)){e.styles.format=d(n)}if(/^Style\s*:/i.test(n)){e.styles.style.push(p(n))}}if(r===3){if(/^Format\s*:/i.test(n)){e.events.format=d(n)}if(/^(?:Comment|Dialogue)\s*:/i.test(n)){var f=n.match(/^(\w+?)\s*:\s*(.*)/i);var h=f[1];var v=f[2];e.events[h.toLowerCase()].push(c(v,e.events.format))}}}return e}var q=Object.assign||function t(e){var a=[],r=arguments.length-1;while(r-- >0)a[r]=arguments[r+1];for(var i=0;i<a.length;i++){if(!a[i]){continue}var n=Object.keys(a[i]);for(var s=0;s<n.length;s++){e[n[s]]=a[i][n[s]]}}return e};function v(t){var e={type:null,prev:null,next:null,points:[]};if(/[mnlbs]/.test(t[0])){e.type=t[0].toUpperCase().replace("N","L").replace("B","C")}for(var a=t.length-!(t.length&1),r=1;r<a;r+=2){e.points.push({x:t[r]*1,y:t[r+1]*1})}return e}function u(t){if(!t.points.length||!t.type){return false}if(/C|S/.test(t.type)&&t.points.length<3){return false}return true}function g(t){var e;var r=Infinity;var i=Infinity;var n=-Infinity;var s=-Infinity;(e=[]).concat.apply(e,t.map(function(t){var e=t.points;return e})).forEach(function(t){var e=t.x;var a=t.y;r=Math.min(r,e);i=Math.min(i,a);n=Math.max(n,e);s=Math.max(s,a)});return{minX:r,minY:i,width:n-r,height:s-i}}function m(t,e,a){var r=[];var i=[0,2/3,1/3,0];var n=[0,1/3,2/3,0];var s=[0,1/6,2/3,1/6];var o=function(t,e){return t[0]*e[0]+t[1]*e[1]+t[2]*e[2]+t[3]*e[3]};var l=[t[t.length-1].x,t[0].x,t[1].x,t[2].x];var f=[t[t.length-1].y,t[0].y,t[1].y,t[2].y];r.push({type:e==="M"?"M":"L",points:[{x:o(s,l),y:o(s,f)}]});for(var h=3;h<t.length;h++){l=[t[h-3].x,t[h-2].x,t[h-1].x,t[h].x];f=[t[h-3].y,t[h-2].y,t[h-1].y,t[h].y];r.push({type:"C",points:[{x:o(i,l),y:o(i,f)},{x:o(n,l),y:o(n,f)},{x:o(s,l),y:o(s,f)}]})}if(a==="L"||a==="C"){var v=t[t.length-1];r.push({type:"L",points:[{x:v.x,y:v.y}]})}return r}function w(t){return t.map(function(t){var e=t.type;var a=t.points;return e+a.map(function(t){var e=t.x;var a=t.y;return e+","+a}).join(",")}).join("")}function B(t){var e;var a=[];var r=0;while(r<t.length){var i=t[r];var n=v(i);if(u(n)){if(n.type==="S"){var s=(a[r-1]||{points:[{x:0,y:0}]}).points.slice(-1)[0];var o=s.x;var l=s.y;n.points.unshift({x:o,y:l})}if(r){n.prev=a[r-1].type;a[r-1].next=n.type}a.push(n);r++}else{if(r&&a[r-1].type==="S"){var f={p:n.points,c:a[r-1].points.slice(0,3)};a[r-1].points=a[r-1].points.concat((f[i[0]]||[]).map(function(t){var e=t.x;var a=t.y;return{x:e,y:a}}))}t.splice(r,1)}}var h=(e=[]).concat.apply(e,a.map(function(t){var e=t.type;var a=t.points;var r=t.prev;var i=t.next;return e==="S"?m(a,r,i):{type:e,points:a}}));return q({instructions:h,d:w(h)},g(a))}var O=["fs","clip","c1","c2","c3","c4","a1","a2","a3","a4","alpha","fscx","fscy","fax","fay","frx","fry","frz","fr","be","blur","bord","xbord","ybord","shad","xshad","yshad"];function R(t,e,a){var r,i,n;if(a===void 0)a={};var s=t[e];if(s===undefined){return null}if(e==="pos"||e==="org"){return s.length===2?(r={},r[e]={x:s[0],y:s[1]},r):null}if(e==="move"){var o=s[0];var l=s[1];var f=s[2];var h=s[3];var v=s[4];if(v===void 0)v=0;var c=s[5];if(c===void 0)c=0;return s.length===4||s.length===6?{move:{x1:o,y1:l,x2:f,y2:h,t1:v,t2:c}}:null}if(e==="fad"||e==="fade"){if(s.length===2){var d=s[0];var p=s[1];return{fade:{type:"fad",t1:d,t2:p}}}if(s.length===7){var u=s[0];var g=s[1];var m=s[2];var y=s[3];var x=s[4];var b=s[5];var w=s[6];return{fade:{type:"fade",a1:u,a2:g,a3:m,t1:y,t2:x,t3:b,t4:w}}}return null}if(e==="clip"){var S=s.inverse;var _=s.scale;var C=s.drawing;var $=s.dots;if(C){return{clip:{inverse:S,scale:_,drawing:B(C),dots:$}}}if($){var A=$[0];var M=$[1];var N=$[2];var k=$[3];return{clip:{inverse:S,scale:_,drawing:C,dots:{x1:A,y1:M,x2:N,y2:k}}}}return null}if(/^[xy]?(bord|shad)$/.test(e)){s=Math.max(s,0)}if(e==="bord"){return{xbord:s,ybord:s}}if(e==="shad"){return{xshad:s,yshad:s}}if(/^c\d$/.test(e)){return i={},i[e]=s||a[e],i}if(e==="alpha"){return{a1:s,a2:s,a3:s,a4:s}}if(e==="fr"){return{frz:s}}if(e==="fs"){return{fs:/^\+|-/.test(s)?(s*1>-10?1+s/10:1)*a.fs:s*1}}if(e==="t"){var T=s.t1;var E=s.accel;var F=s.tags;var j=s.t2||(a.end-a.start)*1e3;var L={};F.forEach(function(t){var e=Object.keys(t)[0];if(~O.indexOf(e)&&!(e==="clip"&&!t[e].dots)){q(L,R(t,e,a))}});return{t:{t1:T,t2:j,accel:E,tag:L}}}return n={},n[e]=s,n}var z=[null,1,2,3,null,7,8,9,null,4,5,6];var H=["r","a","an","pos","org","move","fade","fad","clip"];function I(t,e){return{name:t,borderStyle:e[t].style.BorderStyle,tag:e[t].tag,fragments:[]}}function S(t){var e=t.styles;var a=t.name;var r=t.parsed;var i=t.start;var n=t.end;var s;var o;var l;var f;var h;var v;var c=[];var d=I(a,e);var p={};for(var u=0;u<r.length;u++){var g=r[u];var m=g.tags;var y=g.text;var x=g.drawing;var b=void 0;for(var w=0;w<m.length;w++){var S=m[w];b=S.r===undefined?b:S.r}var _={tag:b===undefined?JSON.parse(JSON.stringify(p)):{},text:y,drawing:x.length?B(x):null};for(var C=0;C<m.length;C++){var $=m[C];s=s||z[$.a||0]||$.an;o=o||R($,"pos");l=l||R($,"org");f=f||R($,"move");h=h||R($,"fade")||R($,"fad");v=R($,"clip")||v;var A=Object.keys($)[0];if(A&&!~H.indexOf(A)){var M=d.tag;var N=M.c1;var k=M.c2;var T=M.c3;var E=M.c4;var F=p.fs||d.tag.fs;var j=R($,A,{start:i,end:n,c1:N,c2:k,c3:T,c4:E,fs:F});if(A==="t"){_.tag.t=_.tag.t||[];_.tag.t.push(j.t)}else{q(_.tag,j)}}}p=_.tag;if(b!==undefined){c.push(d);d=I(e[b]?b:a,e)}if(_.text||_.drawing){var L=d.fragments[d.fragments.length-1]||{};if(L.text&&_.text&&!Object.keys(_.tag).length){L.text+=_.text}else{d.fragments.push(_)}}}c.push(d);return q({alignment:s,slices:c},o,l,f,h,v)}function n(t){var e=t.styles;var a=t.dialogues;var r=Infinity;var i=[];for(var n=0;n<a.length;n++){var s=a[n];if(s.Start>=s.End){continue}if(!e[s.Style]){s.Style="Default"}var o=e[s.Style].style;var l=S({styles:e,name:s.Style,parsed:s.Text.parsed,start:s.Start,end:s.End});var f=l.alignment||o.Alignment;r=Math.min(r,s.Layer);i.push(q({layer:s.Layer,start:s.Start,end:s.End,margin:{left:s.MarginL||o.MarginL,right:s.MarginR||o.MarginR,vertical:s.MarginV||o.MarginV},effect:s.Effect},l,{alignment:f}))}for(var h=0;h<i.length;h++){i[h].layer-=r}return i.sort(function(t,e){return t.start-e.start||t.end-e.end})}var o={Name:"Default",Fontname:"Arial",Fontsize:"20",PrimaryColour:"&H00FFFFFF&",SecondaryColour:"&H000000FF&",OutlineColour:"&H00000000&",BackColour:"&H00000000&",Bold:"0",Italic:"0",Underline:"0",StrikeOut:"0",ScaleX:"100",ScaleY:"100",Spacing:"0",Angle:"0",BorderStyle:"1",Outline:"2",Shadow:"2",Alignment:"2",MarginL:"10",MarginR:"10",MarginV:"10",Encoding:"1"};function _(t){if(/^(&|H|&H)[0-9a-f]{6,}/i.test(t)){var e=t.match(/&?H?([0-9a-f]{2})?([0-9a-f]{6})/i);var a=e[1];var r=e[2];return[a||"00",r]}var i=parseInt(t,10);if(!Number.isNaN(i)){var n=-2147483648;var s=2147483647;if(i<n){return["00","000000"]}var o=n<=i&&i<=s?("00000000"+(i<0?i+4294967296:i).toString(16)).slice(-8):String(i).slice(0,8);return[o.slice(0,2),o.slice(2)]}return["00","000000"]}function C(t){var u=t.info;var e=t.style;var r=t.format;var a=t.defaultStyle;var g={};var m=[q({},o,a,{Name:"Default"})].concat(e.map(function(t){var e={};for(var a=0;a<r.length;a++){e[r[a]]=t[a]}return e}));var i=function(t){var e=m[t];if(/^(\*+)Default$/.test(e.Name)){e.Name="Default"}Object.keys(e).forEach(function(t){if(t!=="Name"&&t!=="Fontname"&&!/Colour/.test(t)){e[t]*=1}});var a=_(e.PrimaryColour);var r=a[0];var i=a[1];var n=_(e.SecondaryColour);var s=n[0];var o=n[1];var l=_(e.OutlineColour);var f=l[0];var h=l[1];var v=_(e.BackColour);var c=v[0];var d=v[1];var p={fn:e.Fontname,fs:e.Fontsize,c1:i,a1:r,c2:o,a2:s,c3:h,a3:f,c4:d,a4:c,b:Math.abs(e.Bold),i:Math.abs(e.Italic),u:Math.abs(e.Underline),s:Math.abs(e.StrikeOut),fscx:e.ScaleX,fscy:e.ScaleY,fsp:e.Spacing,frz:e.Angle,xbord:e.Outline,ybord:e.Outline,xshad:e.Shadow,yshad:e.Shadow,q:/^[0-3]$/.test(u.WrapStyle)?u.WrapStyle*1:2};g[e.Name]={style:e,tag:p}};for(var n=0;n<m.length;n++)i(n);return g}function $(t,e){if(e===void 0)e={};var a=i(t);var r=C({info:a.info,style:a.styles.style,format:a.styles.format,defaultStyle:e.defaultStyle||{}});return{info:a.info,width:a.info.PlayResX*1||null,height:a.info.PlayResY*1||null,collisions:a.info.Collisions||"Normal",styles:r,dialogues:n({styles:r,dialogues:a.events.dialogue})}}var a=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||function(t){return setTimeout(t,50/3)};var r=window.cancelAnimationFrame||window.mozCancelAnimationFrame||window.webkitCancelAnimationFrame||clearTimeout;function P(t){var e=t.match(/(\w\w)(\w\w)(\w\w)(\w\w)/);var a=1-("0x"+e[1])/255;var r=+("0x"+e[2]);var i=+("0x"+e[3]);var n=+("0x"+e[4]);return"rgba("+n+","+i+","+r+","+a+")"}function U(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(t){var e=Math.random()*16|0;var a=t==="x"?e:e&3|8;return a.toString(16)})}function A(t,e){if(e===void 0)e=[];var a=document.createElementNS("http://www.w3.org/2000/svg",t);for(var r=0;r<e.length;r++){var i=e[r];a.setAttributeNS(i[0]==="xlink:href"?"http://www.w3.org/1999/xlink":null,i[0],i[1])}return a}function e(t){var e=document.body;var a=e.style;var r=t.replace(/^\w/,function(t){return t.toUpperCase()});if(t in a){return""}if("webkit"+r in a){return"-webkit-"}if("moz"+r in a){return"-moz-"}return""}var M={transform:e("transform"),animation:e("animation"),clipPath:e("clipPath")};function N(t){var e=t.getRootNode?t.getRootNode():document;return e===document?e.head:e}var Y=["c3","a3","c4","a4","xbord","ybord","xshad","yshad","blur","be"];var D=["fscx","fscy","frx","fry","frz","fax","fay"];function k(t){var r=this._.scriptRes.width;var i=this._.scriptRes.height;var e="";if(t.dots!==null){var a=t.dots;var n=a.x1;var s=a.y1;var o=a.x2;var l=a.y2;n/=r;s/=i;o/=r;l/=i;e="M"+n+","+s+"L"+n+","+l+","+o+","+l+","+o+","+s+"Z"}if(t.drawing!==null){e=t.drawing.instructions.map(function(t){var e=t.type;var a=t.points;return e+a.map(function(t){var e=t.x;var a=t.y;return e/r+","+a/i}).join(",")}).join("")}var f=1/(1<<t.scale-1);if(t.inverse){e+="M0,0L0,"+f+","+f+","+f+","+f+",0,0,0Z"}var h="ASS-"+U();var v=A("clipPath",[["id",h],["clipPathUnits","objectBoundingBox"]]);v.appendChild(A("path",[["d",e],["transform","scale("+f+")"],["clip-rule","evenodd"]]));this._.$defs.appendChild(v);return{$clipPath:v,cssText:M.clipPath+"clip-path:url(#"+h+");"}}function T(t){if(!t.clip){return}var e=document.createElement("div");this._.$stage.insertBefore(e,t.$div);e.appendChild(t.$div);e.className="ASS-fix-objectBoundingBox";var a=k.call(this,t.clip);var r=a.cssText;var i=a.$clipPath;this._.$defs.appendChild(i);e.style.cssText=r;q(t,{$div:e,$clipPath:i})}var E=document.createElement("div");E.className="ASS-fix-font-size";E.textContent="M";var F=Object.create(null);function G(t,e){var a=t+"-"+e;if(!F[a]){E.style.cssText="line-height:normal;font-size:"+e+'px;font-family:"'+t+'",Arial;';F[a]=e*e/E.clientHeight}return F[a]}function j(t,e,a){var r=t.xbord||t.ybord;var i=t.xshad||t.yshad;var n=t.a1!=="FF";var s=t.blur||t.be||0;var o=A("filter",[["id",e]]);o.appendChild(A("feGaussianBlur",[["stdDeviation",r?0:s],["in","SourceGraphic"],["result","sg_b"]]));o.appendChild(A("feFlood",[["flood-color",P(t.a1+t.c1)],["result","c1"]]));o.appendChild(A("feComposite",[["operator","in"],["in","c1"],["in2","sg_b"],["result","main"]]));if(r){o.appendChild(A("feMorphology",[["radius",t.xbord*a+" "+t.ybord*a],["operator","dilate"],["in","SourceGraphic"],["result","dil"]]));o.appendChild(A("feGaussianBlur",[["stdDeviation",s],["in","dil"],["result","dil_b"]]));o.appendChild(A("feComposite",[["operator","out"],["in","dil_b"],["in2","SourceGraphic"],["result","dil_b_o"]]));o.appendChild(A("feFlood",[["flood-color",P(t.a3+t.c3)],["result","c3"]]));o.appendChild(A("feComposite",[["operator","in"],["in","c3"],["in2","dil_b_o"],["result","border"]]))}if(i&&(r||n)){o.appendChild(A("feOffset",[["dx",t.xshad*a],["dy",t.yshad*a],["in",r?"dil":"SourceGraphic"],["result","off"]]));o.appendChild(A("feGaussianBlur",[["stdDeviation",s],["in","off"],["result","off_b"]]));if(!n){o.appendChild(A("feOffset",[["dx",t.xshad*a],["dy",t.yshad*a],["in","SourceGraphic"],["result","sg_off"]]));o.appendChild(A("feComposite",[["operator","out"],["in","off_b"],["in2","sg_off"],["result","off_b_o"]]))}o.appendChild(A("feFlood",[["flood-color",P(t.a4+t.c4)],["result","c4"]]));o.appendChild(A("feComposite",[["operator","in"],["in","c4"],["in2",n?"off_b":"off_b_o"],["result","shadow"]]))}var l=A("feMerge",[]);if(i&&(r||n)){l.appendChild(A("feMergeNode",[["in","shadow"]]))}if(r){l.appendChild(A("feMergeNode",[["in","border"]]))}l.appendChild(A("feMergeNode",[["in","main"]]));o.appendChild(l);return o}function X(t,e){var a=[];var r=P(t.a3+t.c3);var i=t.xbord*e;var n=t.ybord*e;var s=P(t.a4+t.c4);var o=t.xshad*e;var l=t.yshad*e;var f=t.blur||t.be||0;if(!(i+n+o+l)){return"none"}if(i||n){for(var h=-1;h<=1;h++){for(var v=-1;v<=1;v++){for(var c=1;c<i;c++){for(var d=1;d<n;d++){if(h||v){a.push(r+" "+h*c+"px "+v*d+"px "+f+"px")}}}a.push(r+" "+h*i+"px "+v*n+"px "+f+"px")}}}if(o||l){var p=o>0?1:-1;var u=l>0?1:-1;o=Math.abs(o);l=Math.abs(l);for(var g=Math.max(i,o-i);g<o+i;g++){for(var m=Math.max(n,l-n);m<l+n;m++){a.push(s+" "+g*p+"px "+m*u+"px "+f+"px")}}a.push(s+" "+(o+i)*p+"px "+(l+n)*u+"px "+f+"px")}return a.join()}function W(t){return["perspective(314px)","rotateY("+(t.fry||0)+"deg)","rotateX("+(t.frx||0)+"deg)","rotateZ("+(-t.frz||0)+"deg)","scale("+(t.p?1:(t.fscx||100)/100)+","+(t.p?1:(t.fscy||100)/100)+")","skew("+(t.fax||0)+"rad,"+(t.fay||0)+"rad)"].join(" ")}function L(t){var e=t.alignment;var a=t.width;var r=t.height;var i=t.x;var n=t.y;var s=t.$div;var o=t.org;if(!o){o={x:0,y:0};if(e%3===1){o.x=i}if(e%3===2){o.x=i+a/2}if(e%3===0){o.x=i+a}if(e<=3){o.y=n+r}if(e>=4&&e<=6){o.y=n+r/2}if(e>=7){o.y=n}}for(var l=s.childNodes.length-1;l>=0;l--){var f=s.childNodes[l];if(f.dataset.hasRotate==="true"){var h=o.x-i-f.offsetLeft;var v=o.y-n-f.offsetTop;f.style.cssText+=M.transform+"transform-origin:"+h+"px "+v+"px;"}}}function V(t,e){return"@"+M.animation+"keyframes "+t+" {"+e+"}\n"}var J=function t(){this.obj={}};J.prototype.set=function t(e,a,r){if(!this.obj[e]){this.obj[e]={}}this.obj[e][a]=r};J.prototype.setT=function t(e){var a=e.t1;var r=e.t2;var i=e.duration;var n=e.prop;var s=e.from;var o=e.to;this.set("0.000%",n,s);if(a<i){this.set((a/i*100).toFixed(3)+"%",n,s)}if(r<i){this.set((r/i*100).toFixed(3)+"%",n,o)}this.set("100.000%",n,o)};J.prototype.toString=function t(){var a=this;return Object.keys(this.obj).map(function(e){return e+"{"+Object.keys(a.obj[e]).map(function(t){return""+(M[t]||"")+t+":"+a.obj[e][t]+";"}).join("")+"}"}).join("")};function Z(t){return t.reduceRight(function(t,e){var a=false;return t.map(function(t){a=e.t1===t.t1&&e.t2===t.t2&&e.accel===t.accel;return q({},t,a?{tag:q({},t.tag,e.tag)}:{})}).concat(a?[]:e)},[])}function K(){var H=this;var I="";this.dialogues.forEach(function(t){var e=t.start;var a=t.end;var r=t.effect;var i=t.move;var n=t.fade;var s=t.slices;var $=(a-e)*1e3;var o=new J;if(r&&!i){var l=r.name;var f=r.delay;var h=r.lefttoright;var v=r.y1;var c=r.y2||H._.resampledRes.height;if(l==="banner"){var d=H.scale*($/f)*(h?1:-1);o.set("0.000%","transform","translateX(0)");o.set("100.000%","transform","translateX("+d+"px)")}if(/^scroll/.test(l)){var p=/up/.test(l)?-1:1;var u="translateY("+H.scale*v*p+"px)";var g="translateY("+H.scale*c*p+"px)";var m=(c-v)/($/f)*100;o.set("0.000%","transform",u);if(m<100){o.set(m.toFixed(3)+"%","transform",g)}o.set("100.000%","transform",g)}}if(i){var y=i.x1;var x=i.y1;var b=i.x2;var w=i.y2;var S=i.t1;var _=i.t2||$;var C=t.pos||{x:0,y:0};var A=[{x:y,y:x},{x:b,y:w}].map(function(t){var e=t.x;var a=t.y;return"translate("+H.scale*(e-C.x)+"px, "+H.scale*(a-C.y)+"px)"});o.setT({t1:S,t2:_,duration:$,prop:"transform",from:A[0],to:A[1]})}if(n){if(n.type==="fad"){var M=n.t1;var N=n.t2;o.set("0.000%","opacity",0);if(M<$){o.set((M/$*100).toFixed(3)+"%","opacity",1);if(M+N<$){o.set((($-N)/$*100).toFixed(3)+"%","opacity",1)}o.set("100.000%","opacity",0)}else{o.set("100.000%","opacity",$/M)}}else{var k=n.a1;var T=n.a2;var E=n.a3;var F=n.t1;var j=n.t2;var L=n.t3;var B=n.t4;var O=[F,j,L,B].map(function(t){return(t/$*100).toFixed(3)+"%"});var R=[k,T,E].map(function(t){return 1-t/255});o.set("0.000%","opacity",R[0]);if(F<$){o.set(O[0],"opacity",R[0])}if(j<$){o.set(O[1],"opacity",R[1])}if(L<$){o.set(O[2],"opacity",R[1])}if(B<$){o.set(O[3],"opacity",R[2])}o.set("100.000%","opacity",R[2])}}var z=o.toString();if(z){q(t,{animationName:"ASS-"+U()});I+=V(t.animationName,z)}s.forEach(function(C){C.fragments.forEach(function(w){if(!w.tag.t||!w.tag.t.length){return}var S=new J;var _=q({},C.tag,w.tag);Z(w.tag.t).forEach(function(t){var e=t.t1;var a=t.t2;var r=t.tag;if(r.fs){var i=H.scale*G(_.fn,_.fs)+"px";var n=H.scale*G(r.fn,_.fs)+"px";S.setT({t1:e,t2:a,duration:$,prop:"font-size",from:i,to:n})}if(r.fsp){var s=H.scale*_.fsp+"px";var o=H.scale*r.fsp+"px";S.setT({t1:e,t2:a,duration:$,prop:"letter-spacing",from:s,to:o})}var l=r.a1!==undefined&&r.a1===r.a2&&r.a2===r.a3&&r.a3===r.a4;if(r.c1||r.a1&&!l){var f=P(_.a1+_.c1);var h=P((r.a1||_.a1)+(r.c1||_.c1));S.setT({t1:e,t2:a,duration:$,prop:"color",from:f,to:h})}if(l){var v=1-parseInt(_.a1,16)/255;var c=1-parseInt(r.a1,16)/255;S.setT({t1:e,t2:a,duration:$,prop:"opacity",from:v,to:c})}var d=Y.some(function(t){return r[t]!==undefined&&r[t]!==(w.tag[t]||C.tag[t])});if(d){var p=/Yes/i.test(H.info.ScaledBorderAndShadow)?H.scale:1;var u=X(_,p);var g=X(q({},_,r),p);S.setT({t1:e,t2:a,duration:$,prop:"text-shadow",from:u,to:g})}var m=D.some(function(t){return r[t]!==undefined&&r[t]!==(w.tag[t]||C.tag[t])});if(m){var y=q({},_,r);if(w.drawing){q(y,{p:0,fscx:(r.fscx||_.fscx)/_.fscx*100,fscy:(r.fscy||_.fscy)/_.fscy*100});q(_,{fscx:100,fscy:100})}var x=W(_);var b=W(y);S.setT({t1:e,t2:a,duration:$,prop:"transform",from:x,to:b})}});var t=S.toString();q(w,{animationName:"ASS-"+U()});I+=V(w.animationName,t)})})});return I}function Q(t,e,a){var r=M.animation;return r+"animation-name:"+t+";"+r+"animation-duration:"+e+"s;"+r+"animation-delay:"+a+"s;"+r+"animation-timing-function:linear;"+r+"animation-iteration-count:1;"+r+"animation-fill-mode:forwards;"}function tt(t,e){var a=q({},e,t.tag);var r=t.drawing;var i=r.minX;var n=r.minY;var s=r.width;var o=r.height;var l=this.scale/(1<<a.p-1);var f=(a.fscx?a.fscx/100:1)*l;var h=(a.fscy?a.fscy/100:1)*l;var v=a.blur||a.be||0;var c=a.xbord+(a.xshad<0?-a.xshad:0)+v;var d=a.ybord+(a.yshad<0?-a.yshad:0)+v;var p=s*f+2*a.xbord+Math.abs(a.xshad)+2*v;var u=o*h+2*a.ybord+Math.abs(a.yshad)+2*v;var g=A("svg",[["width",p],["height",u],["viewBox",-c+" "+-d+" "+p+" "+u]]);var m=/Yes/i.test(this.info.ScaledBorderAndShadow)?this.scale:1;var y="ASS-"+U();var x=A("defs");x.appendChild(j(a,y,m));g.appendChild(x);var b="ASS-"+U();var w=A("symbol",[["id",b],["viewBox",i+" "+n+" "+s+" "+o]]);w.appendChild(A("path",[["d",t.drawing.d]]));g.appendChild(w);g.appendChild(A("use",[["width",s*f],["height",o*h],["xlink:href","#"+b],["filter","url(#"+y+")"]]));g.style.cssText="position:absolute;"+"left:"+(i*f-c)+"px;"+"top:"+(n*h-d)+"px;";return{$svg:g,cssText:"position:relative;width:"+s*f+"px;height:"+o*h+"px;"}}function et(t,e){return t.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\s/g,"&nbsp;").replace(/\\h/g,"&nbsp;").replace(/\\N/g,"<br>").replace(/\\n/g,e===2?"<br>":"&nbsp;")}function at(t){var d=this;var e=document.createElement("div");e.className="ASS-dialogue";var p=document.createDocumentFragment();var a=t.slices;var u=t.start;var g=t.end;a.forEach(function(v){var c=v.borderStyle;v.fragments.forEach(function(i){var t=i.text;var n=i.drawing;var e=i.animationName;var a=q({},v.tag,i.tag);var s="display:inline-block;";var r=d.video.currentTime;if(!n){s+='font-family:"'+a.fn+'",Arial;';s+="font-size:"+d.scale*G(a.fn,a.fs)+"px;";s+="color:"+P(a.a1+a.c1)+";";var o=/Yes/i.test(d.info.ScaledBorderAndShadow)?d.scale:1;if(c===1){s+="text-shadow:"+X(a,o)+";"}if(c===3){s+="background-color:"+P(a.a3+a.c3)+";"+"box-shadow:"+X(a,o)+";"}s+=a.b?"font-weight:"+(a.b===1?"bold":a.b)+";":"";s+=a.i?"font-style:italic;":"";s+=a.u||a.s?"text-decoration:"+(a.u?"underline":"")+" "+(a.s?"line-through":"")+";":"";s+=a.fsp?"letter-spacing:"+a.fsp+"px;":"";if(a.q===1||a.q===0||a.q===3){s+="word-break:break-all;white-space:normal;"}if(a.q===2){s+="word-break:normal;white-space:nowrap;"}}var l=D.some(function(t){return/^fsc[xy]$/.test(t)?a[t]!==100:!!a[t]});if(l){s+=M.transform+"transform:"+W(a)+";";if(!n){s+="transform-style:preserve-3d;word-break:normal;white-space:nowrap;"}}if(e){s+=Q(e,g-u,Math.min(0,u-r))}if(n&&a.pbo){var f=d.scale*-a.pbo*(a.fscy||100)/100;s+="vertical-align:"+f+"px;"}var h=/"fr[xyz]":[^0]/.test(JSON.stringify(a));et(t,a.q).split("<br>").forEach(function(t,e){var a=document.createElement("span");a.dataset.hasRotate=h;if(n){var r=tt.call(d,i,v.tag);a.style.cssText=r.cssText;a.appendChild(r.$svg)}else{if(e){p.appendChild(document.createElement("br"))}if(!t){return}a.innerHTML=t}a.style.cssText+=s;p.appendChild(a)})})});e.appendChild(p);return e}function rt(t){var e=t.layer;var a=t.margin;var o=t.width;var r=t.height;var i=t.alignment;var n=t.end;var l=this.width-(this.scale*(a.left+a.right)|0);var s=this.height;var f=this.scale*a.vertical|0;var h=this.video.currentTime*100;this._.space[e]=this._.space[e]||{left:{width:new Uint16Array(s+1),end:new Uint16Array(s+1)},center:{width:new Uint16Array(s+1),end:new Uint16Array(s+1)},right:{width:new Uint16Array(s+1),end:new Uint16Array(s+1)}};var v=this._.space[e];var c=["right","left","center"][i%3];var d=function(t){var e=v.left.width[t];var a=v.center.width[t];var r=v.right.width[t];var i=v.left.end[t];var n=v.center.end[t];var s=v.right.end[t];return c==="left"&&(i>h&&e||n>h&&a&&2*o+a>l||s>h&&r&&o+r>l)||c==="center"&&(i>h&&e&&2*e+o>l||n>h&&a||s>h&&r&&2*r+o>l)||c==="right"&&(i>h&&e&&e+o>l||n>h&&a&&2*o+a>l||s>h&&r)};var p=0;var u=0;var g=function(t){p=d(t)?0:p+1;if(p>=r){u=t;return true}return false};if(i<=3){for(var m=s-f-1;m>f;m--){if(g(m)){break}}}else if(i>=7){for(var y=f+1;y<s-f;y++){if(g(y)){break}}}else{for(var x=s-r>>1;x<s-f;x++){if(g(x)){break}}}if(i>3){u-=r-1}for(var b=u;b<u+r;b++){v[c].width[b]=o;v[c].end[b]=n*100}return u}function it(t){var e=t.effect;var a=t.move;var r=t.alignment;var i=t.width;var n=t.height;var s=t.margin;var o=t.slices;var l=0;var f=0;if(e){if(e.name==="banner"){if(r<=3){f=this.height-n-s.vertical}if(r>=4&&r<=6){f=(this.height-n)/2}if(r>=7){f=s.vertical}l=e.lefttoright?-i:this.width}}else if(t.pos||a){var h=t.pos||{x:0,y:0};if(r%3===1){l=this.scale*h.x}if(r%3===2){l=this.scale*h.x-i/2}if(r%3===0){l=this.scale*h.x-i}if(r<=3){f=this.scale*h.y-n}if(r>=4&&r<=6){f=this.scale*h.y-n/2}if(r>=7){f=this.scale*h.y}}else{if(r%3===1){l=0}if(r%3===2){l=(this.width-i)/2}if(r%3===0){l=this.width-i-this.scale*s.right}var v=o.some(function(t){return t.fragments.some(function(t){var e=t.animationName;return e})});if(v){if(r<=3){f=this.height-n-s.vertical}if(r>=4&&r<=6){f=(this.height-n)/2}if(r>=7){f=s.vertical}}else{f=rt.call(this,t)}}return{x:l,y:f}}function nt(t){var e=t.layer;var a=t.start;var r=t.end;var i=t.alignment;var n=t.effect;var s=t.pos;var o=t.margin;var l=t.animationName;var f=t.width;var h=t.height;var v=t.x;var c=t.y;var d=this.video.currentTime;var p="";if(e){p+="z-index:"+e+";"}if(l){p+=Q(l,r-a,Math.min(0,a-d))}p+="text-align:"+["right","left","center"][i%3]+";";if(!n){var u=this.width-this.scale*(o.left+o.right);p+="max-width:"+u+"px;";if(!s){if(i%3===1){p+="margin-left:"+this.scale*o.left+"px;"}if(i%3===0){p+="margin-right:"+this.scale*o.right+"px;"}if(f>this.width-this.scale*(o.left+o.right)){p+="margin-left:"+this.scale*o.left+"px;";p+="margin-right:"+this.scale*o.right+"px;"}}}p+="width:"+f+"px;height:"+h+"px;left:"+v+"px;top:"+c+"px;";return p}function st(t){var e=at.call(this,t);q(t,{$div:e});this._.$stage.appendChild(e);var a=e.getBoundingClientRect();var r=a.width;var i=a.height;q(t,{width:r,height:i});q(t,it.call(this,t));e.style.cssText=nt.call(this,t);L(t);T.call(this,t);return t}function ot(){var t=this.video.currentTime;for(var e=this._.stagings.length-1;e>=0;e--){var a=this._.stagings[e];var r=a.end;if(a.effect&&/scroll/.test(a.effect.name)){var i=a.effect;var n=i.y1;var s=i.y2;var o=i.delay;var l=((s||this._.resampledRes.height)-n)/(1e3/o);r=Math.min(r,a.start+l)}if(r<t){this._.$stage.removeChild(a.$div);if(a.$clipPath){this._.$defs.removeChild(a.$clipPath)}this._.stagings.splice(e,1)}}var f=this.dialogues;while(this._.index<f.length&&t>=f[this._.index].start){if(t<f[this._.index].end){var h=st.call(this,f[this._.index]);this._.stagings.push(h)}++this._.index}}function lt(){var t=this;var e=function(){ot.call(t);t._.requestId=a(e)};r(this._.requestId);this._.requestId=a(e);this._.$stage.classList.remove("ASS-animation-paused");return this}function ft(){r(this._.requestId);this._.requestId=0;this._.$stage.classList.add("ASS-animation-paused");return this}function ht(){while(this._.$stage.lastChild){this._.$stage.removeChild(this._.$stage.lastChild)}while(this._.$defs.lastChild){this._.$defs.removeChild(this._.$defs.lastChild)}this._.stagings=[];this._.space=[]}function vt(){var r=this.video.currentTime;var i=this.dialogues;ht.call(this);this._.index=function(){var t=0;var e=i.length-1;while(t+1<e&&r>i[e+t>>1].end){t=e+t>>1}if(!t){return 0}for(var a=t;a<e;a++){if(i[a].end>r&&r>=i[a].start||a&&i[a-1].end<r&&r<i[a].start){return a}}return e}();ot.call(this)}function ct(){var t=this._.listener;t.play=lt.bind(this);t.pause=ft.bind(this);t.seeking=vt.bind(this);this.video.addEventListener("play",t.play);this.video.addEventListener("pause",t.pause);this.video.addEventListener("seeking",t.seeking)}function dt(){var t=this._.listener;this.video.removeEventListener("play",t.play);this.video.removeEventListener("pause",t.pause);this.video.removeEventListener("seeking",t.seeking);t.play=null;t.pause=null;t.seeking=null}function pt(){var t=this.video.clientWidth;var e=this.video.clientHeight;var a=this.video.videoWidth||t;var r=this.video.videoHeight||e;var i=this._.scriptRes.width;var n=this._.scriptRes.height;var s=i;var o=n;var l=Math.min(t/a,e/r);if(this.resampling==="video_width"){o=i/a*r}if(this.resampling==="video_height"){s=n/r*a}this.scale=Math.min(t/s,e/o);if(this.resampling==="script_width"){this.scale=l*(a/s)}if(this.resampling==="script_height"){this.scale=l*(r/o)}this.width=this.scale*s;this.height=this.scale*o;this._.resampledRes={width:s,height:o};this.container.style.cssText="width:"+t+"px;height:"+e+"px;";var f="width:"+this.width+"px;"+"height:"+this.height+"px;"+"top:"+(e-this.height)/2+"px;"+"left:"+(t-this.width)/2+"px;";this._.$stage.style.cssText=f;this._.$svg.style.cssText=f;this._.$svg.setAttributeNS(null,"viewBox","0 0 "+i+" "+n);this._.$animation.innerHTML=K.call(this);vt.call(this);return this}var ut=".ASS-container,.ASS-stage{position:relative;overflow:hidden}.ASS-container video{position:absolute;top:0;left:0}.ASS-stage{pointer-events:none;position:absolute}.ASS-dialogue{font-size:0;position:absolute}.ASS-fix-font-size{position:absolute;visibility:hidden}.ASS-fix-objectBoundingBox{width:100%;height:100%;position:absolute;top:0;left:0}.ASS-animation-paused *{-webkit-animation-play-state:paused!important;animation-play-state:paused!important}";function gt(t,e,a){if(a===void 0)a={};this.scale=1;this._={index:0,stagings:[],space:[],listener:{},$svg:A("svg"),$defs:A("defs"),$stage:document.createElement("div"),$animation:document.createElement("style")};this._.$svg.appendChild(this._.$defs);this._.$stage.className="ASS-stage ASS-animation-paused";this._.resampling=a.resampling||"video_height";this.container=a.container||document.createElement("div");this.container.classList.add("ASS-container");this.container.appendChild(E);this.container.appendChild(this._.$svg);this._.hasInitContainer=!!a.container;this.video=e;ct.call(this);if(!this._.hasInitContainer){var r=!e.paused;e.parentNode.insertBefore(this.container,e);this.container.appendChild(e);if(r&&e.paused){e.play()}}this.container.appendChild(this._.$stage);var i=$(t);var n=i.info;var s=i.width;var o=i.height;var l=i.dialogues;this.info=n;this._.scriptRes={width:s||e.videoWidth,height:o||e.videoHeight};this.dialogues=l;var f=N(this.container);var h=f.querySelector("#ASS-global-style");if(!h){h=document.createElement("style");h.type="text/css";h.id="ASS-global-style";h.appendChild(document.createTextNode(ut));f.appendChild(h)}this._.$animation.type="text/css";this._.$animation.className="ASS-animation";f.appendChild(this._.$animation);pt.call(this);if(!this.video.paused){vt.call(this);lt.call(this)}return this}function mt(){this._.$stage.style.visibility="visible";return this}function yt(){this._.$stage.style.visibility="hidden";return this}function xt(){ft.call(this);ht.call(this);dt.call(this,this._.listener);var t=N(this.container);if(!this._.hasInitContainer){var e=!this.video.paused;this.container.parentNode.insertBefore(this.video,this.container);this.container.parentNode.removeChild(this.container);if(e&&this.video.paused){this.video.play()}}t.removeChild(this._.$animation);for(var a in this){if(Object.prototype.hasOwnProperty.call(this,a)){this[a]=null}}return this}var bt=/^(video|script)_(width|height)$/;function wt(){return bt.test(this._.resampling)?this._.resampling:"video_height"}function St(t){if(t===this._.resampling){return t}if(bt.test(t)){this._.resampling=t;this.resize()}return this._.resampling}var _t=function t(e,a,r){if(typeof e!=="string"){return this}return gt.call(this,e,a,r)};var Ct={resampling:{configurable:true}};_t.prototype.resize=function t(){return pt.call(this)};_t.prototype.show=function t(){return mt.call(this)};_t.prototype.hide=function t(){return yt.call(this)};_t.prototype.destroy=function t(){return xt.call(this)};Ct.resampling.get=function(){return wt.call(this)};Ct.resampling.set=function(t){return St.call(this,t)};Object.defineProperties(_t.prototype,Ct);return _t});