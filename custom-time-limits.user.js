// ==UserScript==
// @name         Custom Picture & Map Disappearance + Time
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Allows for custom picture disappearance and validation time in HyruleGuessr
// @author       Stuntrule
// @match        https://hyruleguessr.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Save original methods
    const originalSetTimeout = window.setTimeout;
    const originalSetInterval = window.setInterval;
    const originalRequestAnimationFrame = window.requestAnimationFrame;
    const originalDateNow = Date.now;
    const originalPerformanceNow = performance.now.bind(performance);

    // Speed multiplier (2x faster)
    let speedMultiplier = 2;

    // Picture disappearance time
    let pictime = 5000; // Default: 5s disappearance

    let maptime = 7500; // Default: 7.5s disappearance

    let maptimeon = true;

    // Override setTimeout
    window.setTimeout = function(callback, delay, ...args) {
        const adjustedDelay = Math.max(delay * speedMultiplier, 0);
        return originalSetTimeout(callback, adjustedDelay, ...args);
    };

    // Override setInterval
    window.setInterval = function(callback, delay, ...args) {
        const adjustedDelay = Math.max(delay * speedMultiplier, 0);
        return originalSetInterval(callback, adjustedDelay, ...args);
    };

    // Override Date.now
    Date.now = function() {
        return originalDateNow() * speedMultiplier;
    };

    // Override performance.now
    performance.now = function() {
        return originalPerformanceNow() * speedMultiplier;
    };

    // Monitor and patch custom timer implementations
    const patchCustomTimers = (object, methodName) => {
        if (object[methodName] && typeof object[methodName] === 'function') {
            const originalMethod = object[methodName];
            object[methodName] = function(...args) {
                if (typeof args[0] === 'function' && typeof args[1] === 'number') {
                    args[1] = args[1] * speedMultiplier; // Adjust delay
                }
                return originalMethod.apply(this, args);
            };
        }
    };

    // Patch common custom timer functions
    const commonTimerObjects = [window, Worker.prototype];
    const commonTimerMethods = ['setTimeout', 'setInterval'];
    commonTimerObjects.forEach(obj => {
        commonTimerMethods.forEach(method => patchCustomTimers(obj, method));
    });

    // Function to turn images black after 50ms
    function blackoutImages() {
        // Select all images with the "viewer-move" class
        const images = document.querySelectorAll('img.viewer-move');
        images.forEach((img) => {
            setTimeout(() => {
                img.style.filter = "brightness(0%)"; // Makes the image black
            }, pictime / (speedMultiplier * speedMultiplier));
        });
    }

    function blackoutMaps() {
        // Select all images with the "viewer-move" class
        const images = document.querySelectorAll('div.map-frame');
        if (maptimeon) {
            images.forEach((img) => {
                setTimeout(() => {
                    img.style.filter = "brightness(0%)"; // Makes the image black
                }, maptime / (speedMultiplier * speedMultiplier));
            });
        }
    }

    // Event listener to dynamically update timeout value
    document.addEventListener('keydown', (event) => {
        if (event.key === 'D' || event.key === 'd') {
            const userInput = prompt(
                "Enter the new timeout value in milliseconds:",
                pictime
            );
            const newTimeout = parseInt(userInput, 10);
            if (!isNaN(newTimeout) && newTimeout >= 0) {
                pictime = newTimeout;
                alert(`Timeout updated to ${pictime} ms`);
            } else {
                alert("Invalid input. Timeout value remains unchanged.");
            }
        }
        if (event.key === 'T' || event.key === 't') {
            const userInput = prompt(
                "Enter the new speed factor: ",
                speedMultiplier
            );
            const newspeedMultiplier = parseInt(userInput, 10);
            if (!isNaN(newspeedMultiplier) && newspeedMultiplier >= 0) {
                speedMultiplier = newspeedMultiplier;
                alert(`Speed factor updated to ${speedMultiplier}x`);
            } else {
                alert("Invalid input. Speed factor remains unchanged.");
            }
        }
        if (event.key === 'M' || event.key === 'm') {
            const userInput = prompt(
                "Enter the new map disappearance in ms: ",
                maptime
            );
            const newmaptime = parseInt(userInput, 10);
            if (!isNaN(newmaptime) && newmaptime >= 0) {
                maptime = newmaptime;
                alert(`Speed factor updated to ${maptime}x`);
            } else {
                alert("Invalid input. Speed factor remains unchanged.");
            }
        }
        if (event.key === 'N' || event.key === 'n') {
            if (maptimeon) {
                maptimeon = false;
                alert('Map time is off.');
            }
            else {
                maptimeon = true;
                alert('Map time is on.');
            }
        }
    });

    // Observe DOM changes to catch dynamically added images
    const observer = new MutationObserver(blackoutImages);

    const mapobserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            // If new nodes are added, attempt to blackout images
            if (mutation.addedNodes.length > 0) {
                blackoutMaps();
            }
        });
    });

    // Start observing the entire document for added/changed nodes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    mapobserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial run for any pre-existing images
    blackoutImages();

    // Initial run for any pre-existing maps
    blackoutMaps();
})();
