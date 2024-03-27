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
                    currentlyOpenContent.style.display = 'none'; // Hide it
                    currentlyOpenContent.classList.remove('expanded');
                }

                if (!collectionContent.classList.contains('expanded')) {
                    collectionContent.style.display = 'block'; // Make it visible
                    collectionContent.classList.add('expanded');
                    collectionContent.style.height = '30vh'; // Set height to 30vh for initial reveal
                } else {
                    collectionContent.classList.remove('expanded');
                    setTimeout(() => { // Use a timeout to allow the transition to finish before hiding
                        if (!collectionContent.classList.contains('expanded')) {
                            collectionContent.style.display = 'none'; // Hide after transition if collapsed
                        }
                    }, 300); // Match this timeout with your CSS transition duration
                    collectionContent.style.height = ''; // Revert to default
                }

                currentlyOpenContent = collectionContent.classList.contains('expanded') ? collectionContent : null;

                // Update marker icon for selected item
                const allMarkers = document.querySelectorAll('.custom-marker');
                allMarkers.forEach((icon, idx) => {
                    icon.style.backgroundImage = `url(${collectionItems[idx] === item ? selectedMarkerIcon : unselectedMarkerIcon})`;
                });
            });

            marker.getElement().addEventListener('click', () => {
                item.click(); // Simulate click on the collection item
            });
        }
    });
}
