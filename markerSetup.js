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
            markerElement.setAttribute('data-category', category);
            const marker = new mapboxgl.Marker({
                element: markerElement,
                anchor: 'bottom',
            }).setLngLat([longitude, latitude]).addTo(map);

            allMarkers.push({ marker, item, category, element: markerElement, latitude, longitude });

            item.addEventListener('click', function() {
                handleItemSelection(this, longitude, latitude, itemId);
            });

            marker.getElement().addEventListener('click', () => {
                item.click(); // This triggers the selection handling for the item
            });
        }
    });

    setupShowMapButtonListeners();
}

function handleItemSelection(item, longitude, latitude, itemId) {
    if (currentlySelectedItem) {
        currentlySelectedItem.classList.remove('selected');
        updateMarkerIcon(currentlySelectedItem, unselectedMarkerIcon);
    }
    item.classList.add('selected');
    currentlySelectedItem = item;
    updateMarkerIcon(item, selectedMarkerIcon);
    map.flyTo({ center: [longitude, latitude], zoom: 16 });
    scrollToSelectedItem(item);

    const collectionContent = document.querySelector(`.tur-collection-content[data-content-id="${itemId}"]`);
    toggleCollectionContent(collectionContent);
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

function reAddMarkersToMap(filterValue) {
    allMarkers.forEach(({ marker, category, element, latitude, longitude }) => {
        marker.remove(); // Remove existing marker
        // Re-add marker to the map
        marker = new mapboxgl.Marker({
            element,
            anchor: 'bottom',
        }).setLngLat([longitude, latitude]).addTo(map);

        // Update marker visibility based on the filter
        element.style.visibility = (filterValue === 'all' || category === filterValue) ? 'visible' : 'hidden';
    });

    filterMarkersAndAdjustMapView(filterValue);
}

function filterMarkersAndAdjustMapView(filterValue) {
    const bounds = new mapboxgl.LngLatBounds();
    allMarkers.forEach(({ marker, category, latitude, longitude }) => {
        const isVisible = filterValue === 'all' || category === filterValue;
        marker.getElement().style.visibility = isVisible ? 'visible' : 'hidden';
        if (isVisible) {
            bounds.extend([longitude, latitude]);
        }
    });

    if (!bounds.isEmpty()) {
        map.fitBounds(bounds, { padding: 50, maxZoom: 15, duration: 5000 });
    }
}
