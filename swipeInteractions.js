import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);

export function initSwipeInteractions() {
  
  document.querySelectorAll('.tur-collection-content').forEach(bottomSheet => {
  Draggable.create(bottomSheet, {
    type: "y",
    bounds: window,
    onDragEnd: function() {
      let snapTo = 0; // Default snap back to the starting position
      if (Math.abs(this.y) > snapThreshold) {
        snapTo = this.y < 0 ? -snapToPosition : snapToPosition;
      }
      gsap.to(bottomSheet, { y: snapTo, duration: 0.5 });
    }
  });
});

};
