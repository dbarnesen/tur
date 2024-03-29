export function filterCollectionItems(filterValue) {
    document.querySelectorAll('.tur-collection-item').forEach(item => {
        const itemCategory = item.getAttribute('data-kategori');
        item.style.display = (filterValue === 'all' || itemCategory === filterValue) ? '' : 'none';
    });
}

export function filterMarkersAndAdjustMapView(map, allMarkers, filterValue) {
    const bounds = new mapboxgl.LngLatBounds();
    allMarkers.forEach(({ marker, category, latitude, longitude }) => {
        const isVisible = filterValue === 'all' || category === filterValue;
        marker.getElement().style.visibility = isVisible ? 'visible' : 'hidden';
        if (isVisible) {
            marker.addTo(map);
            bounds.extend(marker.getLngLat());
        } else {
            marker.remove();
        }
    });

    if (!bounds.isEmpty()) {
        map.fitBounds(bounds, { padding: 50, maxZoom: 15, duration: 6000 });
    }
}
