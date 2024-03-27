import mapboxgl from 'mapbox-gl';
import { createCustomMarkerElement, scrollToSelectedItem, applySelectionStyling } from './markerUtils.js';
import { unselectedMarkerIcon, selectedMarkerIcon } from './config.js';

let currentContent = null; // Track the currently open content element

export function setupMarkers(map) {
    const collectionItems = document.querySelectorAll('.tur-collection-item');

    collectionItems.forEach((item) => {
        const latitude = parseFloat(item.getAttribute('data-lat'));
        const longitude = parseFloat(item.getAttribute('data-lng'));
        const itemId = item.getAttribute('data-item-id'); // Link to the content to reveal

        if (!isNaN(latitude) && !isNaN(longitude)) {
            const markerElement = createCustomMarkerElement(unselectedMarkerIcon);
            const marker = new mapboxgl.Marker({
                element: markerElement,
                anchor: 'bottom'
            }).setLngLat([longitude, latitude]).addTo(map);

            item.addEventListener('click', function() {
                // Map centering and zooming
                map.flyTo({ center: [longitude, latitude], zoom: 15 });
                scrollToSelectedItem(this);

                // Apply selection styling
                applySelectionStyling(item, currentContent);

                // Content reveal logic
                const itemDetail = document.querySelector(`.tur-content-reveal[data-content-id="${itemId}"]`);
                if (currentContent && currentContent !== itemDetail) {
                    // Simulate click to close currently opened content
                    currentContent.style.display = 'none';
                }
                // Toggle visibility of the new content
                itemDetail.style.display = itemDetail.style.display === 'block' ? 'none' : 'block';
                currentContent = itemDetail.style.display === 'block' ? itemDetail : null;

                // Update marker icons
                marker.getElement().style.backgroundImage = `url(${selectedMarkerIcon})`;
                collectionItems.forEach((otherItem, idx) => {
                    if (otherItem !== item) {
                        const otherMarker = document.querySelector(`[data-item-id="${otherItem.getAttribute('data-item-id')}"] .custom-marker`);
                        if (otherMarker) {
                            otherMarker.style.backgroundImage = `url(${unselectedMarkerIcon})`;
                        }
                    }
                });
            });

            // Marker click triggers collection item click
            marker.getElement().addEventListener('click', () => {
                item.click();
            });
        }
    });
}
