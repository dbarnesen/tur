import { mapboxAccessToken } from './config.js';
import { initializeMap } from './mapSetup.js';
import { setupMarkers } from './markerSetup.js';
import { setupSwipeInteractions } from './swipeInteractions.js';

document.addEventListener('DOMContentLoaded', () => {
    mapboxgl.accessToken = mapboxAccessToken; // Ensures mapboxgl is available globally
    const map = initializeMap();
    const markers = setupMarkers(map); // Pass map to setup markers
    setupSwipeInteractions();

    // Additional setup for filtering and content reveal based on interactions with markers
    // would go here, leveraging the markers array and other configurations as needed.
});
