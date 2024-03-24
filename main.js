import { mapboxAccessToken, defaultCenter, defaultZoom } from './config.js';
import { initializeMap } from './mapSetup.js';
import { setupMarkers } from './markerSetup.js';

mapboxgl.accessToken = mapboxAccessToken;

document.addEventListener('DOMContentLoaded', () => {
  // Initialize the map
  const map = initializeMap();

  // Setup markers on the map
  setupMarkers(map);

  // Call any additional setup functions as needed
  // For example, if you had functions to setup user interactions, call them here
});