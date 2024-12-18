// ==UserScript==
// @name         Hyruleguessr Speedrun Timer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hyruleguessr Speedrun Timer. Press 'S' to start or stop the timer.
// @author       Stuntrule
// @match        https://hyruleguessr.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let secs = 0;
    let mins = 0;
    let hrs = 0;
    let secsSTR = `0${secs}`;
    let minsSTR = `0${mins}`;
    let hrsSTR = `0${hrs}`;
    let isTimerOn = false;
    let isTimerPaused = false;
    let timerInstance;
    let timerText = document.createElement("h5");
    timerText.innerText = `Time: ${hrsSTR}:${minsSTR}:${secsSTR}`;
    timerText.style.color = "green";
    document.querySelector(".navbar").insertAdjacentElement("afterend", timerText);

    function timePartsToStrings() {
        if(secs < 10) {
            secsSTR = `0${secs}`;
        }
        else {
            secsSTR = secs;
        }
        if(mins < 10) {
            minsSTR = `0${mins}`;
        }
        else {
            minsSTR = mins;
        }
        if(hrs < 10) {
            hrsSTR = `0${hrs}`;
        }
        else {
            hrsSTR = hrs;
        }
    }

    function updateTimer() {
        if(isTimerOn) {
            secs++;
            if(secs === 60) {
                mins++;
                secs = 0;
                if(mins === 60) {
                    hrs++;
                    mins = 0;
                }
            }
            timePartsToStrings();
            timerText.innerText = `Time: ${hrsSTR}:${minsSTR}:${secsSTR}`;
            if(isTimerOn && !isTimerPaused) {
                timerInstance = setTimeout(() => {
                    updateTimer();
                }, 1000);
            }
        }
        else {
            secs = 0;
            mins = 0;
            hrs = 0;
            secsSTR = `0${secs}`;
            minsSTR = `0${mins}`;
            hrsSTR = `0${hrs}`;
            timerText.innerText = `Time: ${hrsSTR}:${minsSTR}:${secsSTR}`;
        }
    }

    document.addEventListener('keydown', (event) => {
        if(event.key === 'S' || event.key === 's') {
            if(isTimerOn) {
                isTimerOn = false;
                secs = 0;
                mins = 0;
                hrs = 0;
                secsSTR = `0${secs}`;
                minsSTR = `0${mins}`;
                hrsSTR = `0${hrs}`;
            }
            else {
                isTimerOn = true;
                timerInstance = setTimeout(() => {
                    updateTimer();
                }, 1000)
            }
        }
        if(event.key === 'P' || event.key === 'p') {
            if(isTimerPaused) {
                isTimerPaused = false;
                clearTimeout(timerInstance);
                updateTimer();
            }
            else {
                isTimerPaused = true;
            }
        }
    });
})();
