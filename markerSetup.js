import mapboxgl from 'mapbox-gl';
import { createCustomMarkerElement, scrollToSelectedItem } from './markerUtils.js';
import { selectedMarkerIcon, unselectedMarkerIcon } from './config.js';

let currentlyOpenContent = null; // Track the currently open collection content
let currentlySelectedItem = null; // Track the currently selected item for styling
let allMarkers = []; // Keep track of all markers for updating their icons

export function setupMarkers(map) {
    const collectionItems = document.querySelectorAll('.tur-collection-item');

    collectionItems.forEach((item, index) => {
        const latitude = parseFloat(item.getAttribute('data-lat'));
        const longitude = parseFloat(item.getAttribute('data-lng'));
        const itemId = item.getAttribute('data-item-id');

        if (!isNaN(latitude) && !isNaN(longitude)) {
            const markerElement = createCustomMarkerElement(unselectedMarkerIcon); // Ensure this function returns a DOM element
            const marker = new mapboxgl.Marker({
                element: markerElement,
                anchor: 'bottom',
            }).setLngLat([longitude, latitude]).addTo(map);

            allMarkers.push({ marker, item }); // Store markers with their associated items

            item.addEventListener('click', function() {
                if (currentlySelectedItem) {
                    currentlySelectedItem.classList.remove('selected');
                    updateMarkerIcon(currentlySelectedItem, unselectedMarkerIcon); // Reset previous marker icon
                }
                this.classList.add('selected');
                currentlySelectedItem = this;

                map.flyTo({ center: [longitude, latitude], zoom: 16 });
                scrollToSelectedItem(this);

                const collectionContent = document.querySelector(`.tur-collection-content[data-content-id="${itemId}"]`);
                toggleCollectionContent(collectionContent, item);

                updateMarkerIcon(this, selectedMarkerIcon); // Update current marker icon
            });

            marker.getElement().addEventListener('click', () => {
                // Ensure the click on the marker triggers the Webflow interaction by simulating a click on the item
                if (currentlySelectedItem !== item) {
                    item.dispatchEvent(new Event('click', { bubbles: true })); // The bubbles option ensures the event bubbles up through the DOM
                }
            });
        }
    });
}

function toggleCollectionContent(content, item) {
    if (currentlyOpenContent && currentlyOpenContent !== content) {
        closeCollectionContent(currentlyOpenContent);
    }

    if (content !== currentlyOpenContent) {
        openCollectionContent(content);
        currentlyOpenContent = content;
    } else {
        closeCollectionContent(content);
        currentlyOpenContent = null;
    }
}

function closeCollectionContent(content) {
    content.classList.remove('expanded');
    content.style.height = '0';
    setTimeout(() => content.style.display = 'none', 300);
}

function openCollectionContent(content) {
    content.style.display = 'block';
    setTimeout(() => {
        content.classList.add('expanded');
        content.style.height = '30vh';
    }, 10); // Minor delay to ensure the transition is smooth
}

function updateMarkerIcon(item, iconUrl) {
    // Find the marker associated with the item and update its icon
    const markerData = allMarkers.find(m => m.item === item);
    if (markerData) {
        markerData.marker.getElement().style.backgroundImage = `url(${iconUrl})`;
    }
}

// Ensure createCustomMarkerElement() and scrollToSelectedItem() are correctly defined in your markerUtils.js.
