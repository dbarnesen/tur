import mapboxgl from 'mapbox-gl';
import { createCustomMarkerElement, scrollToSelectedItem } from './markerUtils.js';
import { selectedMarkerIcon, unselectedMarkerIcon, mapboxAccessToken, defaultCenter, defaultZoom } from './config.js';

// Global variables to track state
let currentlyOpenContent = null;
let currentlySelectedItem = null;
let map = null;
let allMarkers = [];

// Initialize or update the map and markers based on selected tour
function initOrUpdateMap(selectedStyle, selectedCategory) {
    // Setup map only if it doesn't exist
    if (!map) {
        mapboxgl.accessToken = mapboxAccessToken;
        map = new mapboxgl.Map({
            container: 'turmap',
            style: selectedStyle,
            center: defaultCenter,
            zoom: defaultZoom
        });
        
        map.on('load', function() {
            setupMarkers();
            filterMarkersAndCollectionItems(selectedCategory);
        });
    } else {
        // If map exists but new style is selected, update the style
        if (map.getStyle().styleURL !== selectedStyle) {
            map.setStyle(selectedStyle).on('style.load', function() {
                // Reinitialize markers and apply filters after style is loaded
                setupMarkers();
                filterMarkersAndCollectionItems(selectedCategory);
            });
        } else {
            // Apply filters directly if style hasn't changed
            filterMarkersAndCollectionItems(selectedCategory);
        }
    }
}

// Function to setup markers initially or after map style change
export function setupMarkers() {
    // Remove any existing markers first
    allMarkers.forEach(marker => marker.remove());
    allMarkers = [];

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

            allMarkers.push({ marker, item, category });

            // Add click event listener for each collection item
            item.addEventListener('click', function() {
                if (currentlySelectedItem) {
                    currentlySelectedItem.classList.remove('selected');
                    updateMarkerIcon(currentlySelectedItem, unselectedMarkerIcon);
                }
                this.classList.add('selected');
                currentlySelectedItem = this;
                updateMarkerIcon(this, selectedMarkerIcon);
                map.flyTo({ center: [longitude, latitude], zoom: 16, duration: 2000 });
                scrollToSelectedItem(item);
                // Additional logic for handling item selection
                toggleCollectionContent(document.querySelector(`.tur-collection-content[data-content-id="${itemId}"]`));
            });

            // Add click event listener for marker
            marker.getElement().addEventListener('click', function() {
                item.click(); // Trigger collection item click
            });
        }
    });
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

// Event listener setup for showmapbutton clicks
document.querySelectorAll('.showmapbutton').forEach(button => {
    button.addEventListener('click', function() {
        const selectedCategory = this.getAttribute('data-kategori');
        const selectedStyle = this.getAttribute('data-mapstyle') || 'default_style';
        initOrUpdateMap(selectedStyle, selectedCategory);
    });
});

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
    if (!markerData) {
        console.error("Marker data not found for the item", item);
        return;
    }
    if (!markerData.element || !markerData.element.style) {
        console.error("Marker element or style property is undefined", markerData);
        return;
    }
    markerData.element.style.backgroundImage = `url(${iconUrl})`;
}
