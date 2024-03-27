import mapboxgl from 'mapbox-gl';
import { createCustomMarkerElement } from './markerUtils.js';
import { mapboxAccessToken, unselectedMarkerIcon, selectedMarkerIcon } from './config.js';

let currentContent = null; // Track the currently open content

export function setupMarkers(map) {
    mapboxgl.accessToken = mapboxAccessToken;
    const collectionItems = document.querySelectorAll('.tur-collection-item');

    collectionItems.forEach(item => {
        const latitude = parseFloat(item.getAttribute('data-lat'));
        const longitude = parseFloat(item.getAttribute('data-lng'));
        const itemId = item.getAttribute('data-item-id');

        // Proceed if latitude and longitude are valid
        if (!isNaN(latitude) && !isNaN(longitude)) {
            const markerElement = createCustomMarkerElement(unselectedMarkerIcon);
            const marker = new mapboxgl.Marker({
                element: markerElement,
                anchor: 'bottom'
            })
            .setLngLat([longitude, latitude])
            .addTo(map);

            item.addEventListener('click', function() {
                if (currentContent && currentContent !== this) {
                    // Simulate click to close the previously opened content if it's not the current item
                    const prevItemId = currentContent.getAttribute('data-item-id');
                    const prevItemDetail = document.querySelector(`.tur-content-reveal[data-content-id="${prevItemId}"]`);
                    prevItemDetail.click();
                }

                // Find the corresponding item detail and simulate click to reveal or hide
                const itemDetail = document.querySelector(`.tur-content-reveal[data-content-id="${itemId}"]`);
                if (itemDetail) {
                    itemDetail.click();
                    currentContent = itemDetail.style.display === 'block' ? item : null;
                }

                // Update marker icon to reflect selection
                marker.getElement().style.backgroundImage = `url(${selectedMarkerIcon})`;
                // Reset other markers to unselected icon
                document.querySelectorAll('.custom-marker').forEach((elem) => {
                    if (elem !== marker.getElement()) {
                        elem.style.backgroundImage = `url(${unselectedMarkerIcon})`;
                    }
                });
            });
        }
    });
}
