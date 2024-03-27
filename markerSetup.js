import mapboxgl from 'mapbox-gl';
import { createCustomMarkerElement, scrollToSelectedItem, applySelectionStyling } from './markerUtils.js';
import { selectedMarkerIcon, unselectedMarkerIcon } from './config.js';

let currentlyOpenContent = null; // Track currently open collection content

export function setupMarkers(map) {
    const collectionItems = document.querySelectorAll('.tur-collection-item');
    const markers = []; // Initialize an empty array to keep track of markers

    collectionItems.forEach((item, index) => {
        const latitude = parseFloat(item.getAttribute('data-lat'));
        const longitude = parseFloat(item.getAttribute('data-lng'));
        const itemId = item.getAttribute('data-item-id'); // Assuming each item has a unique ID

        if (!isNaN(latitude) && !isNaN(longitude)) {
            const markerElement = createCustomMarkerElement(unselectedMarkerIcon);
            const marker = new mapboxgl.Marker({
                element: markerElement,
                anchor: 'bottom',
            }).setLngLat([longitude, latitude]).addTo(map);

            markers.push(marker); // Add the new marker to the markers array

            item.addEventListener('click', function() {
                map.flyTo({ center: [longitude, latitude], zoom: 16 });
                scrollToSelectedItem(item);
                const collectionContent = document.querySelector(`.tur-collection-content[data-content-id="${itemId}"]`);

                // Toggle content display logic corrected
                if (currentlyOpenContent !== collectionContent) {
                    if (currentlyOpenContent) {
                        currentlyOpenContent.classList.remove('expanded'); // Collapse previously expanded content
                    }
                    collectionContent.classList.add('expanded'); // Expand new content
                    currentlyOpenContent = collectionContent; // Update tracking variable
                } else if (collectionContent.classList.contains('expanded')) {
                    collectionContent.classList.remove('expanded'); // Toggle off if the same item is clicked
                    currentlyOpenContent = null;
                }

                // Apply marker styling changes
                markers.forEach((m, idx) => {
                    const iconUrl = idx === index ? selectedMarkerIcon : unselectedMarkerIcon;
                    m.getElement().style.backgroundImage = `url(${iconUrl})`;
                });

                applySelectionStyling(item); // Adjust as needed to reflect the current selection
            });

            marker.getElement().addEventListener('click', () => {
                item.click(); // Mimics a click on the collection item
            });
        }
    });
}
