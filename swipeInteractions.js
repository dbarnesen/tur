import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);

document.querySelectorAll('.tur-collection-item').forEach(item => {
  item.addEventListener('click', function() {
    const id = this.getAttribute('data-id');
    showContent(id);
  });
});

function showContent(id) {
  const contentDiv = document.querySelector(`.tur-collection-content[data-id="${id}"]`);

  if (currentActiveContent) {
    gsap.to(currentActiveContent, {
      bottom: '-70vh', duration: 0.5, onComplete: () => {
        currentActiveContent.style.display = 'none';
        currentActiveContent = null;
        animateContentIn(contentDiv);
      }
    });
  } else {
    animateContentIn(contentDiv);
  }
}

function animateContentIn(contentDiv) {
  contentDiv.style.display = 'block';
  gsap.fromTo(contentDiv, {
    bottom: '-70vh'
  }, {
    bottom: '30vh', // Slide up to 30vh from the bottom
    duration: 0.5,
    onComplete: () => {
      makeDraggable(contentDiv);
      currentActiveContent = contentDiv;
    }
  });
}

function makeDraggable(contentDiv) {
  const viewportHeight = window.innerHeight;
  const snapPoints = [viewportHeight * 0.3, viewportHeight * 0.5, viewportHeight * 0.85]; // 30vh, 50vh, and 85vh
  
  Draggable.create(contentDiv, {
    type: "y",
    bounds: {minY: -viewportHeight * 0.85, maxY: 0},
    onDragEnd: function() {
      // Logic to snap to 85vh or back to 30vh
      let newY = -viewportHeight * 0.3; // Default to 30vh
      if (this.endY < -viewportHeight * 0.5) {
        newY = -viewportHeight * 0.85; // Snap to 85vh
      }
      gsap.to(contentDiv, {y: newY, duration: 0.5});
    }
  });
}

document.querySelectorAll('.tur-content-close').forEach(button => {
  button.addEventListener('click', function() {
    const contentDiv = this.closest('.tur-collection-content');
    gsap.to(contentDiv, {
      bottom: '-70vh', duration: 0.5, onComplete: () => {
        contentDiv.style.display = 'none';
        if (contentDiv === currentActiveContent) {
          currentActiveContent = null;
        }
      }
    });
  });
});

let currentActiveContent = null;
export { initSwipeInteractions };
