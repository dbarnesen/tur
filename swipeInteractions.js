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
    const viewportHeight = window.innerHeight;
    const initialBottom = 30; // Initial bottom position in vh when revealed
    const maxDragUpBottom = 85; // Max up position in vh
    const halfwayPointVH = 50; // Halfway point in vh for deciding snap direction

    // Convert vh to pixels for calculations
    const initialBottomPx = viewportHeight * (initialBottom / 100);
    const maxDragUpBottomPx = viewportHeight * (maxDragUpBottom / 100);
    const halfwayPointPx = viewportHeight * (halfwayPointVH / 100);

    Draggable.create(contentDiv, {
        type: "y",
        bounds: {
            minY: -(viewportHeight - maxDragUpBottomPx), // Allow dragging up to the maxDragUpBottom
            maxY: 0 // Starts from the initial position, don't allow dragging down beyond the initial reveal
        },
        onDragEnd: function() {
            let endY = this.endY;
            let snapToY;

            // Determine whether to snap to the top or back to the initial position based on the halfway point
            if (Math.abs(endY) > halfwayPointPx) {
                // Snap to maxDragUpBottom if dragged beyond the halfway point
                snapToY = -(viewportHeight - maxDragUpBottomPx);
            } else {
                // Snap back to initialBottom if not dragged beyond the halfway point
                snapToY = -(viewportHeight - initialBottomPx);
            }

            // Animate to the determined position
            gsap.to(contentDiv, {
                y: snapToY,
                duration: 0.5,
                onComplete: () => {
                    // If needed, adjust contentDiv's style to reflect the new 'bottom' position
                    // This is optional and can be used if you're tracking the 'bottom' position in a different way
                }
            });
        }
    });
}


// Export the initSwipeInteractions function
export default initSwipeInteractions;
