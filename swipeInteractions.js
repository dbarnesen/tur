import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);

export function initSwipeInteractions() {
  const bottomSheet = document.querySelector('.tur-collection-content');

  if (bottomSheet) {
    const viewportHeight = window.innerHeight;
    const minY = viewportHeight * 0.2; // 20vh from the top
    const maxY = viewportHeight * 0.7; // Initial position at 70vh from the top

    Draggable.create(bottomSheet, {
      type: "y",
      bounds: { minY: -minY, maxY: -maxY },
      onDragEnd: function() {
        if (this.y < -minY) {
          gsap.to(bottomSheet, { y: -minY, duration: 0.5 }); // Snap back if dragged too far
        }
      }
    });
  }
};
document.querySelectorAll('.tur-collection-item').forEach(item => {
  item.addEventListener('click', function() {
    const itemId = this.getAttribute('data-item-id');
    const contentToReveal = document.querySelector(`.tur-collection-content[data-item-id="${itemId}"]`);
    
    // Reset and hide the previously active content
    if (currentActiveContent && currentActiveContent !== contentToReveal) {
      currentActiveContent.style.display = 'none';
      gsap.to(currentActiveContent, { top: '80vh', duration: 0.5 });
    }

    // Show the newly selected content
    if (contentToReveal) {
      contentToReveal.style.display = 'block'; // Make the content block to reveal it
      gsap.to(contentToReveal, { top: '50vh', duration: 0.5, onComplete: () => {
        // Reinitialize draggable if necessary
        Draggable.create(contentToReveal, {
          type: "y",
          bounds: { minY: -window.innerHeight * 0.2, maxY: 0 },
          // Add your onDragEnd logic here
        });
      }});
      
      currentActiveContent = contentToReveal; // Update the currently active content
    }
  });
});
