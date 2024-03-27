import mapboxgl from 'mapbox-gl';
import { createCustomMarkerElement, toggleMarkerIcon, scrollToSelectedItem, applySelectionStyling } from './markerUtils.js';

export function setupMarkers(map) {
    const collectionItems = document.querySelectorAll('.tur-collection-item');
    let markers = [];
    let selectedCollectionItem = null;

    collectionItems.forEach((item, index) => {
        const latitude = parseFloat(item.getAttribute('data-lat'));
        const longitude = parseFloat(item.getAttribute('data-lng'));
        if (!isNaN(latitude) && !isNaN(longitude)) {
            const marker = new mapboxgl.Marker({ element: createCustomMarkerElement(), anchor: 'bottom' })
                .setLngLat([longitude, latitude])
                .addTo(map);

            markers.push(marker);

            item.addEventListener('click', () => {
                map.flyTo({ center: [longitude, latitude], zoom: 16 });
                scrollToSelectedItem(item);
                selectedCollectionItem = applySelection
