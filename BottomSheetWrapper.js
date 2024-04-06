import React, { useState, useEffect, useRef } from 'react';
import { BottomSheet } from '@mattixes/bottomsheet';
import '@mattixes/bottomsheet/dist/style.css';

const BottomSheetWrapper = () => {
  const [isOpen, setIsOpen] = useState(false);
  const bottomSheetContentRef = useRef(null); // Ref for the content container within the bottom sheet

  useEffect(() => {
    // Function to move the Webflow content to the bottom sheet
    const moveContentToBottomSheet = () => {
      const webflowContent = document.getElementById('tur-collection-content');
      if (webflowContent && bottomSheetContentRef.current) {
        bottomSheetContentRef.current.appendChild(webflowContent);
        webflowContent.style.display = ''; // Ensure the content is visible
      }
    };

    // Function to revert content back to its original position or handle it as necessary
    const revertContent = () => {
      // Your logic here to revert the content back if needed
    };

    if (isOpen) {
      moveContentToBottomSheet();
    }

    // Cleanup function to run when the component unmounts or before re-running the effect
    return () => revertContent();
  }, [isOpen]); // Re-run the effect when `isOpen` changes

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Bottom Sheet</button>

      <BottomSheet
        open={isOpen}
        onDismiss={() => setIsOpen(false)}
        snapPoints={({ minHeight, maxHeight }) => [minHeight, 300, 800]} // Example snap points in pixels
        header={<div>Your Header Here</div>}
        footer={<div>Your Footer Here</div>}
      >
        <div ref={bottomSheetContentRef}>
          {/* This div serves as the container for the dynamically added Webflow content */}
        </div>
      </BottomSheet>
    </>
  );
};

export default BottomSheetWrapper;
