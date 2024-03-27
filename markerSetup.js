import mapboxgl from 'mapbox-gl';
import { createCustomMarkerElement, toggleMarkerIcon, scrollToSelectedItem, applySelectionStyling } from './markerUtils.js';
import { selectedMarkerIcon, unselectedMarkerIcon } from './config.js';

let currentlyOpenContent = null; // Track currently open collection content

export function setupMarkers(map) {
    const collectionItems = document.querySelectorAll('.tur-collection-item');
    let markers = [];

    collectionItems.forEach((item, index) => {
        const latitude = parseFloat(item.getAttribute('data-lat'));
        const longitude = parseFloat(item.getAttribute('data-lng'));
        const itemId = item.getAttribute('data-item-id'); // Assuming each item has a unique ID

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
                const contentSlideCnt = document.querySelector('.tur-content-slide-cnt'); // The slide container
                const collectionContent = document.querySelector(`.tur-collection-content[data-content-id="${itemId}"]`);

                if (currentlyOpenContent && currentlyOpenContent !== collectionContent) {
                    // Close the currently open content if another item is selected
                    currentlyOpenContent.style.display = 'none';
                    currentlyOpenContent.style.height = '20vh'; // Reset size
                    contentSlideCnt.style.display = 'none'; // Hide the slide container
                }

                // Toggle the display and size of the new content and the slide container
                if (collectionContent.style.display === 'block' && currentlyOpenContent === collectionContent) {
                    collectionContent.style.display = 'none';
                    collectionContent.style.height = '20vh'; // Reset size
                    contentSlideCnt.style.display = 'none'; // Hide the slide container
                } else {
                    collectionContent.style.display = 'block';
                    collectionContent.style.height = '30vh'; // Increase size for visibility
                    contentSlideCnt.style.display = 'block'; // Show the slide container
                }

                currentlyOpenContent = collectionContent.style.display === 'block' ? collectionContent : null;

                toggleMarkerIcon(markers, index, selectedMarkerIcon, unselectedMarkerIcon);
                applySelectionStyling(item, collectionItems); // Adjust as needed to reflect the current selection
            });

            marker.getElement().addEventListener('click', () => {
                item.click(); // Triggers the click event on the corresponding collection item
            });
        }
    });
}
