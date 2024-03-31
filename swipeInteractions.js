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
            if (deltaY > 0) {
                collapseDiv(event.target); // Swiping down
            } else {
                expandDiv(event.target); // Swiping up
            }
            window.scrollTo(0, 0);
            startY = null;
        }
    };

const expandDiv = (target) => {
    const content = target.closest('.tur-collection-content');
    if (content) {
        content.classList.add('expanded'); // Mark as expanded
        content.style.maxHeight = '70vh'; // Use max-height for transition
        const trayArrow = content.querySelector('.tur-tray-arrow');
        if (trayArrow) {
            trayArrow.style.transform = 'rotateX(0deg)'; // Adjust arrow for expanded state
        }
    }
};

const collapseDiv = (target) => {
    const content = target.closest('.tur-collection-content');
    if (content) {
        content.classList.remove('expanded'); // Mark as not expanded
        content.style.maxHeight = '0'; // Transition to 0 for collapse
        const trayArrow = content.querySelector('.tur-tray-arrow');
        if (trayArrow) {
            trayArrow.style.transform = 'rotateX(180deg)'; // Reset arrow for collapsed state
        }
    }
};

    // Apply the touch event listeners to all .tur-content-slide-cnt elements
    $$('.tur-content-slide-cnt', contentSlideCnt => {
        contentSlideCnt.addEventListener('touchstart', handleTouchStart);
        contentSlideCnt.addEventListener('touchend', handleTouchEnd);
    });
}
