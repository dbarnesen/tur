import mapboxgl from 'mapbox-gl';
import { mapboxAccessToken, mapStyle, defaultCenter, defaultZoom } from './config.js';

export function initializeMap() {
    mapboxgl.accessToken = mapboxAccessToken;
    const map = new mapboxgl.Map({
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
