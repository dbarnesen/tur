import mapboxgl from 'mapbox-gl';
import { createCustomMarkerElement, scrollToSelectedItem } from './markerUtils.js';
import { selectedMarkerIcon, unselectedMarkerIcon, mapboxAccessToken, defaultCenter, defaultZoom } from './config.js';

// Global variables to manage state
let currentlyOpenContent = null;
let currentlySelectedItem = null;
let map;
let allMarkers = [];

// Function to initialize or update the map based on the selected tour
function initOrUpdateMap(selectedStyle, selectedCategory) {
    if (!map) {
        mapboxgl.accessToken = mapboxAccessToken;
        map = new mapboxgl.Map({
            container: 'turmap',
            style: selectedStyle,
            center: defaultCenter,
            zoom: defaultZoom,
        });

        map.on('load', () => {
            setupMarkers();
            filterMarkersAndCollectionItems(selectedCategory);
        });
    } else if (map.getStyle().styleURL !== selectedStyle) {
        // Reinitialize markers and apply filters after style is loaded for a new style
        map.setStyle(selectedStyle).on('style.load', () => {
            setupMarkers();
            filterMarkersAndCollectionItems(selectedCategory);
        });
    } else {
        // Directly apply filters if the style hasn't changed
        filterMarkersAndCollectionItems(selectedCategory);
    }
}

// Initializes markers and applies category filters
export function setupMarkers() {
    allMarkers.forEach(marker => marker.marker.remove()); // Correctly remove existing markers from the map
    allMarkers = []; // Reset the markers array

    document.querySelectorAll('.tur-collection-item').forEach(item => {
        const latitude = parseFloat(item.getAttribute('data-lat'));
        const longitude = parseFloat(item.getAttribute('data-lng'));
        const item = item.getAttribute('data-item-id');
        const category = item.getAttribute('data-kategori');

        if (!isNaN(latitude) && !isNaN(longitude)) {
            const markerElement = createCustomMarkerElement(unselectedMarkerIcon);
            const marker = new mapboxgl.Marker({ element: markerElement, anchor: 'bottom' }).setLngLat([longitude, latitude]).addTo(map);

            allMarkers.push({ marker, item, category });

            // Handle click event for collection items and markers, ensuring proper interaction
            item.addEventListener('click', () => handleClickEvent(item, latitude, longitude));
            marker.getElement().addEventListener('click', () => item.click());
        }
    });
}
function handleClickEvent(item, latitude, longitude) {
    // Update marker icons
    updateMarkerIcon(currentlySelectedItem, unselectedMarkerIcon);
    currentlySelectedItem = item;
    updateMarkerIcon(item, selectedMarkerIcon);

    // Fly to the marker's location
    map.flyTo({ center: [longitude, latitude], zoom: 16, duration: 2000 });

    // Show associated content for the collection item
    const item = item.getAttribute('data-item-id');
    const contentId = item.getAttribute('data-content-id');
    const content = document.querySelector(`.tur-collection-content[data-content-id="${contentId}"]`);
    toggleCollectionContent(content);

    // Scroll to the selected item if you have a list or panel of items
    scrollToSelectedItem(item);
}

// Function to apply category filter to markers and collection items
function filterMarkersAndCollectionItems(selectedCategory) {
    document.querySelectorAll('.tur-collection-item').forEach(item => {
        item.style.display = item.getAttribute('data-kategori') === selectedCategory ? 'block' : 'none';
    });

    allMarkers.forEach(({ marker, category }) => {
        const isVisible = category === selectedCategory;
        marker.getElement().style.display = isVisible ? 'block' : 'none';
        // Optionally adjust marker visibility or re-add to map based on visibility
    });

    // Adjust map view to fit visible markers if necessary
}

// Set up click event listeners for showmapbutton elements
document.querySelectorAll('.showmapbutton').forEach(button => {
    button.addEventListener('click', function() {
        const selectedCategory = this.getAttribute('data-kategori');
        const selectedStyle = this.getAttribute('data-mapstyle') || 'default_style';
        initOrUpdateMap(selectedStyle, selectedCategory);
    });
});

function toggleCollectionContent(item) {
    const item = item.getAttribute('data-item-id');
    const content = document.querySelector(`.tur-collection-content[data-content-id="${item}"]`);
    if (content) {
        if (!content.classList.contains('expanded')) {
            openCollectionContent(content);
        } else {
            closeCollectionContent(content);
        }
    }
}

function openCollectionContent(content) {
    content.style.display = 'block';
    setTimeout(() => {
        content.classList.add('expanded');
        content.style.height = '31vh';
    }, 10);
}

function closeCollectionContent(content) {
    content.classList.remove('expanded');
    setTimeout(() => {
        content.style.height = '0';
        setTimeout(() => content.style.display = 'none', 300);
    }, 10);
}

// Update marker icons based on item selection
function updateMarkerIcon(item, iconUrl) {
    const markerData = allMarkers.find(m => m.item === item);
    if (markerData) {
        markerData.marker.getElement().style.backgroundImage = `url(${iconUrl})`;
    } else {
        console.error("Marker element not found for the item", item);
    }
}
