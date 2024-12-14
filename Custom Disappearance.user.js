// ==UserScript==
// @name         Custom Picture Disappearance
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Allows for custom picture disappearance in HyruleGuessr
// @author       Stuntrule
// @match        https://hyruleguessr.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let time;

    // Function to turn images black after 50ms
    function blackoutImages() {
        // Select all images with the "viewer-move" class
        const images = document.querySelectorAll('img.viewer-move');
        images.forEach((img) => {
            setTimeout(() => {
                img.style.filter = "brightness(0%)"; // Makes the image black
            }, time);
        });
    }

    // Event listener to dynamically update timeout value
    document.addEventListener('keydown', (event) => {
        if (event.key === 'T' || event.key === 't') {
            const userInput = prompt(
                "Enter the new timeout value in milliseconds:",
                time
            );
            const newTimeout = parseInt(userInput, 10);
            if (!isNaN(newTimeout) && newTimeout >= 0) {
                time = newTimeout;
                alert(`Timeout updated to ${time} ms`);
            } else {
                alert("Invalid input. Timeout value remains unchanged.");
            }
        }
    });

    // Observe DOM changes to catch dynamically added images
    const observer = new MutationObserver(blackoutImages);

    // Start observing the entire document for added/changed nodes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial run for any pre-existing images
    blackoutImages();
})();
