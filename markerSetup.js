import mapboxgl from 'mapbox-gl';
import { createCustomMarkerElement, toggleMarkerIcon, scrollToSelectedItem, applySelectionStyling } from './markerUtils.js';
import { selectedMarkerIcon, unselectedMarkerIcon } from './config.js';

export function setupMarkers(map) {
    const collectionItems = document.querySelectorAll('.tur-collection-item');
    let markers = [];
    let selectedCollectionItem = null;

    collectionItems.forEach((item, index) => {
        const latitude = parseFloat(item.getAttribute('data-lat'));
        const longitude = parseFloat(item.getAttribute('data-lng'));
        const kategori = item.getAttribute('data-kategori'); // Example attribute

        if (!isNaN(latitude) && !isNaN(longitude) && kategori) {
            const markerElement = createCustomMarkerElement(unselectedMarkerIcon);
            const marker = new mapboxgl.Marker({
                element: markerElement,
                anchor: 'bottom'
            }).setLngLat([longitude, latitude]).addTo(map);

            markers.push(marker);

            item.addEventListener('click', function() {
                map.flyTo({
                    center: [longitude, latitude],
                    zoom: 16
                });
                scrollToSelectedItem(item);
                selectedCollectionItem = applySelectionStyling(item, selectedCollectionItem);
                toggleMarkerIcon(markers, index, selectedMarkerIcon, unselectedMarkerIcon);
            });

            marker.getElement().addEventListener('click', function() {
                item.click(); // Triggers the click event on the corresponding collection item
            });
        }
    });

    return markers; // Return markers for potential further use
}
