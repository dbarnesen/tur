import mapboxgl from 'mapbox-gl';
import { createCustomMarkerElement, toggleMarkerIcon, scrollToSelectedItem, applySelectionStyling } from './markerUtils.js';
import { selectedMarkerIcon, unselectedMarkerIcon } from './config.js';

let currentlyOpenContent = null; // Track the content that is currently open

export function setupMarkers(map) {
    const collectionItems = document.querySelectorAll('.tur-collection-item');
    let markers = [];

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

            markers.push(marker);

            item.addEventListener('click', function() {
                map.flyTo({ center: [longitude, latitude], zoom: 16 });
                scrollToSelectedItem(item);

                // This assumes each .tur-collection-item has an associated .tur-content-slide-cnt
                const contentSlideCnt = document.querySelector(`.tur-content-slide-cnt[data-content-id="${itemId}"]`); // Find the specific .tur-content-slide-cnt for this item
                const collectionContent = document.querySelector(`.tur-collection-content[data-content-id="${itemId}"]`);

                // Toggle logic for content and slide container visibility
                if (currentlyOpenContent && currentlyOpenContent !== collectionContent) {
                    currentlyOpenContent.parentElement.style.display = 'none'; // Hide parent .tur-content-slide-cnt of previously open content
                    currentlyOpenContent.style.height = '20vh'; // Reset size
                }

                if (collectionContent.style.display === 'block') {
                    collectionContent.style.display = 'none';
                    collectionContent.style.height = '20vh';
                    contentSlideCnt.style.display = 'none'; // Additionally hide the slide container
                } else {
                    collectionContent.style.display = 'block';
                    collectionContent.style.height = '30vh';
                    contentSlideCnt.style.display = 'block'; // Show the specific slide container
                }

                currentlyOpenContent = collectionContent.style.display === 'block' ? collectionContent : null;

                toggleMarkerIcon(markers, index, selectedMarkerIcon, unselectedMarkerIcon);
                applySelectionStyling(item, collectionItems);
            });

            marker.getElement().addEventListener('click', () => {
                item.click();
            });
        }
    });
}
