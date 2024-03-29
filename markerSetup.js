import mapboxgl from 'mapbox-gl';
import { createCustomMarkerElement, scrollToSelectedItem } from './markerUtils.js';
import { selectedMarkerIcon, unselectedMarkerIcon, mapboxAccessToken, defaultCenter, defaultZoom } from './config.js';

let currentlyOpenContent = null;
let currentlySelectedItem = null;
let allMarkers = [];
let map = null; // Initially null to defer map initialization

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.showmapbutton').forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-kategori');
            const mapStyle = this.getAttribute('data-mapstyle') || 'mapbox://styles/mapbox/streets-v11'; // Default style

            if (!map) {
                // Initialize map if it hasn't been already
                mapboxgl.accessToken = mapboxAccessToken;
                map = new mapboxgl.Map({
                    container: 'turmap',
                    style: mapStyle,
                    center: defaultCenter, // Default center from your config.js
                    zoom: defaultZoom // Default zoom from your config.js
                });

                map.on('load', () => {
                    setupMarkers(map); // Setup markers after map is loaded
                    filterMarkersAndAdjustMapView(filterValue); // Apply the initial filter
                });
            } else if (map.getStyle().styleURL !== mapStyle) {
                // Handle map style change
                map.setStyle(mapStyle).on('style.load', () => {
                    reinitializeMarkers(); // Reinitialize markers for the new style
                    filterMarkersAndAdjustMapView(filterValue); // Reapply filter
                });
            } else {
                filterMarkersAndAdjustMapView(filterValue); // Just reapply filter if style hasn't changed
            }
        });
    });
});

export function setupMarkers(initialMap) {
    map = initialMap;
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

            allMarkers.push({ marker, item, category, element: markerElement, latitude, longitude });

            item.addEventListener('click', function() {
                if (currentlySelectedItem) {
                    currentlySelectedItem.classList.remove('selected');
                    updateMarkerIcon(currentlySelectedItem, unselectedMarkerIcon);
                }
                this.classList.add('selected');
                currentlySelectedItem = this;
                updateMarkerIcon(this, selectedMarkerIcon);
                map.flyTo({ center: [longitude, latitude], zoom: 16, duration: 1000 });
                scrollToSelectedItem(this);

                toggleCollectionContent(document.querySelector(`.tur-collection-content[data-content-id="${itemId}"]`));
            });

            marker.getElement().addEventListener('click', () => {
                item.click(); // Simulate click on the collection item
            });
        }
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
        content.style.height = '32vh';
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

function filterCollectionItems(filterValue) {
    document.querySelectorAll('.tur-collection-item').forEach(item => {
        const itemCategory = item.getAttribute('data-kategori');
        item.style.display = (filterValue === 'all' || itemCategory === filterValue) ? '' : 'none';
    });
}

function filterMarkersAndAdjustMapView(filterValue) {
    const bounds = new mapboxgl.LngLatBounds();
    allMarkers.forEach(({ marker, category, latitude, longitude }) => {
        const isVisible = filterValue === 'all' || category === filterValue;
        marker.getElement().style.visibility = isVisible ? 'visible' : 'hidden';
        if (isVisible) {
            marker.addTo(map);
            bounds.extend(marker.getLngLat());
        } else {
            marker.remove();
        }
    });

    if (!bounds.isEmpty()) {
        map.fitBounds(bounds, { padding: 50, maxZoom: 15, duration: 5000 });
    }
}
