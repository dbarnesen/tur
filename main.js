import { mapboxAccessToken, defaultCenter, defaultZoom } from './config.js';
import { initializeMap } from './mapSetup.js';
import { setupMarkers } from './markerSetup.js';
import { setupSwipeInteractions } from './swipeInteractions.js';

document.addEventListener('DOMContentLoaded', () => {
    const map = initializeMap();
    setupMarkers(map);
    setupSwipeInteractions();
});

mapboxgl.accessToken = mapboxAccessToken;
