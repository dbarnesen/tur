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

                // Adjusting logic for opening/closing and setting height
                if (!collectionContent.classList.contains('expanded')) {
                    collectionContent.style.display = 'block'; // Make it visible
                    setTimeout(() => collectionContent.style.height = '30vh', 10); // Slight delay for smooth transition
                    collectionContent.classList.add('expanded');
                    currentlyOpenContent = collectionContent;
                } else {
                    collectionContent.classList.remove('expanded');
                    collectionContent.style.height = '20vh';
                    setTimeout(() => {
                        collectionContent.style.display = 'none';
                    }, 300); // Match this delay with your CSS transition time
                    currentlyOpenContent = null;
                }

                // Update marker icon logic
                const allMarkers = document.querySelectorAll('.custom-marker');
                allMarkers.forEach((icon, idx) => {
                    icon.style.backgroundImage = `url(${collectionItems[idx] === item ? selectedMarkerIcon : unselectedMarkerIcon})`;
                });
            });

            marker.getElement().addEventListener('click', () => {
                item.click(); // Mimic click on the collection item
            });
        }
    });
}
