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
        selectedCollectionItem.style.borderColor = '';
        selectedCollectionItem.style.backgroundColor = '';
    }
    item.style.borderColor = '#cc9752';
    item.style.backgroundColor = '#cc9752';
    return item; // Return the newly selected item for external tracking
}
