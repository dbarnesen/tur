// A helper function to select elements. Mimics a bit of the jQuery selector for convenience.
const $ = selector => document.querySelector(selector);

export function setupSwipeInteractions() {
    let startY, endY;
    const minSwipeDistance = 20; // Minimum swipe distance threshold

    const handleTouchStart = (event) => {
        startY = event.touches[0].clientY;
    };

    const handleTouchEnd = (event) => {
        if (!startY) return; // Prevent handling if touch start event hasn't occurred
        endY = event.changedTouches[0].clientY;

        const deltaY = endY - startY;

        // Check if swipe distance is greater than minimum threshold
        if (Math.abs(deltaY) > minSwipeDistance) {
            // Prevent default behavior if downward swipe
            if (deltaY > 0) {
                event.preventDefault();
            }

            // If swiped up, expand the div
            if (deltaY < 0) {
                expandDiv();
            } 
            // If swiped down, collapse the div
            else {
                collapseDiv();
            }

            // Force the viewport to stay at the top of the page
            window.scrollTo(0, 0);
        }

        // Reset startY
        startY = null;
    };

    // Function to expand the div
    const expandDiv = () => {
        $('.tur-collection-content').style.height = '70vh'; // Adjust height as needed
        $('.tur-tray-arrow').style.transform = 'rotateX(0deg)'; // Rotate arrow when expanded
    };

    // Function to collapse the div
    const collapseDiv = () => {
        $('.tur-collection-content').style.height = '20vh'; // Adjust height as needed
        $('.tur-tray-arrow').style.transform = 'rotateX(180deg)'; // Reset arrow rotation
    };

    // Add touch start and touch end event listeners to the expandable div
    const contentSlideCnt = $('.tur-content-slide-cnt');
    if (contentSlideCnt) {
        contentSlideCnt.addEventListener('touchstart', handleTouchStart);
        contentSlideCnt.addEventListener('touchend', handleTouchEnd);
    }
}
