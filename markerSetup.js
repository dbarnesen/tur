// ver 2306290324
import mapboxgl from 'mapbox-gl';
import { createCustomMarkerElement, scrollToSelectedItem } from './markerUtils.js';
import { mapStyles } from './config.js';
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
            const markerElement = createCustomMarkerElement(); // Assumes iconName is 'location_on' by default
            markerElement.setAttribute('data-item-id', itemId); // Link marker to collection item
            markerElement.className += ' unSelected'; // Initial class for unselected state
            const marker = new mapboxgl.Marker({
                element: markerElement,
                anchor: 'bottom',
            }).setLngLat([longitude, latitude]).addTo(map);

            allMarkers.push({ marker, item, category, element: markerElement, latitude, longitude });

            // Handle click on collection item
            item.addEventListener('click', function() {
                // Remove selection from previously selected item and marker
                if (currentlySelectedItem) {
                    currentlySelectedItem.classList.remove('selected');
                    const prevMarkerElement = allMarkers.find(m => m.item === currentlySelectedItem).element;
                    prevMarkerElement.classList.remove('selectedMarker');
                }

                // Add selection to the current item and marker
                this.classList.add('selected');
                const currentMarkerElement = allMarkers.find(m => m.item === this).element;
                currentMarkerElement.classList.add('selectedMarker');
                currentlySelectedItem = this;

                map.flyTo({ center: [longitude, latitude], zoom: 16, duration: 2000 });
                scrollToSelectedItem(this);
                toggleCollectionContent(document.querySelector(`.tur-collection-content[data-content-id="${itemId}"]`));
            });

            // Handle direct click on marker
            markerElement.addEventListener('click', () => {
                document.querySelector(`.tur-collection-item[data-item-id="${itemId}"]`).click();
            });
        }
    });

    document.querySelectorAll('.showmapbutton').forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-kategori');
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
