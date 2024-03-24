// markerSetup.js
import mapboxgl from 'mapbox-gl';
import { createCustomMarkerElement, toggleMarkerIcon, scrollToSelectedItem, applySelectionStyling } from './markerUtils.js';
import { unselectedMarkerIcon, selectedMarkerIcon } from './config.js';

// This assumes you're passing the map instance when calling setupMarkers
export function setupMarkers(map) {
    // Example setup using a fictional data source
    const collectionItems = document.querySelectorAll('.tur-collection-item');
    let selectedCollectionItem = null; // Track the currently selected collection item
    let markers = []; // Store marker instances

    collectionItems.forEach((item, index) => {
        const latitude = parseFloat(item.getAttribute('data-lat'));
        const longitude = parseFloat(item.getAttribute('data-lng'));
        const kategori = item.getAttribute('data-kategori'); // Example attribute

        if (!isNaN(latitude) && !isNaN(longitude) && kategori) {
            // Create a marker using the custom marker element
            const markerElement = createCustomMarkerElement(unselectedMarkerIcon);
            const marker = new mapboxgl.Marker({
                element: markerElement,
                anchor: 'bottom'
            }).setLngLat([longitude, latitude]).addTo(map);

            markers.push(marker); // Add the marker to our array of markers

            // Event listener for when a collection item is clicked
            item.addEventListener('click', function() {
                // Center the map on the marker and zoom in
                map.flyTo({
                    center: [longitude, latitude],
                    zoom: 15
                });

                // Scroll the selected collection item into view
                scrollToSelectedItem(item);

                // Toggle the marker icon to indicate selection
                toggleMarkerIcon(index, markers, selectedMarkerIcon, unselectedMarkerIcon);

                // Apply selection styling to the item
                applySelectionStyling(item, selectedCollectionItem);

                // Update the currently selected collection item
                selectedCollectionItem = item;
            });
        }
    });
}
