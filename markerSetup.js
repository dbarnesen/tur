import mapboxgl from 'mapbox-gl';
import { createCustomMarkerElement, scrollToSelectedItem, resetArrow, applyPressedStyle } from './markerUtils.js'; // Assuming resetArrow and applyPressedStyle are implemented
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
                handleCollectionItemClick(item, itemId, collectionItems);
            });

            marker.getElement().addEventListener('click', () => {
                applyPressedStyle(item); // Apply Webflow's pressed/focused style programmatically
                item.click(); // Simulate click on the collection item
            });
        }
    });
}

function handleCollectionItemClick(item, itemId, collectionItems) {
    map.flyTo({ center: [item.getAttribute('data-lng'), item.getAttribute('data-lat')], zoom: 16 });
    scrollToSelectedItem(item);

    const collectionContent = document.querySelector(`.tur-collection-content[data-content-id="${itemId}"]`);

    if (currentlyOpenContent && currentlyOpenContent !== collectionContent) {
        closeCollectionContent(currentlyOpenContent); // Close previously open content
    }

    if (!collectionContent.classList.contains('expanded')) {
        collectionContent.style.display = 'block'; // Make it visible
        setTimeout(() => collectionContent.style.height = '30vh', 10); // Slight delay for display:block to apply
        collectionContent.classList.add('expanded');
    } else {
        closeCollectionContent(collectionContent); // Close and hide current content
    }

    currentlyOpenContent = collectionContent.classList.contains('expanded') ? collectionContent : null;

    // Update marker icons...
    updateMarkerIcons(collectionItems, itemId);
}

function closeCollectionContent(content) {
    content.classList.remove('expanded');
    content.style.height = '20vh'; // Start collapsing
    setTimeout(() => {
        content.style.display = 'none'; // Hide after collapsing
        resetArrow(content); // Reset arrow to original position if part of your UI
    }, 300); // Match this delay with CSS transition duration
}

function updateMarkerIcons(collectionItems, selectedItemId) {
    collectionItems.forEach((item, idx) => {
        const iconUrl = item.getAttribute('data-item-id') === selectedItemId ? selectedMarkerIcon : unselectedMarkerIcon;
        document.querySelectorAll('.custom-marker')[idx].style.backgroundImage = `url(${iconUrl})`;
    });
}
