import mapboxgl from 'mapbox-gl';
import { createCustomMarkerElement, scrollToSelectedItem } from './markerUtils.js';
import { selectedMarkerIcon, unselectedMarkerIcon } from './config.js';

let currentlyOpenContent = null; // Track the DOM element of the currently open collection content

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

                // Close the previously open content if it is not the current one being opened.
                if (currentlyOpenContent && currentlyOpenContent !== collectionContent) {
                    closeCollectionContent(currentlyOpenContent);
                }

                // If the current item's content is not already expanded, expand it.
                if (!collectionContent.classList.contains('expanded')) {
                    collectionContent.style.display = 'block'; // Make it visible
                    requestAnimationFrame(() => {
                        collectionContent.classList.add('expanded');
                        collectionContent.style.height = '30vh'; // Set initial open height
                    });
                    currentlyOpenContent = collectionContent; // Update the reference to the currently open content
                } else {
                    // If the current item's content is already open, close it.
                    closeCollectionContent(collectionContent);
                    currentlyOpenContent = null;
                }

                // Update the appearance of all markers to reflect the current selection.
                updateMarkerAppearance(collectionItems, item, markerElement);
            });

            marker.getElement().addEventListener('click', () => {
                item.click(); // Trigger the click event on the associated collection item.
            });
        }
    });
}

function closeCollectionContent(content) {
    content.classList.remove('expanded');
    content.style.height = '20vh'; // Begin closing the content
    setTimeout(() => {
        content.style.display = 'none'; // Fully hide the content after the transition
    }, 300); // Ensure this duration matches your CSS transition
}

function updateMarkerAppearance(collectionItems, selectedItem, selectedMarkerElement) {
    collectionItems.forEach((item, idx) => {
        const iconUrl = item === selectedItem ? selectedMarkerIcon : unselectedMarkerIcon;
        document.querySelectorAll('.custom-marker')[idx].style.backgroundImage = `url(${iconUrl})`;
    });
}
