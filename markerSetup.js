import mapboxgl from 'mapbox-gl';
import { createCustomMarkerElement, scrollToSelectedItem } from './markerUtils.js';
import { selectedMarkerIcon, unselectedMarkerIcon } from './config.js';

let currentlyOpenContent = null; // Track the DOM element of the currently open collection content
let currentlySelectedItem = null; // Track the currently selected collection item

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
                if (currentlySelectedItem) {
                    currentlySelectedItem.classList.remove('selected'); // Remove the selected class from previously selected item
                }
                this.classList.add('selected'); // Add the selected class to the clicked item
                currentlySelectedItem = this; // Update the reference to the currently selected item

                map.flyTo({ center: [longitude, latitude], zoom: 16 });
                scrollToSelectedItem(this);

                const collectionContent = document.querySelector(`.tur-collection-content[data-content-id="${itemId}"]`);

                if (currentlyOpenContent && currentlyOpenContent !== collectionContent) {
                    closeCollectionContent(currentlyOpenContent);
                }

                if (!collectionContent.classList.contains('expanded')) {
                    collectionContent.style.display = 'block';
                    requestAnimationFrame(() => {
                        collectionContent.classList.add('expanded');
                        collectionContent.style.height = '30vh';
                    });
                    currentlyOpenContent = collectionContent;
                } else {
                    closeCollectionContent(collectionContent);
                    currentlyOpenContent = null;
                }

                updateMarkerAppearance(collectionItems, itemId);
            });

            marker.getElement().addEventListener('click', () => {
                if (currentlySelectedItem !== item) { // Check if the clicked marker's item is not already selected
                    item.dispatchEvent(new Event('click')); // Dispatch click event on the item
                }
            });
        }
    });
}

function closeCollectionContent(content) {
    content.classList.remove('expanded');
    content.style.height = '20vh';
    setTimeout(() => {
        content.style.display = 'none';
    }, 300);
}

function updateMarkerAppearance(collectionItems, selectedItemId) {
    collectionItems.forEach(item => {
        const markerIcon = item.querySelector('.custom-marker');
        const isItemSelected = item.getAttribute('data-item-id') === selectedItemId;
        markerIcon.style.backgroundImage = `url(${isItemSelected ? selectedMarkerIcon : unselectedMarkerIcon})`;
        if (isItemSelected) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
}
