import mapboxgl from 'mapbox-gl';
import { createCustomMarkerElement, scrollToSelectedItem } from './markerUtils.js';
import { unselectedMarkerIcon, selectedMarkerIcon, mapboxAccessToken } from './config.js';

// Keep track of the currently selected collection item for styling purposes
let selectedCollectionItem = null;

export function setupMarkers(map) {
    const collectionItems = document.querySelectorAll('.tur-collection-item');
    collectionItems.forEach((item, index) => {
        const latitude = parseFloat(item.getAttribute('data-lat'));
        const longitude = parseFloat(item.getAttribute('data-lng'));
        const kategori = item.getAttribute('data-kategori');
        const itemId = item.getAttribute('data-item-id');

        if (!isNaN(latitude) && !isNaN(longitude) && kategori) {
            const markerElement = createCustomMarkerElement(unselectedMarkerIcon);
            const marker = new mapboxgl.Marker({
                element: markerElement,
                anchor: 'bottom'
            }).setLngLat([longitude, latitude]).addTo(map);

            // Click event for collection items
            item.addEventListener('click', function() {
                map.flyTo({ center: [longitude, latitude], zoom: 15 });
                scrollToSelectedItem(this);

                // Apply and manage selection styling
                if (selectedCollectionItem) {
                    selectedCollectionItem.classList.remove('selected');
                }
                this.classList.add('selected');
                selectedCollectionItem = this; // Update the currently selected collection item
                
                // Close currently open content
                if (currentOpenContentId && currentOpenContentId !== itemId) {
                    const currentlyOpenContent = document.querySelector(`.tur-content-reveal[data-content-id="${currentOpenContentId}"]`);
                    currentlyOpenContent.style.display = 'none'; // Hide previous content
                }

                // Find and display the new content, toggle if the same item is clicked
                const itemDetail = document.querySelector(`.tur-content-reveal[data-content-id="${itemId}"]`);
                itemDetail.style.display = itemDetail.style.display === 'block' ? 'none' : 'block';
                currentOpenContentId = itemDetail.style.display === 'block' ? itemId : null;

                // Toggle marker icons
                marker.getElement().style.backgroundImage = `url(${selectedMarkerIcon})`;
                document.querySelectorAll('.custom-marker').forEach((elem, idx) => {
                    if (idx !== index) {
                        elem.style.backgroundImage = `url(${unselectedMarkerIcon})`;
                    }
                });
            });

            // Click event for markers
            marker.getElement().addEventListener('click', () => {
                item.click(); // Simulates clicking the associated collection item
            });
        }
    });
}
