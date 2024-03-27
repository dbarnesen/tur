import mapboxgl from 'mapbox-gl';
import { createCustomMarkerElement, scrollToSelectedItem, applySelectionStyling } from './markerUtils.js';
import { selectedMarkerIcon, unselectedMarkerIcon } from './config.js';

let currentlyOpenContentId = null; // Track the ID of the currently open content

export function setupMarkers(map) {
    const collectionItems = document.querySelectorAll('.tur-collection-item');
    const markers = []; // Store marker instances for easy access

    collectionItems.forEach((item) => {
        const latitude = parseFloat(item.getAttribute('data-lat'));
        const longitude = parseFloat(item.getAttribute('data-lng'));
        const itemId = item.getAttribute('data-item-id');

        if (!isNaN(latitude) && !isNaN(longitude)) {
            const markerElement = createCustomMarkerElement(unselectedMarkerIcon);
            const marker = new mapboxgl.Marker({
                element: markerElement,
                anchor: 'bottom'
            }).setLngLat([longitude, latitude]).addTo(map);

            markers.push(marker); // Add the new marker to our list

            item.addEventListener('click', function() {
                map.flyTo({ center: [longitude, latitude], zoom: 16 });
                scrollToSelectedItem(item);

                // Handling content display
                const collectionContent = document.querySelector(`.tur-collection-content[data-content-id="${itemId}"]`);
                if (collectionContent) {
                    if (currentlyOpenContentId === itemId) {
                        // If the same item is clicked again, toggle its visibility
                        collectionContent.classList.toggle('expanded');
                        currentlyOpenContentId = collectionContent.classList.contains('expanded') ? itemId : null;
                    } else {
                        // Hide previously shown content
                        if (currentlyOpenContentId !== null) {
                            const previouslyShownContent = document.querySelector(`.tur-collection-content[data-content-id="${currentlyOpenContentId}"]`);
                            previouslyShownContent.classList.remove('expanded');
                        }
                        // Show the clicked item's content
                        collectionContent.classList.add('expanded');
                        currentlyOpenContentId = itemId;
                    }
                }

                // Update markers styling
                markers.forEach((m, idx) => {
                    m.getElement().style.backgroundImage = `url(${collectionItems[idx].getAttribute('data-item-id') === itemId ? selectedMarkerIcon : unselectedMarkerIcon})`;
                });

                applySelectionStyling(item, collectionItems); // This function might need adjustment to correctly handle styling
            });

            marker.getElement().addEventListener('click', () => {
                item.click(); // Trigger click on the associated collection item
            });
        }
    });
}
