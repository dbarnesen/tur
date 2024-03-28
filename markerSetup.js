import mapboxgl from 'mapbox-gl';
import { createCustomMarkerElement, scrollToSelectedItem } from './markerUtils.js';
import { selectedMarkerIcon, unselectedMarkerIcon } from './config.js';

let currentlyOpenContent = null;
let currentlySelectedItem = null;
let allMarkers = [];
let map;

export function setupMarkers(initialMap) {
    map = initialMap;
    initializeMarkers();
    setupShowMapButtonListeners();
}

function initializeMarkers() {
    document.querySelectorAll('.tur-collection-item').forEach(item => {
        const latitude = parseFloat(item.getAttribute('data-lat'));
        const longitude = parseFloat(item.getAttribute('data-lng'));
        const itemId = item.getAttribute('data-item-id');
        const category = item.getAttribute('data-kategori');

        if (!isNaN(latitude) && !isNaN(longitude)) {
            const markerElement = createCustomMarkerElement(unselectedMarkerIcon);
            const marker = new mapboxgl.Marker({
                element: markerElement,
                anchor: 'bottom',
            }).setLngLat([longitude, latitude]).addTo(map);

            allMarkers.push({ marker, item, category, element: markerElement, latitude, longitude });

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
}

function setupShowMapButtonListeners() {
    document.querySelectorAll('.showmapbutton').forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-kategori');
            const mapStyleUrl = this.getAttribute('data-mapstyle');

            if (mapStyleUrl && map.getStyle().styleURL !== mapStyleUrl) {
                map.setStyle(mapStyleUrl).once('style.load', () => {
                    reinitializeMarkers(filterValue);
                });
            } else {
                filterCollectionItems(filterValue);
                filterMarkersAndAdjustMapView(filterValue);
            }
        });
    });
}

function reinitializeMarkers(filterValue) {
    allMarkers.forEach(({ marker }) => marker.remove());
    allMarkers = [];
    initializeMarkers(); // This function needs to correctly re-add markers
    applyFilter(filterValue);
}

function applyFilter(filterValue) {
    filterCollectionItems(filterValue);
    filterMarkersAndAdjustMapView(filterValue);
}
function toggleCollectionContent(content) {
    if (content !== currentlyOpenContent) {
        if (currentlyOpenContent) {
            closeCollectionContent(currentlyOpenContent);
        }
        openCollectionContent(content);
        currentlyOpenContent = content;
    } else {
        closeCollectionContent(content);
        currentlyOpenContent = null;
    }
}

function openCollectionContent(content) {
    content.style.display = 'block';
    setTimeout(() => {
        content.classList.add('expanded');
        content.style.height = '35vh';
    }, 10);
}

function closeCollectionContent(content) {
    content.classList.remove('expanded');
    setTimeout(() => {
        content.style.height = '0';
        setTimeout(() => content.style.display = 'none', 300);
    }, 10);
}

function updateMarkerIcon(item, iconUrl) {
    const markerData = allMarkers.find(m => m.item === item);
    if (markerData) {
        markerData.element.style.backgroundImage = `url(${iconUrl})`;
    }
}

function filterCollectionItems(filterValue) {
    document.querySelectorAll('.tur-collection-item').forEach(item => {
        const itemCategory = item.getAttribute('data-kategori');
        item.style.display = (filterValue === 'all' || itemCategory === filterValue) ? '' : 'none';
    });
}

function filterMarkersAndAdjustMapView(filterValue) {
    // Adjusts the map view to fit all visible markers after filtering
    const bounds = new mapboxgl.LngLatBounds();
    allMarkers.forEach(({ marker, category }) => {
        if (filterValue === 'all' || category === filterValue) {
            bounds.extend(new mapboxgl.LngLat(marker.getLngLat().lng, marker.getLngLat().lat));
        }
    });

    if (!bounds.isEmpty()) {
        map.fitBounds(bounds, { padding: 50, maxZoom: 15, duration: 5000 });
    }
}
