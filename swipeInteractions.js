import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);

export function initSwipeInteractions() {
  
  const bottomSheet = document.getElementById('.tur-collection-content');

  if (bottomSheet) {
    const viewportHeight = window.innerHeight;
    const snapThreshold = viewportHeight * 0.5; // 50vh
    const snapToPosition = viewportHeight * 0.85; // 85vh

    Draggable.create(bottomSheet, {
      type: "y",
      bounds: window,
      onDragEnd: function() {
        if (Math.abs(this.y) > snapThreshold) {
          // Snap to 85vh (considering the sign of this.y)
          gsap.to(bottomSheet, { y: this.y < 0 ? -snapToPosition : snapToPosition, duration: 0.5 });
        } else {
          // Animate back to original position or to another snap point
          gsap.to(bottomSheet, { y: 0, duration: 0.5 });
        }
      }
    });
  }
};
