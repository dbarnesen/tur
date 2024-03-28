import mapboxgl from 'mapbox-gl';
import { createCustomMarkerElement, scrollToSelectedItem } from './markerUtils.js';
import { selectedMarkerIcon, unselectedMarkerIcon } from './config.js';

let currentlyOpenContent = null; // Track the currently open collection content
let currentlySelectedItem = null; // Track the currently selected item for styling
let allMarkers = []; // Keep track of all markers for updating their icons

export function setupMarkers(map) {
    const collectionItems = document.querySelectorAll('.tur-collection-item');

    collectionItems.forEach((item) => {
        const latitude = parseFloat(item.getAttribute('data-lat'));
        const longitude = parseFloat(item.getAttribute('data-lng'));
        const itemId = item.getAttribute('data-item-id');
        const category = item.getAttribute('data-kategori'); // Category for filtering

        if (!isNaN(latitude) && !isNaN(longitude)) {
            const markerElement = createCustomMarkerElement(unselectedMarkerIcon);
            const marker = new mapboxgl.Marker({
                element: markerElement,
                anchor: 'bottom',
            }).setLngLat([longitude, latitude]).addTo(map);
            const initialFilter = 'all'; // or any other category you start with

            allMarkers.push({ marker, item, category, element: markerElement });
            markerElement.style.visibility = (initialFilter === 'all' || initialFilter === category) ? 'visible' : 'hidden';

            item.addEventListener('click', function() {
                // Reset styling for previously selected item
                if (currentlySelectedItem) {
                    currentlySelectedItem.classList.remove('selected');
                    const previousMarker = allMarkers.find(m => m.item === currentlySelectedItem);
                    if (previousMarker) {
                        previousMarker.element.style.backgroundImage = `url(${unselectedMarkerIcon})`;
                    }
                }

                // Set new selected item and update styling
                this.classList.add('selected');
                currentlySelectedItem = this;
                const currentMarker = allMarkers.find(m => m.item === this);
                if (currentMarker) {
                    currentMarker.element.style.backgroundImage = `url(${selectedMarkerIcon})`;
                }

                // Zoom to the item's location on the map
                map.flyTo({ center: [longitude, latitude], zoom: 16 });
                scrollToSelectedItem(this);

                // Open or close the collection content
                const collectionContent = document.querySelector(`.tur-collection-content[data-content-id="${itemId}"]`);
                toggleCollectionContent(collectionContent);
            });

            marker.getElement().addEventListener('click', () => {
                item.click(); // Simulate click on the collection item
            });
        }
    });

    // Set up filtering based on "showmapbutton" clicks
    document.querySelectorAll('.showmapbutton').forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-kategori');
            filterCollectionItems(filterValue);
            filterMarkers(filterValue);
        });
    });
}

function toggleCollectionContent(content) {
    if (currentlyOpenContent && currentlyOpenContent !== content) {
        closeCollectionContent(currentlyOpenContent);
    }
    if (content !== currentlyOpenContent) {
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
        content.style.height = '30vh';
    }, 10); // Minor delay to ensure smooth transition
}

function closeCollectionContent(content) {
    content.classList.remove('expanded');
    content.style.height = '0';
    setTimeout(() => content.style.display = 'none', 300); // Match this with CSS transition
}

function filterCollectionItems(filterValue) {
    allMarkers.forEach(({ item, category }) => {
        item.style.display = (filterValue === 'all' || category === filterValue) ? '' : 'none';
    });
}

function filterMarkers(filterValue) {
    console.log(`Filtering markers with category: ${filterValue}`);
    allMarkers.forEach(({ marker, category, element }) => {
        const isVisible = filterValue === 'all' || category === filterValue;
        element.style.visibility = isVisible ? 'visible' : 'hidden';
        if (isVisible) {
            if (!marker.getMap()) marker.addTo(map);
        } else {
            marker.remove();
        }
    });
}

