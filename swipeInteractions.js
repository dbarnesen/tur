const $$ = (selector, callback) => {
    document.querySelectorAll(selector).forEach(callback);
};

export function setupDragInteractions() {
    let startY;
    let isDragging = false;
    const contentMaxHeight = 70; // Max height in vh
    const expandThreshold = 60; // Threshold to fully expand in vh
    const collapseThreshold = 40; // Threshold to collapse in vh

    const handleTouchStart = event => {
        startY = event.touches[0].clientY;
        isDragging = true;
    };

    const handleTouchMove = event => {
        if (!isDragging) return;
        const moveY = event.touches[0].clientY;
        const deltaY = moveY - startY;

        const content = event.target.closest('.tur-collection-content');
        if (content) {
            let newHeight = Math.min(Math.max(deltaY / window.innerHeight * 100, 0), contentMaxHeight);
            content.style.maxHeight = `${newHeight}vh`;
            content.style.visibility = 'visible';
            content.style.opacity = newHeight / contentMaxHeight;
        }
    };

    const handleTouchEnd = event => {
        if (!isDragging) return;
        isDragging = false;

        const content = event.target.closest('.tur-collection-content');
        if (content) {
            let finalHeight = parseInt(content.style.maxHeight);
            if (finalHeight >= expandThreshold) {
                content.classList.add('expanded');
                content.style.maxHeight = `${contentMaxHeight}vh`;
            } else if (finalHeight <= collapseThreshold) {
                content.classList.remove('expanded');
                content.style.maxHeight = '0';
            }
            content.style.opacity = content.classList.contains('expanded') ? 1 : 0;
        }
    };

    // Apply touch event listeners to the draggable handle
    document.querySelectorAll('.tur-content-slide-cnt').forEach(handle => {
        handle.addEventListener('touchstart', handleTouchStart, {passive: true});
        handle.addEventListener('touchmove', handleTouchMove, {passive: true});
        handle.addEventListener('touchend', handleTouchEnd);
    });
}
