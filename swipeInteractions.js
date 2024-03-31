export function setupSwipeInteractions() {
    let startY;
    let initialHeight;
    let isDragging = false;
    const minInitialHeight = 20; // Minimum height in vh before drag
    const partialExpandHeight = 30; // Partially expanded height in vh
    const contentMaxHeight = 70; // Max height in vh for expanded content
    const expandThreshold = 50; // Threshold in vh to decide on expansion or retraction

    const handleTouchStart = (event) => {
        const content = event.target.closest('.tur-collection-content');
        if (content) {
            startY = event.touches[0].clientY;
            initialHeight = parseInt(window.getComputedStyle(content).height, 10);
            isDragging = true;
            content.style.transition = 'none'; // Temporarily disable transitions for smooth drag
        }
    };

    const handleTouchMove = (event) => {
        if (!isDragging || !startY) return;
        const moveY = event.touches[0].clientY;
        const deltaY = moveY - startY;

        const content = event.target.closest('.tur-collection-content');
        if (content) {
            let newHeight = initialHeight + deltaY * (100 / window.innerHeight); // Calculate new height based on drag
            newHeight = Math.max(newHeight, minInitialHeight); // Ensure new height is not less than minimum
            newHeight = Math.min(newHeight, contentMaxHeight); // Ensure new height does not exceed maximum
            content.style.height = `${newHeight}vh`;
            content.style.opacity = newHeight / contentMaxHeight;
        }
    };

    const handleTouchEnd = (event) => {
        if (!isDragging) return;
        isDragging = false;
        const content = event.target.closest('.tur-collection-content');
        if (content) {
            content.style.transition = ''; // Re-enable transitions
            let finalHeight = parseFloat(content.style.height);
            if (finalHeight >= expandThreshold) {
                // Expand fully if dragged beyond threshold
                content.classList.add('expanded');
                content.style.height = `${contentMaxHeight}vh`;
            } else {
                // Retract to partially expanded state if not dragged enough
                content.classList.remove('expanded');
                content.style.height = `${partialExpandHeight}vh`;
            }
            content.style.opacity = 1; // Ensure full opacity after expansion/retraction
        }
        startY = null; // Reset start Y position for the next interaction
    };

    // Apply touch event listeners to all elements with .tur-content-slide-cnt class
    document.querySelectorAll('.tur-content-slide-cnt').forEach((element) => {
        element.addEventListener('touchstart', handleTouchStart, { passive: true });
        element.addEventListener('touchmove', handleTouchMove, { passive: true });
        element.addEventListener('touchend', handleTouchEnd);
    });
}
