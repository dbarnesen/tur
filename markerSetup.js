import mapboxgl from 'mapbox-gl';
import { createCustomMarkerElement, scrollToSelectedItem } from './markerUtils.js';
import { selectedMarkerIcon, unselectedMarkerIcon } from './config.js';

let currentlyOpenContent = null; // Track the DOM element of the currently open collection content
let currentlySelectedItem = null; // Track the DOM element of the currently selected collection item
let markers = []; // Array to keep track of all markers

export function setupMarkers(map) {
    const collectionItems = document.querySelectorAll('.tur-collection-item');

    collectionItems.forEach((item, index) => {
        const latitude = parseFloat(item.getAttribute('data-lat'));
        const longitude = parseFloat(item.getAttribute('data-lng'));
        const itemId = item.getAttribute('data-item-id');

        if (!isNaN(latitude) && !isNaN(longitude)) {
            const markerElement = createCustomMarkerElement(unselectedMarkerIcon); // This function needs to return a DOM element for the marker
            const marker = new mapboxgl.Marker({
                element: markerElement,
                anchor: 'bottom',
            }).setLngLat([longitude, latitude]).addTo(map);

            markers.push({ id: itemId, marker: marker, element: markerElement }); // Store marker with associated item ID

            item.addEventListener('click', function() {
                if (currentlySelectedItem !== this) {
                    // Remove 'selected' class from previously selected item and reset its marker
                    if (currentlySelectedItem) {
                        currentlySelectedItem.classList.remove('selected');
                        const previousMarkerData = markers.find(m => m.id === currentlySelectedItem.getAttribute('data-item-id'));
                        if (previousMarkerData) {
                            previousMarkerData.element.style.backgroundImage = `url(${unselectedMarkerIcon})`;
                        }
                    }

                    // Add 'selected' class to the new item and update its marker
                    this.classList.add('selected');
                    const currentMarkerData = markers.find(m => m.id === itemId);
                    if (currentMarkerData) {
                        currentMarkerData.element.style.backgroundImage = `url(${selectedMarkerIcon})`;
                    }
                    currentlySelectedItem = this;
                }

                // Logic to handle collection content visibility and transitions
                handleCollectionContent(this, itemId);
            });

            marker.getElement().addEventListener('click', () => {
                item.click(); // Simulate click on the associated collection item
            });
        }
    });
}

function handleCollectionContent(item, itemId) {
    const collectionContent = document.querySelector(`.tur-collection-content[data-content-id="${itemId}"]`);
    if (currentlyOpenContent && currentlyOpenContent !== collectionContent) {
        // Close the previously open content
        currentlyOpenContent.classList.remove('expanded');
        currentlyOpenContent.style.height = '0';
        setTimeout(() => {
            currentlyOpenContent.style.display = 'none';
        }, 300); // Match the CSS transition time
    }

    // Open or close the current item's content
    if (!collectionContent.classList.contains('expanded')) {
        collectionContent.style.display = 'block';
        requestAnimationFrame(() => {
            collectionContent.classList.add('expanded');
            collectionContent.style.height = '30vh'; // Adjust as needed
        });
        currentlyOpenContent = collectionContent;
    } else {
        collectionContent.classList.remove('expanded');
        collectionContent.style.height = '0';
        setTimeout(() => {
            collectionContent.style.display = 'none';
        }, 300); // Match the CSS transition time
        currentlyOpenContent = null;
    }

    scrollToSelectedItem(item); // Ensure the item is scrolled into view
}

// Don't forget to implement createCustomMarkerElement() in markerUtils.js to return a correctly styled DOM element for each marker.
