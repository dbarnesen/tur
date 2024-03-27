import mapboxgl from 'mapbox-gl';
import { createCustomMarkerElement, scrollToSelectedItem } from './markerUtils.js';
import { unselectedMarkerIcon, selectedMarkerIcon } from './config.js';

let currentContent = null; // Track the currently opened content

export function setupMarkers(map) {
    const itemSummaries = document.querySelectorAll('.tur-collection-item');

    itemSummaries.forEach((summary) => {
        const itemId = summary.getAttribute('data-item-id'); // Link to the content to reveal

        summary.addEventListener('click', function() {
            if (this === currentContent) {
                return; // Ignore the click if this is already the current content
            }

            // Find the corresponding item detail
            const itemDetail = document.querySelector(`.tur-content-reveal[data-content-id="${itemId}"]`);

            if (itemDetail) {
                // Hide the currently opened content, if any
                if (currentContent) {
                    // Assuming your Webflow interactions are tied to click events
                    currentContent.click(); // Simulate click to close
                }

                // Show the new content
                itemDetail.click(); // Simulate click to open

                // Update the currently opened content reference
                currentContent = itemDetail;
            }

            // Optional: Add any map centering logic here if needed, similar to previous examples
            const latitude = parseFloat(summary.getAttribute('data-lat'));
            const longitude = parseFloat(summary.getAttribute('data-lng'));
            if (!isNaN(latitude) && !isNaN(longitude)) {
                map.flyTo({ center: [longitude, latitude], zoom: 15 });
                scrollToSelectedItem(summary);
            }

            // Marker icon toggle logic, ensuring the correct marker is highlighted
            document.querySelectorAll('.custom-marker').forEach((elem, idx) => {
                const markerItemId = itemSummaries[idx].getAttribute('data-item-id');
                elem.style.backgroundImage = `url(${markerItemId === itemId ? selectedMarkerIcon : unselectedMarkerIcon})`;
            });
        });
    });
}
