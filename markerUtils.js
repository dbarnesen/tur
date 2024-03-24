import { selectedMarkerIcon, unselectedMarkerIcon } from './config.js';

export function createCustomMarkerElement(iconUrl) {
  var markerElement = document.createElement('div');
  markerElement.className = 'custom-marker';
  markerElement.style.backgroundImage = 'url(' + iconUrl + ')';
  markerElement.style.width = '40px';
  markerElement.style.height = '50px';
  markerElement.style.backgroundSize = 'cover';
  return markerElement;
}

export function toggleMarkerIcon(markers, selectedIndex) {
  markers.forEach(function(marker, index) {
    var iconUrl = index === selectedIndex ? selectedMarkerIcon : unselectedMarkerIcon;
    marker.getElement().style.backgroundImage = 'url(' + iconUrl + ')';
  });
}

export function scrollToSelectedItem(item) {
  var container = document.getElementById('map-slides');
  item.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
    inline: 'center',
  });
}

export function applySelectionStyling(item, selectedCollectionItem) {
  if (selectedCollectionItem) {
    selectedCollectionItem.style.borderColor = '';
    selectedCollectionItem.style.backgroundColor = '';
  }
  item.style.borderColor = '#cc9752';
  item.style.backgroundColor = '#cc9752';
  selectedCollectionItem = item;
}
