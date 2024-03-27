import mapboxgl from 'mapbox-gl';
import { createCustomMarkerElement, toggleMarkerIcon, scrollToSelectedItem, applySelectionStyling } from './markerUtils.js';
import { selectedMarkerIcon, unselectedMarkerIcon } from './config.js';

let currentlyOpenContent = null; // Track currently open collection content

export function setupMarkers(map) {
    const collectionItems = document.querySelectorAll('.tur-collection-item');

    collectionItems.forEach((item, index) => {
        const latitude = parseFloat(item.getAttribute('data-lat'));
        const longitude = parseFloat(item.getAttribute('data-lng'));
        const itemId = item.getAttribute('data-item-id');

        if (!isNaN(latitude) && !isNaN(longitude)) {
            const markerElement = createCustomMarkerElement(unselectedMarkerIcon);
            const marker = new mapboxgl.Marker({
                element: markerElement,
                anchor: 'bottom'
            }).setLngLat([longitude, latitude]).addTo(map);

            item.addEventListener('click', function() {
                map.flyTo({ center: [longitude, latitude], zoom: 16 });
                scrollToSelectedItem(item);
                const collectionContent = document.querySelector(`.tur-collection-content[data-content-id="${itemId}"]`);

                if (currentlyOpenContent && currentlyOpenContent !== collectionContent) {
                    currentlyOpenContent.classList.remove('expanded');
                }

                collectionContent.classList.toggle('expanded');
                currentlyOpenContent = collectionContent.classList.contains('expanded') ? collectionContent : null;

                toggleMarkerIcon(index, selectedMarkerIcon, unselectedMarkerIcon, item);
                applySelectionStyling(item);
            });

            marker.getElement().addEventListener('click', () => {
                item.click(); // Mimics a click on the collection item
            });
        }
    });
}
