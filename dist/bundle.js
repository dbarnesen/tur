!function(t){"use strict";function e(t){return t&&"object"==typeof t&&"default"in t?t:{default:t}}var o=e(mapboxgl);const n="pk.eyJ1IjoiZGJhcm5lc2VuIiwiYSI6IjFWeUJFNFUifQ.CF2Du3MPcaCQhBBNJSQMDQ",a="https://uploads-ssl.webflow.com/5a12777c9048ed000106553e/65f40a4f33d817767e6e242e_marker_blue.svg",s=[8.2961,59.91639],l={Trehus:"mapbox://styles/dbarnesen/ckk3vfvbi4t1v17p82fuy61pt",Urheia:"mapbox://styles/dbarnesen/ckk3vfvbi4t1v17p82fuy61pt",Barna:"mapbox://styles/dbarnesen/clu1rd21q002x01pi0udm9dds",default:"mapbox://styles/dbarnesen/cltqf5kh9001w01qu48sn3oti"};let c;let i,r=null,d=null,u=[];function m(t){i=t,document.querySelectorAll(".tur-collection-item").forEach((t=>{const e=parseFloat(t.getAttribute("data-lat")),n=parseFloat(t.getAttribute("data-lng")),s=t.getAttribute("data-item-id"),l=t.getAttribute("data-kategori");if(!isNaN(e)&&!isNaN(n)){const c=function(t=a){const e=document.createElement("div");return e.className="custom-marker",e.style.backgroundImage=`url(${t})`,e.style.width="40px",e.style.height="50px",e.style.backgroundSize="cover",e}(a),m=new o.default.Marker({element:c,anchor:"bottom"}).setLngLat([n,e]).addTo(i);u.push({marker:m,item:t,category:l,element:c,latitude:e,longitude:n}),t.addEventListener("click",(function(){var t;d&&(d.classList.remove("selected"),h(d,a)),this.classList.add("selected"),d=this,h(this,"https://uploads-ssl.webflow.com/5a12777c9048ed000106553e/65f40a4f0116312d1320e108_marker_okre.svg"),i.flyTo({center:[n,e],zoom:16,duration:2e3}),function(t){t.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center",scale:"1.1",boxShadow:"1px 1px 5px gray"})}(this),(t=document.querySelector(`.tur-collection-content[data-content-id="${s}"]`))!==r?(r&&f(r),function(t){t.style.display="block",setTimeout((()=>{t.classList.add("expanded"),t.style.height="30vh"}),10)}(t),r=t):(f(t),r=null)})),m.getElement().addEventListener("click",(()=>{t.click()}))}})),document.querySelectorAll(".showmapbutton").forEach((t=>{t.addEventListener("click",(function(){const t=this.getAttribute("data-kategori");!function(t){c&&t&&c.setStyle(t)}(l[t]||l.default),function(t){document.querySelectorAll(".tur-collection-item").forEach((e=>{const o=e.getAttribute("data-kategori");e.style.display="all"===t||o===t?"":"none"}))}(t),function(t,e,o){const n=new mapboxgl.LngLatBounds;e.forEach((({marker:e,category:a,latitude:s,longitude:l})=>{const c="all"===o||a===o;e.getElement().style.visibility=c?"visible":"hidden",c?(e.addTo(t),n.extend(e.getLngLat())):e.remove()})),n.isEmpty()||t.fitBounds(n,{padding:50,maxZoom:15,pitch:54,duration:6e3})}(i,u,t)}))}))}function f(t){t.classList.remove("expanded"),setTimeout((()=>{t.style.height="0",setTimeout((()=>t.style.display="none"),300)}),10)}function h(t,e){const o=u.find((e=>e.item===t));o&&(o.element.style.backgroundImage=`url(${e})`)}function g(){let t,e;const o=e=>{t=e.touches[0].clientY},n=o=>{if(!t)return;e=o.changedTouches[0].clientY;const n=e-t;Math.abs(n)>20&&(n>0?s(o.target):a(o.target),window.scrollTo(0,0),t=null)},a=t=>{const e=t.closest(".tur-collection-content");if(e){e.style.height="70vh",e.classList.add("expanded");const t=e.querySelector(".tur-tray-arrow");t&&(t.style.transform="rotateX(0deg)")}},s=t=>{const e=t.closest(".tur-collection-content");if(e){e.classList.remove("expanded"),e.style.height="21vh",setTimeout((()=>{e.classList.contains("expanded")||(e.style.display="none")}),300);const t=e.querySelector(".tur-tray-arrow");t&&(t.style.transform="rotateX(180deg)")}};var l,c;l=".tur-content-slide-cnt",c=t=>{t.addEventListener("touchstart",o),t.addEventListener("touchend",n)},document.querySelectorAll(l).forEach(c)}document.addEventListener("DOMContentLoaded",(()=>{mapboxgl.accessToken=n;m(function(){o.default.accessToken=n,c=new o.default.Map({container:"turmap",style:"mapbox://styles/dbarnesen/ckk3vfvbi4t1v17p82fuy61pt",center:s,zoom:5.5,pitch:54}),c.addControl(new o.default.NavigationControl,"top-right"),c.addControl(new o.default.ScaleControl({maxWidth:80,unit:"metric"}));const t=new o.default.GeolocateControl({positionOptions:{enableHighAccuracy:!0},trackUserLocation:!0,showUserLocation:!0,showUserHeading:!0});return c.on("load",(()=>c.addControl(t))),document.getElementById("geolocateButton").addEventListener("click",(()=>t.trigger())),c}()),g()}))}();
