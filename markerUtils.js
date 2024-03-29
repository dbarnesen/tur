import { unselectedMarkerIcon, selectedMarkerIcon } from './config.js';

export function createCustomMarkerElement(iconUrl = unselectedMarkerIcon) {
    const markerElement = document.createElement('div');
    markerElement.className = 'custom-marker';
    markerElement.style.backgroundImage = `url(${iconUrl})`;
    markerElement.style.width = '40px';
    markerElement.style.height = '50px';
    markerElement.style.backgroundSize = 'cover';
    return markerElement;
}

export function toggleMarkerIcon(markers, selectedIndex) {
    markers.forEach((marker, index) => {
        const iconUrl = index === selectedIndex ? selectedMarkerIcon : unselectedMarkerIcon;
        marker.getElement().style.backgroundImage = `url(${iconUrl})`;
    });
}

export function scrollToSelectedItem(item) {
    item.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
}

export function applySelectionStyling(item, selectedCollectionItem) {
    if (selectedCollectionItem) {
        selectedCollectionItem.style.scale = '';
        selectedCollectionItem.style.box-shadow = '';
    }
    item.style.scale = '1.1';
    item.style.box-shadow = '1px 1px 5px gray';
    return item; // Return the newly selected item for external tracking
}
export function applyPressedStyle(item) {
    item.classList.add('selected'); // Add a class that mimics the Webflow style for pressed/focused state
}
