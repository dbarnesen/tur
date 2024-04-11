// Import GSAP and the Draggable plugin
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";

// Register the GSAP Draggable plugin
gsap.registerPlugin(Draggable);

let currentActiveContent = null;

// Function to initialize draggable elements and attach event listeners
function initSwipeInteractions() {
    // Event listener for .tur-collection-item click
    document.querySelectorAll('.tur-collection-item').forEach(item => {
        item.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const contentDiv = document.querySelector(`.tur-collection-content[data-id="${id}"]`);
            showAndDragContent(contentDiv);
        });
    });

    // Event listener for .tur-content-close click
    document.querySelectorAll('.tur-content-close').forEach(button => {
        button.addEventListener('click', function() {
            const contentDiv = this.closest('.tur-collection-content');
            hideContent(contentDiv);
        });
    });
}

// Function to handle showing and initializing draggable for content
const showAndDragContent = (contentDiv) => {
    if (currentActiveContent && currentActiveContent !== contentDiv) {
        hideContent(currentActiveContent, () => animateContentIn(contentDiv));
    } else if (!currentActiveContent) {
        animateContentIn(contentDiv);
    }
};

// Function to animate content in view and make it draggable
const animateContentIn = (contentDiv) => {
    contentDiv.style.display = 'block';
    gsap.fromTo(contentDiv, { y: 0, bottom: '-100%' }, {
        bottom: '-30%', 
        duration: 0.5, 
        onComplete: () => {
            initializeDraggable(contentDiv);
            currentActiveContent = contentDiv;
        }
    });
};

// Function to hide content smoothly
const hideContent = (contentDiv, callback = () => {}) => {
    gsap.to(contentDiv, {
        bottom: '-100%', 
        duration: 0.5, 
        onComplete: () => {
            contentDiv.style.display = 'none';
            if (contentDiv === currentActiveContent) {
                currentActiveContent = null;
            }
            callback();
        }
    });
};

// Function to initialize Draggable with snapping logic
const initializeDraggable = (contentDiv) => {
    if (Draggable.get(contentDiv)) {
        Draggable.get(contentDiv).kill();
    }

    Draggable.create(contentDiv, {
        type: "y",
        edgeResistance: 0.65,
        bounds: { minY: -window.innerHeight * 0.5, maxY: 0 },
        onDragEnd: function() {
            let newY = this.getDirection("startToEnd") === "down" ? 0 : -window.innerHeight * 0.55;
            if (Math.abs(this.y) >= window.innerHeight * 0.25) {
                newY = -window.innerHeight * 0.55;
            }
            gsap.to(contentDiv, { y: newY, duration: 0.5 });
        }
    });
};

export default initSwipeInteractions;
