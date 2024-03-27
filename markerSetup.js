import mapboxgl from 'mapbox-gl';
import { createCustomMarkerElement, scrollToSelectedItem, applySelectionStyling } from './markerUtils.js';
import { unselectedMarkerIcon, selectedMarkerIcon } from './config.js';

let selectedCollectionItem = null; // Track the currently selected collection item for styling
let currentOpenContentId = null; // Track the ID of the currently open content for toggling

export function setupMarkers(map) {
    const collectionItems = document.querySelectorAll('.tur-collection-item');

    collectionItems.forEach((item) => {
        const latitude = parseFloat(item.getAttribute('data-lat'));
        const longitude = parseFloat(item.getAttribute('data-lng'));
        const itemId = item.getAttribute('data-item-id'); // Used for linking with content to reveal

        if (!isNaN(latitude) && !isNaN(longitude)) {
            const markerElement = createCustomMarkerElement(unselectedMarkerIcon);
            const marker = new mapboxgl.Marker({
                element: markerElement,
                anchor: 'bottom'
            }).setLngLat([longitude, latitude]).addTo(map);

            // Event listener for collection item clicks
            item.addEventListener('click', function() {
                map.flyTo({ center: [longitude, latitude], zoom: 15 });
                scrollToSelectedItem(this);

                // Apply selection styling and manage previous selection
                if (selectedCollectionItem) {
                    selectedCollectionItem.classList.remove('selected');
                }
                this.classList.add('selected');
                selectedCollectionItem = this; // Update the reference to the newly selected item

                // Content reveal logic
                if (currentOpenContentId !== itemId) {
                    // Hide previously opened content, if any
                    if (currentOpenContentId) {
                        const previouslyOpenContent = document.querySelector(`.tur-content-reveal[data-content-id="${currentOpenContentId}"]`);
                        previouslyOpenContent.style.display = 'none';
                    }
                    // Reveal the content associated with the clicked item
                    const itemDetail = document.querySelector(`.tur-content-reveal[data-content-id="${itemId}"]`);
                    itemDetail.style.display = 'block';
                    currentOpenContentId = itemId; // Update the tracker
                } else {
                    // If the same item is clicked again, toggle its content visibility
                    const itemDetail = document.querySelector(`.tur-content-reveal[data-content-id="${itemId}"]`);
                    itemDetail.style.display = itemDetail.style.display === 'block' ? 'none' : 'block';
                    currentOpenContentId = itemDetail.style.display === 'block' ? itemId : null;
                }

                // Toggle marker icons
                document.querySelectorAll('.custom-marker').forEach((markerElem, idx) => {
                    markerElem.style.backgroundImage = idx === Array.from(collectionItems).indexOf(item) ? `url(${selectedMarkerIcon})` : `url(${unselectedMarkerIcon})`;
                });
            });

            // Event listener for marker clicks
            marker.getElement().addEventListener('click', () => {
                item.click(); // Simulate click on the associated collection item
            });
        }
    });
}
