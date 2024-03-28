import mapboxgl from 'mapbox-gl';
import { createCustomMarkerElement, scrollToSelectedItem } from './markerUtils.js';
import { selectedMarkerIcon, unselectedMarkerIcon } from './config.js';

let currentlyOpenContent = null;
let currentlySelectedItem = null;
let allMarkers = [];
let map;

export function setupMarkers(initialMap) {
    map = initialMap;
    document.querySelectorAll('.tur-collection-item').forEach(item => {
        const latitude = parseFloat(item.getAttribute('data-lat'));
        const longitude = parseFloat(item.getAttribute('data-lng'));
        const itemId = item.getAttribute('data-item-id');
        const category = item.getAttribute('data-kategori');

        if (!isNaN(latitude) && !isNaN(longitude)) {
            const markerElement = createCustomMarkerElement(unselectedMarkerIcon);
            markerElement.setAttribute('data-category', category); // Store category in marker element for filtering
            const marker = new mapboxgl.Marker({
                element: markerElement,
                anchor: 'bottom',
            }).setLngLat([longitude, latitude]).addTo(map);

            allMarkers.push({ marker, item, category, element: markerElement });

            item.addEventListener('click', function() {
                if (currentlySelectedItem) {
                    currentlySelectedItem.classList.remove('selected');
                    updateMarkerIcon(currentlySelectedItem, unselectedMarkerIcon);
                }
                this.classList.add('selected');
                currentlySelectedItem = this;
                updateMarkerIcon(this, selectedMarkerIcon);
                map.flyTo({ center: [longitude, latitude], zoom: 16, duration: 2000 });
                scrollToSelectedItem(this);

                toggleCollectionContent(document.querySelector(`.tur-collection-content[data-content-id="${itemId}"]`));
            });

            marker.getElement().addEventListener('click', () => {
                item.click(); // Simulate click on the collection item
            });
        }
    });

    setupShowMapButtonListeners();
}

function setupShowMapButtonListeners() {
    document.querySelectorAll('.showmapbutton').forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-kategori');
            const newMapStyle = this.getAttribute('data-mapstyle');
            if (newMapStyle && map.getStyle().styleURL !== newMapStyle) {
                map.setStyle(newMapStyle);
                map.on('style.load', () => {
                    reAddMarkersToMap(filterValue);
                });
            } else {
                filterCollectionItems(filterValue);
                filterMarkersAndAdjustMapView(filterValue);
            }
        });
    });
}

// Re-add markers to the map after a style change
function reAddMarkersToMap(filterValue) {
    allMarkers.forEach(({ marker, category, element, latitude, longitude }) => {
        element.style.visibility = filterValue === 'all' || filterValue === category ? 'visible' : 'hidden';
        if (filterValue === 'all' || filterValue === category) {
            marker.setLngLat([longitude, latitude]).addTo(map);
        }
    });
    filterMarkersAndAdjustMapView(filterValue); // Refilter markers after they are added back to map
}

// Remaining functions (toggleCollectionContent, openCollectionContent, closeCollectionContent, updateMarkerIcon) remain unchanged

function filterCollectionItems(filterValue) {
    document.querySelectorAll('.tur-collection-item').forEach(item => {
        const itemCategory = item.getAttribute('data-kategori');
        item.style.display = (filterValue === 'all' || itemCategory === filterValue) ? '' : 'none';
    });
}

function filterMarkersAndAdjustMapView(filterValue) {
    const bounds = new mapboxgl.LngLatBounds();
    allMarkers.forEach(({ marker, category }) => {
        const isVisible = filterValue === 'all' || category === filterValue;
        marker.getElement().style.visibility = isVisible ? 'visible' : 'hidden';
        if (isVisible) {
            bounds.extend(marker.getLngLat());
        }
    });

    if (!bounds.isEmpty()) {
        map.fitBounds(bounds, { padding: 50, maxZoom: 15, duration: 5000 });
    }
}
