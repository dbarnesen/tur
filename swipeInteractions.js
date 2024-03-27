// A helper function to select all elements and apply a callback function. Mimics jQuery's approach for convenience.
const $$ = (selector, callback) => {
    document.querySelectorAll(selector).forEach(callback);
};

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
            deltaY < 0 ? expandDiv(event.target) : collapseDiv(event.target);
            window.scrollTo(0, 0);
            startY = null;
        }
    };

    const expandDiv = (target) => {
        // Find the closest .tur-collection-content to the event target and adjust its style
        const content = target.closest('.tur-collection-content');
        if (content) {
            content.style.height = '70vh';
        }
        // Adjust the tray arrow within the same content block
        const trayArrow = content.querySelector('.tur-tray-arrow');
        if (trayArrow) {
            trayArrow.style.transform = 'rotateX(0deg)';
        }
    };

    const collapseDiv = (target) => {
        // Similar logic to expandDiv, but for collapsing
        const content = target.closest('.tur-collection-content');
        if (content) {
            content.style.height = '20vh';
        }
        const trayArrow = content.querySelector('.tur-tray-arrow');
        if (trayArrow) {
            trayArrow.style.transform = 'rotateX(180deg)';
        }
    };

    // Apply the touch event listeners to all .tur-content-slide-cnt elements
    $$('.tur-content-slide-cnt', contentSlideCnt => {
        contentSlideCnt.addEventListener('touchstart', handleTouchStart);
        contentSlideCnt.addEventListener('touchend', handleTouchEnd);
    });
}
