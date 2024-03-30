import { unselectedMarkerIcon, selectedMarkerIcon } from './config.js';

export function createCustomMarkerElement(iconName = 'location_on') {
    const markerElement = document.createElement('span');
    markerElement.className = 'material-symbols-outlined custom-marker';
    markerElement.innerHTML = iconName; // Set the icon's text. Default is 'location_on'.
    // Optional: Style your marker further if needed
    markerElement.style.fontSize = '24px'; // Example size
    // markerElement.style.color = '#cce8e7'; // Example color
    markerElement.style.stroke = '1px #051f1f';
    return markerElement;
}

export function toggleMarkerIcon(markers, selectedIndex) {
    markers.forEach((marker, index) => {
        const iconUrl = index === selectedIndex ? selectedMarkerIcon : unselectedMarkerIcon;
        marker.getElement().style.backgroundImage = `url(${iconUrl})`;
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
export function applyPressedStyle(item) {
    item.classList.add('selected'); // Add a class that mimics the Webflow style for pressed/focused state
}
