export function filterCollectionItems(filterValue) {
    const collectionItems = document.querySelectorAll(".tur-collection-item");
    collectionItems.forEach(item => {
        item.style.display = item.getAttribute("data-kategori") === filterValue ? "" : "none";
    });
}

export function filterMarkers(markers, filterValue) {
    markers.forEach(marker => {
        const isVisible = marker.getElement().getAttribute("data-kategori") === filterValue;
        marker.getElement().style.visibility = isVisible ? "visible" : "hidden"; // or adjust display style
    });
}
