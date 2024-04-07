import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);

let currentActiveContent = null; // Track the currently active content div

export function initSwipeInteractions() {
  document.querySelectorAll('.tur-collection-item').forEach(item => {
    item.addEventListener('click', function() {
      const itemId = this.getAttribute('data-item-id');
      const contentToReveal = document.querySelector(`.tur-collection-content[data-item-id="${itemId}"]`);

      // Reset and hide the previously active content
      if (currentActiveContent && currentActiveContent !== contentToReveal) {
        // Animate the current active content back to its starting position
        gsap.to(currentActiveContent, {
          y: 0,
          top: '80vh', // Assuming 80vh is the off-screen position
          duration: 0.5,
          onComplete: () => {
            currentActiveContent.style.display = 'none'; // Hide after animation
          }
        });
      }

      // Show the newly selected content
      if (contentToReveal && contentToReveal !== currentActiveContent) {
        contentToReveal.style.display = 'block'; // Make the content block to reveal it
        gsap.to(contentToReveal, {
          top: '60vh', // Initial reveal position
          duration: 0.5,
          onComplete: () => {
            // Initialize draggable with snapping functionality
            Draggable.create(contentToReveal, {
              type: "y",
              bounds: document.body,
              onDragEnd: function() {
                const viewportHeight = window.innerHeight;
                const minY = viewportHeight * 0.2; // 20vh from the top
                const halfwayPoint = viewportHeight / 2;
                if (Math.abs(this.y) > halfwayPoint) {
                  // Snap to 20vh from the top
                  gsap.to(contentToReveal, { y: -minY, duration: 0.5 });
                } else {
                  // Return to the initial position (60vh from the top)
                  gsap.to(contentToReveal, { y: 0, top: '60vh', duration: 0.5 });
                }
              }
            });
          }
        });

        currentActiveContent = contentToReveal; // Update the currently active content
      }
    });
  });
}
