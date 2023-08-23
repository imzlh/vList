/* zip-stream.js Copyright(C)jimmywarting */
class Crc32{constructor(){this.crc=-1}append(e){for(var t=0|this.crc,r=this.table,n=0,a=0|e.length;n<a;n++)t=t>>>8^r[255&(t^e[n])];this.crc=t}get(){return~this.crc}}Crc32.prototype.table=(()=>{var e,t,r,n=[];for(e=0;e<256;e++){for(r=e,t=0;t<8;t++)r=1&r?r>>>1^3988292384:r>>>1;n[e]=r}return n})();const getDataHelper=e=>{var t=new Uint8Array(e);return{array:t,view:new DataView(t.buffer)}},pump=e=>e.reader.read().then(t=>{if(t.done)return e.writeFooter();const r=t.value;e.crc.append(r),e.uncompressedLength+=r.length,e.compressedLength+=r.length,e.ctrl.enqueue(r)});function createWriter(e){const t=Object.create(null),r=[],n=new TextEncoder;let a,i,s,o=0,c=0;function l(){(i=t[r[++c]])?u():s&&h()}var d={enqueue(e){if(s)throw new TypeError("Cannot enqueue a chunk into a readable stream that is closed or has been requested to be closed");let c=e.name.trim();const d=new Date(void 0===e.lastModified?Date.now():e.lastModified);if(e.directory&&!c.endsWith("/")&&(c+="/"),t[c])throw new Error("File already exists.");const h=n.encode(c);r.push(c);const w=t[c]={level:0,ctrl:a,directory:!!e.directory,nameBuf:h,comment:n.encode(e.comment||""),compressedLength:0,uncompressedLength:0,writeHeader(){var e=getDataHelper(26),t=getDataHelper(30+h.length);w.offset=o,w.header=e,0===w.level||w.directory||e.view.setUint16(4,2048),e.view.setUint32(0,335546376),e.view.setUint16(6,(d.getHours()<<6|d.getMinutes())<<5|d.getSeconds()/2,!0),e.view.setUint16(8,(d.getFullYear()-1980<<4|d.getMonth()+1)<<5|d.getDate(),!0),e.view.setUint16(22,h.length,!0),t.view.setUint32(0,1347093252),t.array.set(e.array,4),t.array.set(h,30),o+=t.array.length,a.enqueue(t.array)},writeFooter(){var e=getDataHelper(16);e.view.setUint32(0,1347094280),w.crc&&(w.header.view.setUint32(10,w.crc.get(),!0),w.header.view.setUint32(14,w.compressedLength,!0),w.header.view.setUint32(18,w.uncompressedLength,!0),e.view.setUint32(4,w.crc.get(),!0),e.view.setUint32(8,w.compressedLength,!0),e.view.setUint32(12,w.uncompressedLength,!0)),a.enqueue(e.array),o+=w.compressedLength+16,l()},fileLike:e};i||(i=w,u())},close(){if(s)throw new TypeError("Cannot close a readable stream that has already been requested to be closed");i||h(),s=!0}};function h(){var e,n,i=0,s=0;for(e=0;e<r.length;e++)i+=46+(n=t[r[e]]).nameBuf.length+n.comment.length;const c=getDataHelper(i+22);for(e=0;e<r.length;e++)n=t[r[e]],c.view.setUint32(s,1347092738),c.view.setUint16(s+4,5120),c.array.set(n.header.array,s+6),c.view.setUint16(s+32,n.comment.length,!0),n.directory&&c.view.setUint8(s+38,16),c.view.setUint32(s+42,n.offset,!0),c.array.set(n.nameBuf,s+46),c.array.set(n.comment,s+46+n.nameBuf.length),s+=46+n.nameBuf.length+n.comment.length;c.view.setUint32(s,1347093766),c.view.setUint16(s+8,r.length,!0),c.view.setUint16(s+10,r.length,!0),c.view.setUint32(s+12,i,!0),c.view.setUint32(s+16,o,!0),a.enqueue(c.array),a.close()}function u(){if(i)return i.directory?i.writeFooter(i.writeHeader()):i.reader?pump(i):void(i.fileLike.stream?(i.crc=new Crc32,i.reader=i.fileLike.stream().getReader(),i.writeHeader()):l())}return new ReadableStream({start:t=>{a=t,e.start&&Promise.resolve(e.start(d))},pull:()=>u()||e.pull&&Promise.resolve(e.pull(d))})}window.ZIP=createWriter;
((e,t)=>{"undefined"!=typeof module?module.exports=t():"function"==typeof define&&"object"==typeof define.amd?define(t):this.streamSaver=t()})(0,()=>{"use strict";let e=null,t=!1;const a=window.WebStreamsPolyfill||{},r=window.isSecureContext;let n=/constructor/i.test(window.HTMLElement)||!!window.safari;const o=r||"MozAppearance"in document.documentElement.style?"iframe":"navigate",s={createWriteStream:function(a,l,d){let m={size:null,pathname:null,writableStrategy:void 0,readableStrategy:void 0};Number.isFinite(l)?([d,l]=[l,d],console.warn("[StreamSaver] Depricated pass an object as 2nd argument when creating a write stream"),m.size=d,m.writableStrategy=l):l&&l.highWaterMark?(console.warn("[StreamSaver] Depricated pass an object as 2nd argument when creating a write stream"),m.size=d,m.writableStrategy=l):m=l||{};if(!n){e||(e=r?i(s.mitm):function(e){const t=document.createDocumentFragment(),a={frame:window.open(e,"popup","width=200,height=100"),loaded:!1,isIframe:!1,isPopup:!0,remove(){a.frame.close()},addEventListener(...e){t.addEventListener(...e)},dispatchEvent(...e){t.dispatchEvent(...e)},removeEventListener(...e){t.removeEventListener(...e)},postMessage(...e){a.frame.postMessage(...e)}},r=e=>{e.source===a.frame&&(a.loaded=!0,window.removeEventListener("message",r),a.dispatchEvent(new Event("load")))};return window.addEventListener("message",r),a}(s.mitm));var c=0,p=null,w=new MessageChannel;a=encodeURIComponent(a.replace(/\//g,":")).replace(/['()]/g,escape).replace(/\*/g,"%2A");const n={transferringReadable:t,pathname:m.pathname||Math.random().toString().slice(-6)+"/"+a,headers:{"Content-Type":"application/octet-stream; charset=utf-8","Content-Disposition":"attachment; filename*=UTF-8''"+a}};m.size&&(n.headers["Content-Length"]=m.size);const l=[n,"*",[w.port2]];if(t){const e="iframe"===o?void 0:{transform(e,t){c+=e.length,t.enqueue(e),p&&(location.href=p,p=null)},flush(){p&&(location.href=p)}};var u=new s.TransformStream(e,m.writableStrategy,m.readableStrategy);const t=u.readable;w.port1.postMessage({readableStream:t},[t])}w.port1.onmessage=(t=>{t.data.download&&("navigate"===o?(e.remove(),e=null,c?location.href=t.data.download:p=t.data.download):(e.isPopup&&(e.remove(),"iframe"===o&&i(s.mitm)),i(t.data.download)))}),e.loaded?e.postMessage(...l):e.addEventListener("load",()=>{e.postMessage(...l)},{once:!0})}let f=[];return!n&&u&&u.writable||new s.WritableStream({write(e){n?f.push(e):(w.port1.postMessage(e),c+=e.length,p&&(location.href=p,p=null))},close(){if(n){const e=new Blob(f,{type:"application/octet-stream; charset=utf-8"}),t=document.createElement("a");t.href=URL.createObjectURL(e),t.download=a,t.click()}else w.port1.postMessage("end")},abort(){f=[],w.port1.postMessage("abort"),w.port1.onmessage=null,w.port1.close(),w.port2.close(),w=null}},m.writableStrategy)},WritableStream:window.WritableStream||a.WritableStream,supported:!0,version:{full:"2.0.0",major:2,minor:0,dot:0},mitm:window.packer_mitm||"https://jimmywarting.github.io/StreamSaver.js/mitm.html"};function i(e){if(!e)throw new Error("meh");const t=document.createElement("iframe");return t.hidden=!0,t.src=e,t.loaded=!1,t.name="iframe",t.isIframe=!0,t.postMessage=((...e)=>t.contentWindow.postMessage(...e)),t.addEventListener("load",()=>{t.loaded=!0},{once:!0}),document.body.appendChild(t),t}try{new Response(new ReadableStream),!r||"serviceWorker"in navigator||(n=!0)}catch(e){n=!0}return(e=>{try{e()}catch(e){}})(()=>{const{readable:e}=new TransformStream,a=new MessageChannel;a.port1.postMessage(e,[e]),a.port1.close(),a.port2.close(),t=!0,Object.defineProperty(s,"TransformStream",{configurable:!1,writable:!1,value:TransformStream})}),s});