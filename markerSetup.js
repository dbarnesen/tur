import mapboxgl from 'mapbox-gl';
import { createCustomMarkerElement, scrollToSelectedItem, applySelectionStyling } from './markerUtils.js';
import { selectedMarkerIcon, unselectedMarkerIcon } from './config.js';

let currentlyOpenContentId = null; // To keep track of the open content based on its ID

export function setupMarkers(map) {
    const collectionItems = document.querySelectorAll('.tur-collection-item');
    const markers = []; // Store all marker instances

    collectionItems.forEach((item, index) => {
        const latitude = parseFloat(item.getAttribute('data-lat'));
        const longitude = parseFloat(item.getAttribute('data-lng'));
        const itemId = item.getAttribute('data-item-id');

        if (!isNaN(latitude) && !isNaN(longitude)) {
            const markerElement = createCustomMarkerElement(unselectedMarkerIcon);
            const marker = new mapboxgl.Marker({
                element: markerElement,
                anchor: 'bottom'
            }).setLngLat([longitude, latitude]).addTo(map);

            markers.push(marker); // Add the new marker to the array of markers

            item.addEventListener('click', function() {
                // Handling map focus and zoom on the clicked item's location
                map.flyTo({ center: [longitude, latitude], zoom: 16 });
                scrollToSelectedItem(this);

                // Toggling the visibility and size of the corresponding content
                const contentSlideCnt = document.querySelector(`.tur-content-slide-cnt[data-content-id="${itemId}"]`);
                const collectionContent = document.querySelector(`.tur-collection-content[data-content-id="${itemId}"]`);

                // Ensuring elements are found before proceeding
                if (contentSlideCnt && collectionContent) {
                    if (currentlyOpenContentId && currentlyOpenContentId !== itemId) {
                        // Hide previously opened content and its container
                        const prevContent = document.querySelector(`.tur-collection-content[data-content-id="${currentlyOpenContentId}"]`);
                        const prevContentSlideCnt = document.querySelector(`.tur-content-slide-cnt[data-content-id="${currentlyOpenContentId}"]`);
                        if (prevContent && prevContentSlideCnt) {
                            prevContent.style.display = 'none';
                            prevContentSlideCnt.style.display = 'none';
                        }
                    }

                    // Toggle the display and size of the content and its container
                    const isContentVisible = collectionContent.style.display === 'block';
                    collectionContent.style.display = isContentVisible ? 'none' : 'block';
                    contentSlideCnt.style.display = isContentVisible ? 'none' : 'block';
                    collectionContent.style.height = isContentVisible ? '20vh' : '30vh';

                    currentlyOpenContentId = isContentVisible ? null : itemId; // Update the tracker based on visibility
                }

                // Update marker icon for the selected item and reset others
                markers.forEach((m, idx) => {
                    const iconUrl = idx === index ? selectedMarkerIcon : unselectedMarkerIcon;
                    m.getElement().style.backgroundImage = `url(${iconUrl})`;
                });

                // Apply selection styling to the clicked item
                applySelectionStyling(item);
            });

            marker.getElement().addEventListener('click', () => {
                item.click(); // Triggers the click event on the corresponding collection item
            });
        }
    });
}
