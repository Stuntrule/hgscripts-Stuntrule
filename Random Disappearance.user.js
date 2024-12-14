// ==UserScript==
// @name         Random Picture Disappearance
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Allows for random picture disappearance in HyruleGuessr
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
    setInterval(() => {
        const userInput = 30 + Math.random() * 170;
        const newTimeout = parseInt(userInput, 10);
        time = newTimeout;
    }, 100);

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
