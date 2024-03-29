import mapboxgl from 'mapbox-gl';
import { createCustomMarkerElement, scrollToSelectedItem } from './markerUtils.js';
import { selectedMarkerIcon, unselectedMarkerIcon, mapboxAccessToken, defaultCenter, defaultZoom } from './config.js';

let map;
let allMarkers = [];

// Function to initialize or update the map based on a selected tour
function initOrUpdateMap(mapStyle, center, zoom) {
    if (!map) {
        mapboxgl.accessToken = mapboxAccessToken;
        map = new mapboxgl.Map({
            container: 'turmap',
            style: mapStyle,
            center: center,
            zoom: zoom
        });
        map.on('load', () => {
            setupMarkers();
        });
    } else {
        map.setStyle(mapStyle);
    }
}

// Function to setup markers
function setupMarkers() {
    document.querySelectorAll('.tur-collection-item').forEach(item => {
        const latitude = parseFloat(item.getAttribute('data-lat'));
        const longitude = parseFloat(item.getAttribute('data-lng'));
        const category = item.getAttribute('data-kategori');

        if (!isNaN(latitude) && !isNaN(longitude)) {
            const markerElement = createCustomMarkerElement(unselectedMarkerIcon);
            const marker = new mapboxgl.Marker({
                element: markerElement,
                anchor: 'bottom',
            }).setLngLat([longitude, latitude]).addTo(map);

            allMarkers.push({ marker, category, item });

            // Click event for each collection item
            item.addEventListener('click', () => {
                map.flyTo({ center: [longitude, latitude], zoom: 16, duration: 2000 });
                scrollToSelectedItem(item);
                toggleCollectionItem(item);
            });

            marker.getElement().addEventListener('click', () => {
                item.click();
            });
        }
    });
}

// Handle collection item toggling
function toggleCollectionItem(selectedItem) {
    const contentId = selectedItem.getAttribute('data-content-id');
    const content = document.querySelector(`.tur-collection-content[data-content-id="${contentId}"]`);
    const isExpanded = content.classList.contains('expanded');

    // Close any open items
    document.querySelectorAll('.tur-collection-content.expanded').forEach(el => {
        el.classList.remove('expanded');
        el.style.height = '0';
        setTimeout(() => el.style.display = 'none', 300);
    });

    if (!isExpanded) {
        content.style.display = 'block';
        setTimeout(() => {
            content.classList.add('expanded');
            content.style.height = '30vh';
        }, 10);
    }
}

// Apply filters based on 'data-kategori'
document.querySelectorAll('.showmapbutton').forEach(button => {
    button.addEventListener('click', function() {
        const mapStyle = this.getAttribute('data-mapstyle') || 'default_map_style';
        const category = this.getAttribute('data-kategori');

        initOrUpdateMap(mapStyle, defaultCenter, defaultZoom);
        applyFilters(category);
    });
});

function applyFilters(category) {
    // Filter collection items
    document.querySelectorAll('.tur-collection-item').forEach(item => {
        item.style.display = item.getAttribute('data-kategori') === category || category === 'all' ? 'block' : 'none';
    });

    // Filter markers
    allMarkers.forEach(({ marker, item }) => {
        if (item.getAttribute('data-kategori') === category || category === 'all') {
            if (!marker.getMap()) {
                marker.addTo(map); // Add marker to map if it's not already added
            }
        } else {
            marker.remove(); // Remove marker from map
        }
    });

    adjustMapViewToFitMarkers();
}

function adjustMapViewToFitMarkers() {
    const bounds = new mapboxgl.LngLatBounds();
    allMarkers.forEach(({ marker, item }) => {
        if (item.getAttribute('data-kategori') === category && item.style.display !== 'none') {
            bounds.extend(marker.getLngLat());
        }
    });

    if (!bounds.isEmpty()) {
        map.fitBounds(bounds, { padding: 50, duration: 5000 });
    }
}
export { setupMarkers };
