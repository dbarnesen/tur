import mapboxgl from 'mapbox-gl';
import { createCustomMarkerElement, scrollToSelectedItem } from './markerUtils.js';
import { selectedMarkerIcon, unselectedMarkerIcon, mapboxAccessToken, defaultCenter, defaultZoom } from './config.js';

let map;
let allMarkers = [];

// Initializes or updates the map based on selected tour
function initOrUpdateMap(mapStyle, center, zoom) {
    if (!map) {
        console.log("Initializing map for the first time with style:", mapStyle);
        mapboxgl.accessToken = mapboxAccessToken;
        map = new mapboxgl.Map({
            container: 'turmap',
            style: mapStyle,
            center: defaultCenter,
            zoom: defaultZoom
        });
        map.on('load', () => {
            setupMarkers();
        });
    } else if (map.getStyle().styleURL !== mapStyle) {
        console.log("Updating map style to:", mapStyle);
        map.setStyle(mapStyle).on('style.load', () => {
            setupMarkers(); // Re-setup markers after style change
        });
    }
}

// Setup markers and apply event listeners to collection items and markers
export function setupMarkers() {
    console.log("Setting up markers...");
    allMarkers.forEach(marker => marker.remove()); // Clear existing markers
    allMarkers = []; // Reset markers array

    document.querySelectorAll('.tur-collection-item').forEach(item => {
        const latitude = parseFloat(item.getAttribute('data-lat'));
        const longitude = parseFloat(item.getAttribute('data-lg'));
        const category = item.getAttribute('data-kategori');

        if (!isNaN(latitude) && !isNaN(longitude)) {
            const markerElement = createCustomMarkerElement(unselectedMarkerIcon);
            const marker = new mapboxgl.Marker({
                element: markerElement,
                anchor: 'bottom',
            }).setLngLat([longitude, latitude]).addTo(map);

            allMarkers.push({ marker, category, item });

            item.addEventListener('click', () => {
                console.log(`Collection item clicked, category: ${category}`);
                if (scrollToSelectedItem) scrollToSelectedItem(item);
                toggleCollectionContent(item);
            });

            marker.getElement().addEventListener('click', () => {
                console.log("Marker clicked, simulating item click.");
                item.click();
            });
        }
    });
}

// Toggle visibility and expansion of collection content
function toggleCollectionContent(selectedItem) {
    console.log(`Toggling collection content for: ${selectedItem.getAttribute('data-item-id')}`);
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

// Apply filters to collection items and markers based on 'data-kategori'
document.querySelectorAll('.showmapbutton').forEach(button => {
    button.addEventListener('click', function() {
        const category = this.getAttribute('data-kategori');
        const mapStyle = this.getAttribute('data-mapstyle') || 'default_map_style';
        console.log(`Showmapbutton clicked, category: ${category}, mapStyle: ${mapStyle}`);

        initOrUpdateMap(mapStyle, defaultCenter, defaultZoom);
        applyFilters(category);
    });
});

function applyFilters(category) {
    console.log(`Applying filters for category: ${category}`);
    // Filter collection items
    document.querySelectorAll('.tur-collection-item').forEach(item => {
        item.style.display = item.getAttribute('data-kategori') === category ? 'block' : 'none';
    });

    // Filter markers and adjust map view
    filterMarkersAndAdjustMapView(category);
}

function filterMarkersAndAdjustMapView(category) {
    console.log(`Filtering markers for category: ${category}`);
    const bounds = new mapboxgl.LngLatBounds();
    allMarkers.forEach(({ marker, item }) => {
        const isVisible = item.getAttribute('data-kategori') === category;
        marker.getElement().style.visibility = isVisible ? 'visible' : 'hidden';
        if (isVisible) {
            marker.addTo(map);
            bounds.extend(marker.getLngLat());
        } else {
            marker.remove();
        }
    });

    if (!bounds.isEmpty()) {
        console.log("Adjusting map view to fit markers.");
        map.fitBounds(bounds, { padding: 50, duration: 5000 });
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
