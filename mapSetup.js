import mapboxgl from 'mapbox-gl';
import { mapboxAccessToken, mapStyle, defaultCenter, defaultZoom } from './config.js';

// Define map at a higher scope so it's accessible by all functions in this module
let map;

export function initializeMap() {
    mapboxgl.accessToken = mapboxAccessToken;
    map = new mapboxgl.Map({
        container: 'turmap',
        style: mapStyle,
        center: defaultCenter,
        zoom: defaultZoom,
        pitch: 54,
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.addControl(new mapboxgl.ScaleControl({ maxWidth: 80, unit: 'metric' }));
    const geolocate = new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
        showUserLocation: true,
        showUserHeading: true,
    });

    map.on('load', () => map.addControl(geolocate));
    document.getElementById('geolocateButton').addEventListener('click', () => geolocate.trigger());

    return map;
}

export function changeMapStyle(styleUrl) {
    if (map && styleUrl) {
        map.setStyle(styleUrl);
        // Note: You may need to re-add markers or layers after changing the style
    }
}
