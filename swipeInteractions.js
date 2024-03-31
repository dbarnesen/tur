export function setupSwipeInteractions() {
    let startY;
    let isDragging = false;
    const contentMaxHeight = 70; // Max height in vh for expanded content
    const expandThreshold = 60; // Threshold in vh to fully expand
    const collapseThreshold = 40; // Threshold in vh to fully collapse

    const handleTouchStart = (event) => {
        startY = event.touches[0].clientY;
        isDragging = true;
    };

    const handleTouchMove = (event) => {
        if (!isDragging) return;
        const moveY = event.touches[0].clientY;
        const deltaY = moveY - startY;

        const content = event.target.closest('.tur-collection-content');
        if (content) {
            let newHeight = Math.max(0, deltaY / window.innerHeight * 100); // Calculate new height as a percentage of screen height
            newHeight = Math.min(newHeight, contentMaxHeight); // Limit new height to maximum
            content.style.maxHeight = `${newHeight}vh`;
            content.style.visibility = 'visible';
            content.style.opacity = newHeight / contentMaxHeight;
        }
    };

    const handleTouchEnd = (event) => {
        isDragging = false;
        const content = event.target.closest('.tur-collection-content');
        if (content) {
            let finalHeight = parseFloat(content.style.maxHeight);
            if (finalHeight >= expandThreshold) {
                content.classList.add('expanded');
                content.style.maxHeight = `${contentMaxHeight}vh`;
                content.style.opacity = 1;
            } else if (finalHeight < expandThreshold && finalHeight > collapseThreshold) {
                // If released between the thresholds, decide based on direction of swipe
                const endY = event.changedTouches[0].clientY;
                const direction = endY - startY;
                if (direction > 0) { // Downward swipe
                    content.classList.remove('expanded');
                    content.style.maxHeight = '0';
                    content.style.opacity = 0;
                } else { // Upward swipe
                    content.classList.add('expanded');
                    content.style.maxHeight = `${contentMaxHeight}vh`;
                    content.style.opacity = 1;
                }
            } else {
                content.classList.remove('expanded');
                content.style.maxHeight = '0';
                content.style.opacity = 0;
            }
        }
        startY = null; // Reset startY for the next interaction
    };

    // Apply touch event listeners to all elements with .tur-content-slide-cnt class
    document.querySelectorAll('.tur-content-slide-cnt').forEach((element) => {
        element.addEventListener('touchstart', handleTouchStart, { passive: true });
        element.addEventListener('touchmove', handleTouchMove, { passive: true });
        element.addEventListener('touchend', handleTouchEnd);
    });
}
