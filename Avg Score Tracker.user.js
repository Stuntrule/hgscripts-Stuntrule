// ==UserScript==
// @name         Hyruleguessr Average Score Tracker
// @version      0.1
// @description  Tracks and displays the average score in HyruleGuessr.
// @author       Stuntrule
// @match        https://hyruleguessr.com/*
// ==/UserScript==

(function() {
    "use strict";
    const URL = "https://hyruleguessr.com/game";
    let counted = false;
    let totalGames = 0;
    let totalScore = 0;

    // Create average score display element
    let avgScoreText = document.createElement("h5");
    avgScoreText.innerText = "Average Score: 0";
    avgScoreText.style.color = "white";
    document.querySelector(".navbar").insertAdjacentElement("afterend", avgScoreText);

    function calculateAverage() {
        const average = totalGames > 0 ? Math.round(totalScore / totalGames) : 0;
        avgScoreText.innerText = "Average Score: " + average;
    }

    function run() {
        if (!window.location.href.startsWith(URL)) return;

        // Check if the game has ended
        const replay_div = document.querySelector(".replay-container");
        const start_game_div = document.querySelector(".start-game-btn-container");

        if (start_game_div) {
            counted = false; // Reset counted when a new game starts
        } else if (replay_div) { // If end of game
            let score_div = document.querySelector(".total-container");
            if (!counted && score_div) {
                const score = parseInt(score_div.innerText.match(/\d+/)[0], 10); // Extract score
                if (!isNaN(score)) {
                    totalGames++;
                    totalScore += score;
                    calculateAverage();
                    counted = true; // Prevent double counting of games
                }
            }
        }
    }

    // Handle key press to reset the average score
    addEventListener("keydown", e => {
        if (e.key === "r") {
            totalGames = 0;
            totalScore = 0;
            calculateAverage();
        }
    });

    // Handle clicks to check for game events
    addEventListener("click", run);
})();
