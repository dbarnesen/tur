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
}
