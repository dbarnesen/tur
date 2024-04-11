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
                bottom: '-80vh', duration: 0.5, onComplete: () => {
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
            bottom: '-80vh', duration: 0.5, onComplete: () => {
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
        bottom: '-80vh'
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
    // Conversion from vh to pixels for accuracy in calculations
    const viewportHeight = window.innerHeight;
    const upperBound = viewportHeight * 0.15; // Represents 85vh from the bottom
    const lowerBound = viewportHeight * 0.7; // Represents 30vh from the bottom
    const halfwayPoint = viewportHeight * 0.5; // Represents 50vh from the bottom

    Draggable.create(contentDiv, {
        type: "y",
        bounds: {
            minY: -upperBound,
            maxY: -lowerBound
        },
        onDragEnd: function() {
            // Determine if we're closer to the top or bottom
            let finalY;
            if (Math.abs(this.y) < halfwayPoint) {
                finalY = -lowerBound; // Go back to initial position (30vh from bottom)
            } else {
                finalY = -upperBound; // Snap to the top position (85vh from bottom)
            }

            // Apply the animation to move the content
            gsap.to(this.target, { y: finalY, duration: 0.5 });
        }
    });
}



// Export the initSwipeInteractions function
export default initSwipeInteractions;
