import mapboxgl from 'mapbox-gl';
import { createCustomMarkerElement, scrollToSelectedItem } from './markerUtils.js';
import { selectedMarkerIcon, unselectedMarkerIcon } from './config.js';

let currentlyOpenContent = null; // Track the currently open collection content
let currentlySelectedItem = null; // Track the currently selected item for styling

export function setupMarkers(map) {
    const collectionItems = document.querySelectorAll('.tur-collection-item');

    collectionItems.forEach((item, index) => {
        const latitude = parseFloat(item.getAttribute('data-lat'));
        const longitude = parseFloat(item.getAttribute('data-lng'));
        const itemId = item.getAttribute('data-item-id');

        if (!isNaN(latitude) && !isNaN(longitude)) {
            // Create a custom marker element
            const markerElement = createCustomMarkerElement(unselectedMarkerIcon); // Ensure this function returns a DOM element
            const marker = new mapboxgl.Marker({
                element: markerElement,
                anchor: 'bottom',
            }).setLngLat([longitude, latitude]).addTo(map);

            // Handle click on collection item
            item.addEventListener('click', function() {
                // Apply or remove the selected style
                if (currentlySelectedItem) {
                    currentlySelectedItem.classList.remove('selected');
                }
                this.classList.add('selected');
                currentlySelectedItem = this;

                // Fly to and highlight the collection item
                map.flyTo({ center: [longitude, latitude], zoom: 16 });
                scrollToSelectedItem(this);

                // Toggle collection content visibility
                const collectionContent = document.querySelector(`.tur-collection-content[data-content-id="${itemId}"]`);
                if (currentlyOpenContent && currentlyOpenContent !== collectionContent) {
                    closeCollectionContent(currentlyOpenContent); // Close any currently open content
                }
                if (collectionContent !== currentlyOpenContent) {
                    openCollectionContent(collectionContent); // Open the new content
                    currentlyOpenContent = collectionContent;
                } else {
                    closeCollectionContent(collectionContent); // If the same content is clicked, close it
                    currentlyOpenContent = null;
                }
            });

            // Simulate click on the collection item when its corresponding marker is clicked
            marker.getElement().addEventListener('click', () => {
                item.click(); // This should trigger all the actions as if the item itself was clicked
            });
        }
    });
}

function closeCollectionContent(content) {
    content.classList.remove('expanded');
    content.style.height = '0'; // Start the transition to collapse
    setTimeout(() => content.style.display = 'none', 300); // Hide after transition
}

function openCollectionContent(content) {
    content.style.display = 'block';
    setTimeout(() => {
        content.classList.add('expanded');
        content.style.height = '30vh'; // Transition to open
    }, 10); // A minor delay ensures the display block takes effect
}

// Additional functions like createCustomMarkerElement, scrollToSelectedItem as defined in markerUtils.js
