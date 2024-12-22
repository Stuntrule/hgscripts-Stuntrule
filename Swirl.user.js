// ==UserScript==
// @name         HyruleGuessr Center Hole Cutter
// @namespace    https://hyruleguessr.com/*
// @version      1.2
// @description  Adds a swirling distortion effect to the first viewer-move image on hyruleguessr.com/*
// @match        https://hyruleguessr.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to apply swirling distortion effect
    function applySwirl() {
        // Select the first viewer-move image
        let viewerMoveImage = document.querySelector('img.viewer-move:first-child');

        if (viewerMoveImage) {
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            canvas.width = viewerMoveImage.width;
            canvas.height = viewerMoveImage.height;
            ctx.drawImage(viewerMoveImage, 0, 0);

            let data = ctx.getImageData(0, 0, canvas.width, canvas.height);
            let swirlRadius = 360;
            let centerX = canvas.width / 2;
            let centerY = canvas.height / 2;

            for (let y = 0; y < canvas.height; y++) {
                for (let x = 0; x < canvas.width; x++) {
                    let dx = x - centerX;
                    let dy = y - centerY;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < swirlRadius) {
                        let angle = (distance / swirlRadius) * 2 * Math.PI;
                        let radius = distance;

                        let srcX = Math.min(Math.max(centerX + dx * Math.cos(angle) - dy * Math.sin(angle), 0), canvas.width - 1);
                        let srcY = Math.min(Math.max(centerY + dx * Math.sin(angle) + dy * Math.cos(angle), 0), canvas.height - 1);

                        let srcIndex = (srcY * canvas.width + srcX) * 4;
                        let destIndex = (y * canvas.width + x) * 4;

                        data.data[destIndex] = data.data[srcIndex];
                        data.data[destIndex + 1] = data.data[srcIndex + 1]; // Green
                        data.data[destIndex + 2] = data.data[srcIndex + 2]; // Blue
                        data.data[destIndex + 3] = data.data[srcIndex + 3]; // Alpha
                    }
                }
            }

            ctx.putImageData(data, 0, 0);
            viewerMoveImage.src = canvas.toDataURL();
        }
    }

    // Observe the DOM for changes
    const observer = new MutationObserver(applySwirl);
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial application
    applySwirl();

})();
