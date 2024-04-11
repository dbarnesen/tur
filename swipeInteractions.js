// Import GSAP and the Draggable plugin
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";

// Register the GSAP Draggable plugin
gsap.registerPlugin(Draggable);

// Define a variable to keep track of the currently active content
let currentActiveContent = null;

// Define the main function for initializing swipe interactions
function initSwipeInteractions() {
    document.querySelectorAll('.tur-collection-item').forEach(item => {
        item.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            showContent(id);
        });
    });

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
}

// Define supporting functions used within initSwipeInteractions
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
        bottom: '-30vh',
        duration: 0.5,
        onComplete: () => {
            makeDraggable(contentDiv);
            currentActiveContent = contentDiv;
        }
    });
}

function makeDraggable(contentDiv) {
    const viewportHeight = window.innerHeight;

    Draggable.create(contentDiv, {
        type: "y",
        bounds: {minY: -viewportHeight * 0.85, maxY: 0},
        onDragEnd: function() {
            let newY = -viewportHeight * 0.3; // Default to 30vh
            if (this.endY < -viewportHeight * 0.5) {
                newY = -viewportHeight * 0.85; // Snap to 85vh
            }
            gsap.to(contentDiv, {y: newY, duration: 0.5});
        }
    });
}

// Export the initSwipeInteractions function
export default initSwipeInteractions;
