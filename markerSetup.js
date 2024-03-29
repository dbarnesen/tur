import mapboxgl from 'mapbox-gl';
import { createCustomMarkerElement, scrollToSelectedItem } from './markerUtils.js';
import { selectedMarkerIcon, unselectedMarkerIcon, mapboxAccessToken, defaultCenter, defaultZoom } from './config.js';

let currentlyOpenContent = null;
let currentlySelectedItem = null;
let allMarkers = [];
let map;

export function setupMap() {
    document.querySelectorAll('.showmapbutton').forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-kategori');
            const mapStyle = this.getAttribute('data-mapstyle');

            // Initialize the map if it's not already created
            if (!map) {
                console.log("Initializing map with style:", mapStyle);
                mapboxgl.accessToken = mapboxAccessToken;
                map = new mapboxgl.Map({
                    container: 'turmap',
                    style: mapStyle,
                    center: defaultCenter,
                    zoom: defaultZoom
                });

                map.on('load', () => {
                    setupMarkers();
                    applyFilters(filterValue);
                });
            } else if (map.getStyle().styleURL !== mapStyle) {
                console.log("Changing map style from", map.getStyle().styleURL, "to", mapStyle);
                // If map exists but style needs to change
                map.setStyle(mapStyle).on('style.load', () => {
                    setupMarkers(); // Re-setup markers for the new style
                    applyFilters(filterValue);
                });
            } else {
                // If map and style are already set
                applyFilters(filterValue);
            }
        });
    });
}

export function setupMarkers() {

    allMarkers.forEach(marker => marker.remove()); // Remove existing markers
    allMarkers = []; // Clear the markers array

    document.querySelectorAll('.tur-collection-item').forEach(item => {
        const latitude = parseFloat(item.getAttribute('data-lat'));
        const longitude = parseFloat(item.getAttribute('data-lng'));
        const itemId = item.getAttribute('data-item-id');
        const category = item.getAttribute('data-kategori');

        if (!isNaN(latitude) && !isNaN(longitude)) {
            const markerElement = createCustomMarkerElement(unselectedMarkerIcon);
            const marker = new mapboxgl.Marker({
                element: markerElement,
                anchor: 'bottom',
            }).setLngLat([longitude, latitude]).addTo(map);

            allMarkers.push({ marker, item, category, element: markerElement });
 console.log(`Adding marker at [${longitude}, ${latitude}] with category ${category}`);
            item.onclick = () => {
                if (currentlySelectedItem) {
                    currentlySelectedItem.classList.remove('selected');
                    updateMarkerIcon(currentlySelectedItem, unselectedMarkerIcon);
                }
                item.classList.add('selected');
                currentlySelectedItem = item;
                updateMarkerIcon(item, selectedMarkerIcon);
                map.flyTo({ center: [longitude, latitude], zoom: 16, duration: 1000 });
                scrollToSelectedItem(item);
                toggleCollectionContent(document.querySelector(`.tur-collection-content[data-content-id="${itemId}"]`));
            };

            marker.getElement().onclick = () => {
                item.click();
            };
        }
    });
}

function applyFilters(filterValue) {
    document.querySelectorAll('.tur-collection-item').forEach(item => {
        const itemCategory = item.getAttribute('data-kategori');
        item.style.display = (filterValue === 'all' || itemCategory === filterValue) ? '' : 'none';
        console.log(`Filtering collection items with category: ${filterValue}`);

    });
}

function filterMarkersAndAdjustMapView(filterValue) {
    const bounds = new mapboxgl.LngLatBounds();
    allMarkers.forEach(({ marker, category, latitude, longitude }) => {
        marker.getElement().style.visibility = isVisible ? 'visible' : 'hidden';
        if (isVisible) {
            marker.addTo(map);
            bounds.extend(marker.getLngLat());
        } else {
            marker.remove();
        }
        console.log(`Setting marker visibility to ${isVisible ? 'visible' : 'hidden'} for category ${category}`);
    });
}
function toggleCollectionContent(content) {
    if (content !== currentlyOpenContent) {
        if (currentlyOpenContent) {
            closeCollectionContent(currentlyOpenContent);
        }
        openCollectionContent(content);
        currentlyOpenContent = content;
    } else {
        closeCollectionContent(content);
        currentlyOpenContent = null;
    }
}

function openCollectionContent(content) {
    content.style.display = 'block';
    setTimeout(() => {
        content.classList.add('expanded');
        content.style.height = '30vh';
    }, 10);
}

function closeCollectionContent(content) {
    content.classList.remove('expanded');
    setTimeout(() => {
        content.style.height = '0';
        setTimeout(() => content.style.display = 'none', 300);
    }, 10);
}

function updateMarkerIcon(item, iconUrl) {
    const markerData = allMarkers.find(m => m.item === item);
    if (markerData) {
        markerData.element.style.backgroundImage = `url(${iconUrl})`;
    }
}
