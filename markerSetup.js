import mapboxgl from 'mapbox-gl';
import { createCustomMarkerElement, scrollToSelectedItem } from './markerUtils.js';
import { selectedMarkerIcon, unselectedMarkerIcon } from './config.js';

let currentlyOpenContent = null; // Track the DOM element of the currently open collection content
let currentlySelectedItem = null; // Track the DOM element of the currently selected collection item

export function setupMarkers(map) {
    const collectionItems = document.querySelectorAll('.tur-collection-item');

    collectionItems.forEach((item) => {
        const latitude = parseFloat(item.getAttribute('data-lat'));
        const longitude = parseFloat(item.getAttribute('data-lng'));
        const itemId = item.getAttribute('data-item-id');

        if (!isNaN(latitude) && !isNaN(longitude)) {
            // Create a marker for each collection item
            const markerElement = createCustomMarkerElement(unselectedMarkerIcon);
            const marker = new mapboxgl.Marker({
                element: markerElement,
                anchor: 'bottom',
            }).setLngLat([longitude, latitude]).addTo(map);

            // Event listener for collection item clicks
            item.addEventListener('click', function() {
                handleCollectionItemClick(this, itemId, collectionItems, map);
            });

            // Simulate collection item click when its marker is clicked
            marker.getElement().addEventListener('click', () => {
                item.dispatchEvent(new Event('click', {bubbles: true})); // Ensure the event bubbles up to trigger the listener on `item`
            });
        }
    });
}

function handleCollectionItemClick(item, itemId, collectionItems, map) {
    // Fly the map to the clicked item's location
    map.flyTo({ center: [parseFloat(item.getAttribute('data-lng')), parseFloat(item.getAttribute('data-lat'))], zoom: 16 });
    scrollToSelectedItem(item);

    // Close any previously open content
    if (currentlyOpenContent) {
        currentlyOpenContent.style.display = 'none';
        currentlyOpenContent.classList.remove('expanded');
    }

    // Handle opening or closing the clicked item's content
    const collectionContent = document.querySelector(`.tur-collection-content[data-content-id="${itemId}"]`);
    if (currentlyOpenContent !== collectionContent) {
        collectionContent.style.display = 'block';
        collectionContent.classList.add('expanded');
        collectionContent.style.height = '30vh'; // Open to initial height
        currentlyOpenContent = collectionContent; // Update the currently open content
    } else {
        collectionContent.classList.remove('expanded');
        collectionContent.style.height = '20vh'; // Collapse content
        setTimeout(() => collectionContent.style.display = 'none', 300); // Hide after animation
        currentlyOpenContent = null;
    }

    // Update selection visual feedback
    if (currentlySelectedItem) {
        currentlySelectedItem.classList.remove('selected'); // Remove selection from previously selected item
    }
    item.classList.add('selected'); // Highlight the newly selected item
    currentlySelectedItem = item;

    // Update marker icons to reflect the current selection
    updateMarkerIcons(collectionItems, item);
}

function updateMarkerIcons(collectionItems, selectedItem) {
    collectionItems.forEach((item) => {
        const markerIcon = item.querySelector('.custom-marker');
        if (markerIcon) {
            const isSelected = item === selectedItem;
            const iconUrl = isSelected ? selectedMarkerIcon : unselectedMarkerIcon;
            markerIcon.style.backgroundImage = `url(${iconUrl})`;
        }
    });
}
