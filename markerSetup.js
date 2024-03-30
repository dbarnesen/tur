//ver 2306290324
import mapboxgl from 'mapbox-gl';
import { createCustomMarkerElement, scrollToSelectedItem } from './markerUtils.js';
import { mapStyles, selectedMarkerIcon, unselectedMarkerIcon } from './config.js';
import { filterCollectionItems, filterMarkersAndAdjustMapView } from './markerFilter.js';
import { changeMapStyle } from './mapSetup.js';

let currentlyOpenContent = null;
let currentlySelectedItem = null;
let allMarkers = [];
let map;

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
                currentlySelectedItem.classList.remove('selected'); // Remove 'selected' from the previously selected item
                // Also, remove 'selected' from the previously selected marker if needed
                const prevMarkerElement = allMarkers.find(m => m.item === currentlySelectedItem).element;
                prevMarkerElement.classList.remove('selectedMarker');
                }
                this.classList.add('selected');
                currentlySelectedItem = this;

                const markerElement = allMarkers.find(m => m.item === this).element;
                markerElement.classList.add('selectedMarker');

                map.flyTo({ center: [longitude, latitude], zoom: 16, duration: 2000 });
                scrollToSelectedItem(this);
                toggleCollectionContent(document.querySelector(`.tur-collection-content[data-content-id="${itemId}"]`));
            });
        }
    });

    document.querySelectorAll('.showmapbutton').forEach(button => {
    button.addEventListener('click', function() {
        const filterValue = this.getAttribute('data-kategori');
        // Correctly use filterValue to get the style URL
        const styleUrl = mapStyles[filterValue] || mapStyles.default; // Use filterValue here
        changeMapStyle(styleUrl); // Assuming changeMapStyle function is correctly defined/imported to change the map's style
        filterCollectionItems(filterValue);
        filterMarkersAndAdjustMapView(map, allMarkers, filterValue);
    });
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
