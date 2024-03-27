import mapboxgl from 'mapbox-gl';
import { createCustomMarkerElement, scrollToSelectedItem } from './markerUtils.js';
import { selectedMarkerIcon, unselectedMarkerIcon } from './config.js';

let currentlyOpenContent = null; // Track currently open collection content

export function setupMarkers(map) {
    const collectionItems = document.querySelectorAll('.tur-collection-item');

    collectionItems.forEach((item) => {
        const latitude = parseFloat(item.getAttribute('data-lat'));
        const longitude = parseFloat(item.getAttribute('data-lng'));
        const itemId = item.getAttribute('data-item-id');

        if (!isNaN(latitude) && !isNaN(longitude)) {
            const markerElement = createCustomMarkerElement(unselectedMarkerIcon);
            const marker = new mapboxgl.Marker({
                element: markerElement,
                anchor: 'bottom',
            }).setLngLat([longitude, latitude]).addTo(map);

            item.addEventListener('click', function() {
                map.flyTo({ center: [longitude, latitude], zoom: 16 });
                scrollToSelectedItem(this);

                const collectionContent = document.querySelector(`.tur-collection-content[data-content-id="${itemId}"]`);
                if (currentlyOpenContent && currentlyOpenContent !== collectionContent) {
                    // Close previously open content
                    currentlyOpenContent.classList.remove('expanded');
                    currentlyOpenContent.style.height = ''; // Reset to default
                }

                if (!collectionContent.classList.contains('expanded')) {
                    collectionContent.classList.add('expanded');
                    collectionContent.style.height = '30vh'; // Explicitly set for initial open
                } else {
                    collectionContent.classList.remove('expanded');
                    collectionContent.style.height = ''; // Allow CSS to control the height
                }

                currentlyOpenContent = collectionContent.classList.contains('expanded') ? collectionContent : null;

                // Update marker icon to indicate selection
                const markerIcons = document.querySelectorAll('.custom-marker');
                markerIcons.forEach((icon, idx) => {
                    if (collectionItems[idx] === item) {
                        icon.style.backgroundImage = `url(${selectedMarkerIcon})`;
                    } else {
                        icon.style.backgroundImage = `url(${unselectedMarkerIcon})`;
                    }
                });
            });

            marker.getElement().addEventListener('click', () => {
                item.click(); // Simulate click on the collection item
            });
        }
    });
}
