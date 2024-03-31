export function setupSwipeInteractions() {
    let startY, isDragging = false, isMoved = false;
    const initialHeight = 30; // Height after a tap
    const contentMaxHeight = 70; // Maximum expandable height
    // Thresholds remain the same

    const handleTouchStart = (event) => {
        startY = event.touches[0].clientY;
        isMoved = false; // Reset movement flag
    };

    const handleTouchMove = (event) => {
        if (!startY) return;
        const moveY = event.touches[0].clientY;
        const deltaY = moveY - startY;

        // Qualify as drag if significant vertical movement
        if (Math.abs(deltaY) > 10) { // Adjust sensitivity as needed
            isDragging = true;
            isMoved = true;

            const content = event.target.closest('.tur-collection-content');
            if (content) {
                let newHeight = initialHeight + deltaY * (100 / window.innerHeight);
                newHeight = Math.max(0, Math.min(newHeight, contentMaxHeight)); // Constrain newHeight
                content.style.maxHeight = `${newHeight}vh`;
                // Opacity can be adjusted here if needed
            }
        }
    };

    const handleTouchEnd = (event) => {
        const content = event.target.closest('.tur-collection-content');
        if (content && !isMoved) {
            // Handle tap without move
            content.style.maxHeight = `${initialHeight}vh`;
            content.style.transition = 'max-height 0.3s ease, opacity 0.3s ease';
            // Add further logic if you want to toggle or set specific states based on current height
        } else if (isDragging) {
            // End of drag, decide to expand or collapse
            finalizeHeight(content);
        }
        // Reset flags
        startY = null;
        isDragging = false;
        isMoved = false;
    };

    const finalizeHeight = (content) => {
        let finalHeight = parseFloat(content.style.maxHeight);
        content.style.transition = 'max-height 0.3s ease, opacity 0.3s ease'; // Re-enable smooth transition
        if (finalHeight >= contentMaxHeight / 2) {
            // Expand if dragged more than halfway
            content.style.maxHeight = `${contentMaxHeight}vh`;
        } else {
            // Collapse otherwise
            content.style.maxHeight = `${initialHeight}vh`;
        }
    };

    // Apply event listeners
    document.querySelectorAll('.tur-content-slide-cnt').forEach((element) => {
        element.addEventListener('touchstart', handleTouchStart, { passive: true });
        element.addEventListener('touchmove', handleTouchMove, { passive: true });
        element.addEventListener('touchend', handleTouchEnd);
    });
}
