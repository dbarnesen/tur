!function(t){"use strict";function e(t){return t&&"object"==typeof t&&"default"in t?t:{default:t}}var n=e(mapboxgl);const o="pk.eyJ1IjoiZGJhcm5lc2VuIiwiYSI6IjFWeUJFNFUifQ.CF2Du3MPcaCQhBBNJSQMDQ",a=[8.2961,59.91639],i={Trehus:"mapbox://styles/dbarnesen/ckk3vfvbi4t1v17p82fuy61pt",Urheia:"mapbox://styles/dbarnesen/ckk3vfvbi4t1v17p82fuy61pt",Barna:"mapbox://styles/dbarnesen/clu1rd21q002x01pi0udm9dds",default:"mapbox://styles/dbarnesen/cltqf5kh9001w01qu48sn3oti"};let l;function s(t="location_on"){const e=document.createElement("span");return e.className="material-symbols-outlined unSelected",e.innerHTML=t,e.style.fontSize="40px",e}let c,r=null,d=null,u=[];function m(t){c=t,document.querySelectorAll(".tur-collection-item").forEach((t=>{const e=parseFloat(t.getAttribute("data-lat")),o=parseFloat(t.getAttribute("data-lng")),a=t.getAttribute("data-item-id"),i=t.getAttribute("data-kategori");if(s().setAttribute("data-item-id",a),!isNaN(e)&&!isNaN(o)){const t=s("location_on"),l=new n.default.Marker({element:t,anchor:"bottom"}).setLngLat([o,e]).addTo(c);u.push({marker:l,item:m,category:i,element:t,latitude:e,longitude:o});const m=document.querySelector(`.tur-collection-item[data-item-id="${a}"]`);m.click(),m.addEventListener("click",(function(){if(d){d.classList.remove("selected");u.find((t=>t.item===d)).element.classList.remove("selectedMarker")}this.classList.add("selected"),d=this;var t;u.find((t=>t.item===this)).element.classList.add("selectedMarker"),c.flyTo({center:[o,e],zoom:16,duration:2e3}),function(t){t.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"})}(this),(t=document.querySelector(`.tur-collection-content[data-content-id="${a}"]`))!==r?(r&&f(r),function(t){t.style.display="block",setTimeout((()=>{t.classList.add("expanded"),t.style.height="30vh"}),10)}(t),r=t):(f(t),r=null)}))}})),document.querySelectorAll(".showmapbutton").forEach((t=>{t.addEventListener("click",(function(){const t=this.getAttribute("data-kategori");!function(t){l&&t&&l.setStyle(t)}(i[t]||i.default),function(t){document.querySelectorAll(".tur-collection-item").forEach((e=>{const n=e.getAttribute("data-kategori");e.style.display="all"===t||n===t?"":"none"}))}(t),function(t,e,n){const o=new mapboxgl.LngLatBounds;e.forEach((({marker:e,category:a,latitude:i,longitude:l})=>{const s="all"===n||a===n;e.getElement().style.visibility=s?"visible":"hidden",s?(e.addTo(t),o.extend(e.getLngLat())):e.remove()})),o.isEmpty()||t.fitBounds(o,{padding:50,maxZoom:15,pitch:54,duration:6e3})}(c,u,t)}))}))}function f(t){t.classList.remove("expanded"),setTimeout((()=>{t.style.height="0",setTimeout((()=>t.style.display="none"),300)}),10)}function y(){let t,e;const n=e=>{t=e.touches[0].clientY},o=n=>{if(!t)return;e=n.changedTouches[0].clientY;const o=e-t;Math.abs(o)>20&&(o>0?i(n.target):a(n.target),window.scrollTo(0,0),t=null)},a=t=>{const e=t.closest(".tur-collection-content");if(e){e.style.height="70vh",e.classList.add("expanded");const t=e.querySelector(".tur-tray-arrow");t&&(t.style.transform="rotateX(0deg)")}},i=t=>{const e=t.closest(".tur-collection-content");if(e){e.classList.remove("expanded"),e.style.height="21vh",setTimeout((()=>{e.classList.contains("expanded")||(e.style.display="none")}),300);const t=e.querySelector(".tur-tray-arrow");t&&(t.style.transform="rotateX(180deg)")}};var l,s;l=".tur-content-slide-cnt",s=t=>{t.addEventListener("touchstart",n),t.addEventListener("touchend",o)},document.querySelectorAll(l).forEach(s)}document.addEventListener("DOMContentLoaded",(()=>{mapboxgl.accessToken=o;m(function(){n.default.accessToken=o,l=new n.default.Map({container:"turmap",style:"mapbox://styles/dbarnesen/ckk3vfvbi4t1v17p82fuy61pt",center:a,zoom:5.5,pitch:54}),l.addControl(new n.default.NavigationControl,"top-right"),l.addControl(new n.default.ScaleControl({maxWidth:80,unit:"metric"}));const t=new n.default.GeolocateControl({positionOptions:{enableHighAccuracy:!0},trackUserLocation:!0,showUserLocation:!0,showUserHeading:!0});return l.on("load",(()=>l.addControl(t))),document.getElementById("geolocateButton").addEventListener("click",(()=>t.trigger())),l}()),y()}))}();
