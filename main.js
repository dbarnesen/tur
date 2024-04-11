import { mapboxAccessToken } from './config.js';
import { initializeMap } from './mapSetup.js';
import { setupMarkers } from './markerSetup.js';
import initSwipeInteractions from './swipeInteractions.js';

document.addEventListener('DOMContentLoaded', () => {
    mapboxgl.accessToken = mapboxAccessToken; // Ensures mapboxgl is available globally
    const map = initializeMap();
    const markers = setupMarkers(map); // Pass map to setup markers
    initSwipeInteractions();
});
