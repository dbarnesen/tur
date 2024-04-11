// Import GSAP and the Draggable plugin
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";

// Register the GSAP Draggable plugin
gsap.registerPlugin(Draggable);

let currentActiveContent = null;

// This function is called to animate content in and make it draggable
function initSwipeInteractions() {
    document.querySelectorAll('.tur-collection-item').forEach(item => {
        item.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const contentDiv = document.querySelector(`.tur-collection-content[data-id="${id}"]`);
            showAndDragContent(contentDiv);
        });
    });

    document.querySelectorAll('.tur-content-close').forEach(button => {
        button.addEventListener('click', function() {
            const contentDiv = this.closest('.tur-collection-content');
            hideContent(contentDiv);
        });
    });
}

function showAndDragContent(contentDiv) {
    if (currentActiveContent) {
        hideContent(currentActiveContent, () => animateContentIn(contentDiv));
    } else {
        animateContentIn(contentDiv);
    }
}

function animateContentIn(contentDiv) {
    contentDiv.style.display = 'block';
    gsap.fromTo(contentDiv, { bottom: '-80vh' }, { bottom: '30vh', duration: 0.5, 
        onComplete: () => {
            makeDraggable(contentDiv);
            currentActiveContent = contentDiv;
        }
    });
}

function hideContent(contentDiv, callback = () => {}) {
    gsap.to(contentDiv, {
        bottom: '-80vh', duration: 0.5, onComplete: () => {
            contentDiv.style.display = 'none';
            if (contentDiv === currentActiveContent) {
                currentActiveContent = null;
            }
            callback();
        }
    });
}

function makeDraggable(contentDiv) {
    const viewportHeight = window.innerHeight;
    const lowerBound = viewportHeight * 0.7; // Represents 30vh from the bottom
    const upperBound = viewportHeight * 0.15; // Represents 85vh from the bottom

    Draggable.create(contentDiv, {
        type: "y",
        bounds: { minY: -upperBound, maxY: 0 },
        onDragEnd: function() {
            let newY = 0; // Default to going back to start position
            const endYRelativeToViewport = viewportHeight + this.endY; // Calculate end position relative to the viewport

            // Decide whether to snap up or down based on the drag end position
            if (endYRelativeToViewport < viewportHeight * 0.5) { // If dragged beyond halfway up the screen
                newY = -upperBound; // Snap up to max position
            } else {
                newY = -lowerBound; // Snap back to initial position
            }

            // Animate to the new position
            gsap.to(contentDiv, { y: newY, duration: 0.5 });
        }
    });
}

export default initSwipeInteractions;
