!function(t){"use strict";function e(t){return t&&"object"==typeof t&&"default"in t?t:{default:t}}var o=e(mapboxgl);const n="pk.eyJ1IjoiZGJhcm5lc2VuIiwiYSI6IjFWeUJFNFUifQ.CF2Du3MPcaCQhBBNJSQMDQ",a="https://uploads-ssl.webflow.com/5a12777c9048ed000106553e/65f40a4f33d817767e6e242e_marker_blue.svg",c=[8.2961,59.91639];let l,s=null,i=null,r=[];function d(t){l=t,document.querySelectorAll(".tur-collection-item").forEach((t=>{const e=parseFloat(t.getAttribute("data-lat")),n=parseFloat(t.getAttribute("data-lng"));t.getAttribute("data-item-id");const c=t.getAttribute("data-kategori");if(!isNaN(e)&&!isNaN(n)){const d=function(t=a){const e=document.createElement("div");return e.className="custom-marker",e.style.backgroundImage=`url(${t})`,e.style.width="40px",e.style.height="50px",e.style.backgroundSize="cover",e}(a),g=new o.default.Marker({element:d,anchor:"bottom"}).setLngLat([n,e]).addTo(l);r.push({marker:g,item:t,category:c,element:d,latitude:e,longitude:n}),t.addEventListener("click",(function(){var t;i&&(i.classList.remove("selected"),m(i,a)),this.classList.add("selected"),i=this,m(this,"https://uploads-ssl.webflow.com/5a12777c9048ed000106553e/65f40a4f0116312d1320e108_marker_okre.svg"),l.flyTo({center:[n,e],zoom:16,duration:2e3}),function(t){t.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"})}(this),(t=document.querySelector(`.tur-collection-content[data-content-id="${contentId}"]`))!==s?(s&&u(s),function(t){t.style.display="block",setTimeout((()=>{t.classList.add("expanded"),t.style.height="30vh"}),10)}(t),s=t):(u(t),s=null)})),g.getElement().addEventListener("click",(()=>{t.click()}))}})),document.querySelectorAll(".showmapbutton").forEach((t=>{t.addEventListener("click",(function(){const t=this.getAttribute("data-kategori");!function(t){document.querySelectorAll(".tur-collection-item").forEach((e=>{const o=e.getAttribute("data-kategori");e.style.display="all"===t||o===t?"":"none"}))}(t),function(t){const e=new o.default.LngLatBounds;r.forEach((({marker:o,category:n,latitude:a,longitude:c})=>{const s="all"===t||n===t;o.getElement().style.visibility=s?"visible":"hidden",s?(o.addTo(l),e.extend(o.getLngLat())):o.remove()})),e.isEmpty()||l.fitBounds(e,{padding:50,maxZoom:15,duration:6e3})}(t)}))}))}function u(t){t.classList.remove("expanded"),setTimeout((()=>{t.style.height="0",setTimeout((()=>t.style.display="none"),300)}),10)}function m(t,e){const o=r.find((e=>e.item===t));o&&(o.element.style.backgroundImage=`url(${e})`)}function g(){let t,e;const o=e=>{t=e.touches[0].clientY},n=o=>{if(!t)return;e=o.changedTouches[0].clientY;const n=e-t;Math.abs(n)>20&&(n>0?c(o.target):a(o.target),window.scrollTo(0,0),t=null)},a=t=>{const e=t.closest(".tur-collection-content");if(e){e.style.height="70vh",e.classList.add("expanded");const t=e.querySelector(".tur-tray-arrow");t&&(t.style.transform="rotateX(0deg)")}},c=t=>{const e=t.closest(".tur-collection-content");if(e){e.classList.remove("expanded"),e.style.height="20vh",setTimeout((()=>{e.classList.contains("expanded")||(e.style.display="none")}),300);const t=e.querySelector(".tur-tray-arrow");t&&(t.style.transform="rotateX(180deg)")}};var l,s;l=".tur-content-slide-cnt",s=t=>{t.addEventListener("touchstart",o),t.addEventListener("touchend",n)},document.querySelectorAll(l).forEach(s)}document.addEventListener("DOMContentLoaded",(()=>{mapboxgl.accessToken=n;d(function(){o.default.accessToken=n;const t=new o.default.Map({container:"turmap",style:"mapbox://styles/dbarnesen/ckk3vfvbi4t1v17p82fuy61pt",center:c,zoom:5.5,pitch:54});t.addControl(new o.default.NavigationControl,"top-right"),t.addControl(new o.default.ScaleControl({maxWidth:80,unit:"metric"}));const e=new o.default.GeolocateControl({positionOptions:{enableHighAccuracy:!0},trackUserLocation:!0,showUserLocation:!0,showUserHeading:!0});return t.on("load",(()=>t.addControl(e))),document.getElementById("geolocateButton").addEventListener("click",(()=>e.trigger())),t}()),g()}))}();
