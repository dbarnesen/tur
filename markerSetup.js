import mapboxgl from 'mapbox-gl';
import { createCustomMarkerElement, toggleMarkerIcon, scrollToSelectedItem, applySelectionStyling } from './markerUtils.js';
import { selectedMarkerIcon, unselectedMarkerIcon } from './config.js';

let currentlyOpenContent = null; // Track the content that is currently open

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
                anchor: 'bottom'
            }).setLngLat([longitude, latitude]).addTo(map);

            item.addEventListener('click', function() {
                map.flyTo({ center: [longitude, latitude], zoom: 16 });
                scrollToSelectedItem(item);

                const contentSlideCnt = document.querySelector(`.tur-content-slide-cnt[data-content-id="${itemId}"]`);
                const collectionContent = document.querySelector(`.tur-collection-content[data-content-id="${itemId}"]`);

                // Ensure both elements exist before attempting to modify their styles
                if (contentSlideCnt && collectionContent) {
                    if (currentlyOpenContent && currentlyOpenContent !== collectionContent) {
                        // Assuming the previously opened content is within a content slide container
                        const prevContentSlideCnt = currentlyOpenContent.closest('.tur-content-slide-cnt');
                        if (prevContentSlideCnt) {
                            prevContentSlideCnt.style.display = 'none'; // Hide the slide container of the previously open content
                        }
                        currentlyOpenContent.style.height = '20vh'; // Reset size of previously open content
                    }

                    // Toggle the display and size of the new content and its slide container
                    if (collectionContent.style.display === 'block') {
                        collectionContent.style.display = 'none';
                        collectionContent.style.height = '20vh';
                        contentSlideCnt.style.display = 'none';
                    } else {
                        collectionContent.style.display = 'block';
                        collectionContent.style.height = '30vh';
                        contentSlideCnt.style.display = 'block'; // Ensure the specific slide container is shown
                    }

                    currentlyOpenContent = collectionContent.style.display === 'block' ? collectionContent : null;
                }

                toggleMarkerIcon(markers, selectedMarkerIcon, unselectedMarkerIcon, item);
                applySelectionStyling(item);
            });
        }
    });
}
