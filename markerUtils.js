import { unselectedMarkerIcon, selectedMarkerIcon } from './config.js';

export function createCustomMarkerElement(iconName = 'location_on') {
    const markerElement = document.createElement('span');
    markerElement.className = 'unSelected';
    markerElement.innerHTML = iconName; // Set the icon's text. Default is 'location_on'.
    // Optional: Style your marker further if needed
    //markerElement.style.fontSize = '40px'; // Example size
    // markerElement.style.color = '#cce8e7'; // Example color
    return markerElement;
}

export function toggleMarkerIcon(markers, selectedIndex) {
    markers.forEach((marker, index) => {
        // Get the marker element, assuming marker.getElement() correctly retrieves the span element
        const markerElement = marker.getElement();

        // Check if the current marker is the selected one
        if (index === selectedIndex) {
            // Add 'selected' class to highlight the marker
            markerElement.classList.add('selectedMarker');
        } else {
            // Remove 'selected' class from all other markers
            markerElement.classList.remove('selectedMarker');
        }
    });
}


export function scrollToSelectedItem(item) {
    item.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center'});
}

export function applySelectionStyling(item, selectedCollectionItem) {
    if (selectedCollectionItem) {
        selectedCollectionItem.style.scale = '';
        selectedCollectionItem.style.boxShadow = '';
    }
    item.style.scale = '1.1';
    item.style.boxShadow = '1px 1px 5px gray';
    return item; // Return the newly selected item for external tracking
}
