import mapboxgl from 'mapbox-gl';
import { createCustomMarkerElement, toggleMarkerIcon, scrollToSelectedItem, applySelectionStyling } from './markerUtils.js';
import { selectedMarkerIcon, unselectedMarkerIcon } from './config.js';

export function setupMarkers(map) {
    const collectionItems = document.querySelectorAll('.tur-collection-item');
    let markers = [];
    let selectedCollectionItem = null; // Track the currently selected collection item for styling purposes

    collectionItems.forEach((item, index) => {
        const latitude = parseFloat(item.getAttribute('data-lat'));
        const longitude = parseFloat(item.getAttribute('data-lng'));
        const kategori = item.getAttribute('data-kategori'); // Example attribute, ensure this matches your data

        // Ensure latitude and longitude are valid before creating a marker
        if (!isNaN(latitude) && !isNaN(longitude) && kategori) {
            const markerElement = createCustomMarkerElement(unselectedMarkerIcon);
            const marker = new mapboxgl.Marker({
                element: markerElement,
                anchor: 'bottom'
            }).setLngLat([longitude, latitude]).addTo(map);

            markers.push(marker); // Add the marker to our array of markers for possible future use

            // Event listener for clicking collection items
            item.addEventListener('click', function() {
                // Center the map on the marker and zoom in
                map.flyTo({
                    center: [longitude, latitude],
                    zoom: 16
                });
                
                scrollToSelectedItem(this); // Scroll the collection item into view
                
                // Toggle marker icon to reflect selection
                markers.forEach((m, idx) => {
                    const iconUrl = idx === index ? selectedMarkerIcon : unselectedMarkerIcon;
                    m.getElement().style.backgroundImage = `url(${iconUrl})`;
                });

                // Apply styling changes to indicate selection
                if (selectedCollectionItem) {
                    selectedCollectionItem.style.borderColor = '';
                    selectedCollectionItem.style.backgroundColor = '';
                }
                this.style.borderColor = '#cc9752';
                this.style.backgroundColor = '#cc9752';
                selectedCollectionItem = this; // Update the currently selected collection item

                // Find and simulate a click on the corresponding .tur-content-reveal element
                const itemId = this.getAttribute('data-item-id');
                const itemDetail = document.querySelector(`.tur-content-reveal[data-content-id="${itemId}"]`);
                if (itemDetail) {
                    itemDetail.click(); // Trigger Webflow interaction
                }
            });

            // Event listener for clicking markers
            marker.getElement().addEventListener('click', () => {
                item.click(); // Triggers the click event on the corresponding collection item
            });
        }
    });
}
