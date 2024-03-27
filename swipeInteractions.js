// A helper function to select elements. Mimics a bit of the jQuery selector for convenience.
const $ = selector => document.querySelector(selector);

export function setupSwipeInteractions() {
    let startY, endY;
    const minSwipeDistance = 20; // Minimum swipe distance threshold

    const handleTouchStart = event => {
        startY = event.touches[0].clientY;
    };

    const handleTouchEnd = event => {
        if (!startY) return; // Prevent handling if touch start event hasn't occurred
        endY = event.changedTouches[0].clientY;
        
        const deltaY = endY - startY;
        if (Math.abs(deltaY) > minSwipeDistance) {
            if (deltaY > 0) event.preventDefault();
            deltaY < 0 ? expandDiv() : collapseDiv();
            window.scrollTo(0, 0);
            startY = null;
        }
    };

    const expandDiv = () => {
        $('.tur-collection-content').style.height = '70vh';
        $('.tur-tray-arrow').style.transform = 'rotateX(0deg)';
    };

    const collapseDiv = () => {
        $('.tur-collection-content').style.height = '20vh';
        $('.tur-tray-arrow').style.transform = 'rotateX(180deg)';
    };

    // Assuming '.tur-content-slide-cnt' is the swipeable area
    const contentSlideCnt = $('.tur-content-slide-cnt');
    if (contentSlideCnt) {
        contentSlideCnt.addEventListener('touchstart', handleTouchStart);
        contentSlideCnt.addEventListener('touchend', handleTouchEnd);
    }
}
