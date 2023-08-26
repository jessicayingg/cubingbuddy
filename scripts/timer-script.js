// VARIABLES

// For HTML elmeents that will be altered
const stopwatchDisplay = document.querySelector('.js-display');
const timesDisplay = document.querySelector('.js-times');
const pbDisplay = document.querySelector('.js-pbs');

const inputElement = document.querySelector('.js-user-input');
const enterButton = document.querySelector('.js-manual-result');

const dropDownElement = document.querySelector('.js-dropdown');
const curPageButton = document.querySelector('.js-selected-button');
const otherPageButton = document.querySelector('.js-other-button');
const scramblePage = document.querySelector('.js-scramble-container');
const goalsPage = document.querySelector('.js-goals');
const goalsPage1 = document.querySelector('.js-goals-first-page');
const goalsPage2 = document.querySelector('.js-goals-second-page');

const logoButton = document.querySelector('.js-logo');

const scrambleElement = document.querySelector('.js-scramble');
const nextButton = document.querySelector('.js-next');
const prevButton = document.querySelector('.js-prev');
const prevIconElement = document.querySelector('.js-prev-icon');

const sidebar = document.querySelector('.js-sidebar');
const sidebarCover = document.querySelector('.js-cover');

const ao5SetButton = document.querySelector('.js-ao5');
const ao12SetButton = document.querySelector('.js-ao12');
const ao100SetButton = document.querySelector('.js-ao100');

const numGoalCover = document.querySelector('.js-num-goal-cover');
const setsGoalCover = document.querySelector('.js-sets-goal-cover');
const restGoalCover = document.querySelector('.js-rest-goal-cover');

const setGoalButton = document.querySelector('.js-set-goal');

const firstPageButton = document.querySelector('.js-first-page');
const secondPageButton = document.querySelector('.js-second-page');

let timerIsStarted = false;

// To allow the stoppage of intervals that will be started
let timerIntervalID = 0;
let displayIntervalID = 0;

// Current exact times that are used to calculate the time on the stopwatch
let timerStartTime;
let curEndTime;

// For space bar press
let startTime;
let endTime;
let elapsedTime = 0;
let spacePressed = false;

// Turning colour from red to green - part of space bar press
let displayReadyCounter = 0;

// For storing times
let timesList = [];
let bestSingle = Number.MAX_VALUE;
let bestAo5 = Number.MAX_VALUE;
let bestAo12 = Number.MAX_VALUE;

// For averages
let curAo5List = [];
let curAo5;
let curAo12List = [];
let curAo12;

// For scramble
let lastScramble = '';

// TRYING FOR SIDEBAR
let isSidebarOpen = false;



// EVENT LISTENERS

// For general keydowns
document.body.addEventListener('keydown', (event) => {
    // Spacebar
    if(event.key === ' ') {
    
        if(!timerIsStarted) {
            // If this is the first instance of spacebar being pressed
                // If the spacebar is held down, new instances are recorded at set intervals
            if(!spacePressed) {
                // Finding the exact moment spacebar was first pressed down
                startTime = new Date().getTime();

                // Starting the red text display - not ready for timer to start
                stopwatchDisplay.classList.add('not-ready-display');

                // Counting for when the timer becomes ready to start
                readyCounter();

                // Setting space to pressed
                spacePressed = true;
            }
        }
        else {
            // Stop the timer and record the time
            startStopTimer();
            recordTime(true);
        }
    }
    // Escape resets the timer
    else if(event.key === 'Escape') {
        // Reset timer
        resetTimer();
    }
    else if(event.key === 'Enter') {
        manualAddTime();
    }
    else if(event.key === 'r') {
        getNewScramble();
    }
    else if(event.key === 'e') {
        getLastScramble();
    }
});

// For general key ups
document.body.addEventListener('keyup', (event) => {
    // Spacebar
    if(event.key === ' ') {
        // Finding how long spacebar was held down for
        endTime = new Date().getTime();
        elapsedTime = endTime - startTime;

        // If it is enough, then the timer is allowed to start
        if(elapsedTime >= 500 && spacePressed) {
            startStopTimer();
            stopwatchDisplay.classList.remove('ready-display');

        }
        // If not, don't do anything and put the timer back to its original colour
        else {
            resetReadyness();
        }

        spacePressed = false;

    }
});

/*
document.body.addEventListener('click', (event) => {
    
    if(isSidebarOpen) {
       // I set this manually, should try to change later
        if(event.pageX > 250) {
            closeSideBar();
            isSidebarOpen = false;
        }
    }
});
*/



// For the enter button
enterButton.addEventListener('click', (event) => {
    manualAddTime();
});

logoButton.addEventListener('click', (event) => {
    if(!isSidebarOpen) {
        openSideBar();
        isSidebarOpen = true;
    }
});

nextButton.addEventListener('click', (event) => {
    getNewScramble();
});

prevButton.addEventListener('click', (event) => {
    getLastScramble();
});

curPageButton.addEventListener('click', (event) => {
    otherPageButton.classList.add('other-page-button');
    otherPageButton.classList.remove('page-selected-button');

    curPageButton.classList.add('page-selected-button');
    curPageButton.classList.remove('other-page-button');

    scramblePage.classList.remove('hidden');
    goalsPage.classList.add('hidden');
    goalsPage1.classList.add('hidden');
    goalsPage2.classList.add('hidden');
});

otherPageButton.addEventListener('click', (event) => {
    curPageButton.classList.add('other-page-button');
    curPageButton.classList.remove('page-selected-button');

    otherPageButton.classList.add('page-selected-button');
    otherPageButton.classList.remove('other-page-button');

    scramblePage.classList.add('hidden');
    goalsPage.classList.remove('hidden');
    goalsPage1.classList.remove('hidden');
});

ao5SetButton.addEventListener('click', (event) => {
    ao5SetButton.classList.add('sets-options-chosen-button');
    ao12SetButton.classList.remove('sets-options-chosen-button');
    ao100SetButton.classList.remove('sets-options-chosen-button');
});

ao12SetButton.addEventListener('click', (event) => {
    ao12SetButton.classList.add('sets-options-chosen-button');
    ao5SetButton.classList.remove('sets-options-chosen-button');
    ao100SetButton.classList.remove('sets-options-chosen-button');
});

ao100SetButton.addEventListener('click', (event) => {
    ao100SetButton.classList.add('sets-options-chosen-button');
    ao5SetButton.classList.remove('sets-options-chosen-button');
    ao12SetButton.classList.remove('sets-options-chosen-button');
});

numGoalCover.addEventListener('click', (event) => {
    numGoalCover.classList.add('hidden');
    setsGoalCover.classList.remove('hidden');
    restGoalCover.classList.remove('hidden');
});

setsGoalCover.addEventListener('click', (event) => {
    setsGoalCover.classList.add('hidden');
    numGoalCover.classList.remove('hidden');
    restGoalCover.classList.remove('hidden');
});

restGoalCover.addEventListener('click', (event) => {
    restGoalCover.classList.add('hidden');
    numGoalCover.classList.remove('hidden');
    setsGoalCover.classList.remove('hidden');
});

sidebarCover.addEventListener('click', (event) => {
    closeSideBar();
    isSidebarOpen = false;
});

firstPageButton.addEventListener('click', (event) => {
    goalsPage1.classList.remove('hidden');
    goalsPage2.classList.add('hidden');

    firstPageButton.classList.remove('not-cur-page');
    secondPageButton.classList.add('not-cur-page');
});

secondPageButton.addEventListener('click', (event) => {
    goalsPage2.classList.remove('hidden');
    goalsPage1.classList.add('hidden');

    secondPageButton.classList.remove('not-cur-page');
    firstPageButton.classList.add('not-cur-page');
});

// Starting and stopping timer
function startStopTimer() {
    
    // To start the timer
    if(!timerIsStarted) {
        // Changing text in start/stop button

        timerIsStarted = true;

        // Recording when the timer was started
        timerStartTime = new Date().getTime();

        // Starting the timer count
        countMillis();
    }
    // To stop the timer
    else {
        // Changing the text in start/stop button
        timerIsStarted = false;

        // Clearing the timer counting interval to stop it
        clearInterval(timerIntervalID);
    }
}

// Resetting time
function resetTimer() {
    // If the timer is running, stop it
    if(timerIsStarted) {
        startStopTimer();
    }

    // Setting time to 0.000
    curEndTime = timerStartTime;
    displayTime();
}

// Doing the millisecond counting
function countMillis() {
    // Refreshes every 10 ms
    timerIntervalID = setInterval(() => {

        // Finding the current time
        curEndTime = new Date().getTime();

        displayTime();

    }, 10);
}

// Displaying the time
function displayTime() {

    // The elapsed time between current and the starting,
    // converted to seconds and put to 3 decimal places
    let curTime = ((curEndTime - timerStartTime)/1000).toFixed(3);

    // Updating the display's HTML
    stopwatchDisplay.innerHTML = curTime;
}

// Counting for seeing if the timer is ready
function readyCounter() {
    // Counts every 10 ms
    displayIntervalID = setInterval(() => {

        if(displayReadyCounter < 500) {
            displayReadyCounter += 10;
        }
        else {
            // After 500 ms, the display turns from red to green and the interval is stopped
            stopwatchDisplay.classList.remove('not-ready-display');
            stopwatchDisplay.classList.add('ready-display');
            clearInterval(displayIntervalID);
            displayReadyCounter = 0;
        }

    }, 10);
}

function resetReadyness() {
    // Resets the display and any active intervals
    spacePressed = false;
    displayReadyCounter = 0;
    stopwatchDisplay.classList.remove('not-ready-display');
    stopwatchDisplay.classList.remove('ready-display');
    clearInterval(displayIntervalID);
}

// Recording the time into total time list
function recordTime(fromTimer) {
    
    let curTime = 0;

    // Adding the current time to total time array
    if(fromTimer) {
       curTime = Number(stopwatchDisplay.innerHTML);
    }
    else {
        curTime = Number(inputElement.value);
    }

    timesList.push(curTime);

    // Finding the fastest single
    if(curTime < bestSingle) {
        bestSingle = curTime;
    }

    // Adding to ao5
    if(curAo5List.length < 5) {
        // Just adding if less than 5 solves recorded
        curAo5List.push(curTime);
    }
    else {
        // Delete first solve, add on the new one
        curAo5List.splice(0, 1);
        curAo5List.push(curTime);
    }

    // Adding to ao12
    if(curAo12List.length < 12) {
        // Just adding if less than 5 solves recorded
        curAo12List.push(curTime);
    }
    else {
        // Delete first solve, add on the new one
        curAo12List.splice(0, 1);
        curAo12List.push(curTime);
    }

    console.log(timesList);
    console.log('Best single: ' + bestSingle);
    console.log(curAo5List);

    findAverageOf5();
    findAverageOf12();
    //addTimes();
    addTime();
    addPbs();

    getNewScramble();
}

// To find average of 5
function findAverageOf5() {
    let total = 0;
    let highest = curAo5List[0];
    let lowest = curAo5List[0];
    let cur = 0;
    
    if(curAo5List.length >= 5) {
        for(let i = 0; i < 5; i++) {
            cur = curAo5List[i];

            total += cur;

            if(cur > highest) {
                highest = cur;
            }
            else if(cur < lowest) {
                lowest = cur;
            }

        }

        total -= (highest + lowest);
        curAo5 = (total/3).toFixed(2);
    }

    // find best average
    if(curAo5 < bestAo5) {
        bestAo5 = curAo5;
    }
}

// To find average of 12
function findAverageOf12() {
    let total = 0;
    let highest = curAo12List[0];
    let lowest = curAo12List[0];
    let cur = 0;
    
    if(curAo12List.length >= 12) {
        for(let i = 0; i < 12; i++) {
            cur = curAo12List[i];

            total += cur;

            if(cur > highest) {
                highest = cur;
            }
            else if(cur < lowest) {
                lowest = cur;
            }

        }

        total -= (highest + lowest);
        curAo12 = (total/10).toFixed(2);
    }

    // find best average
    if(curAo12 < bestAo12) {
        bestAo12 = curAo12;
    }
}


function addTime() {
    let HTMLToAdd = '';

    if(curAo5List.length < 5) {
        HTMLToAdd = `
        <p class="num">${timesList.length}</p>
        <p class="time">${timesList[timesList.length-1].toFixed(3)}</p>
        <p class="average">-</p>
    `;
    }
    else {
        HTMLToAdd = `
        <p class="num">${timesList.length}</p>
        <p class="time">${timesList[timesList.length-1].toFixed(3)}</p>
        <p class="average">${curAo5}</p>
    `;
    }
 
     timesDisplay.innerHTML = HTMLToAdd + timesDisplay.innerHTML;

 }

 function manualAddTime() {
    // isNaN --> is not a number
    if(!isNaN(inputElement.value) && Number(inputElement.value) != 0) {
        recordTime(false);
    }

    inputElement.value = '';
 }

 // OPENING SIDE BAR
 function openSideBar() {
    sidebar.classList.remove('hidden');
    sidebarCover.classList.remove('hidden');
 }

 // CLOSING SIDE BAR
 function closeSideBar() {
    sidebar.classList.add('hidden');
    sidebarCover.classList.add('hidden');
 }











 // CS TIMER STUFF


//initialize the scramble provider worker
var cstimerScrambler = (function() {
	if (!window.Worker) { // not available due to browser capability
		return {};
	}
	var worker = new Worker('/scripts/cstimer.js');
	var callbacks = {};
	var msgid = 0;

	worker.onmessage = function(e) {
		//data: [msgid, type, ret]
		var data = e.data;
		var callback = callbacks[data[0]];
		delete callbacks[data[0]];
		callback && callback(data[2]);
	}

	//[type, length, state]
	function getScramble(args, callback) {
		++msgid;
		callbacks[msgid] = callback;
		worker.postMessage([msgid, 'scramble', args]);
		return msgid;
	}

	return {
		getScramble: getScramble
	}
})();

// HERE
cstimerScrambler.getScramble(['333'], function(scramble) {
    scrambleElement.innerHTML = scramble;
});

// cstimerScrambler.getScramble(scrambleArgs, callback);
// scrambleArgs: [scramble type, scramble length (can be ignored for some scramble types), specific state (for oll, pll, etc) or undefined]
// callback: callback function with one parameter, which is the generated scramble.

// Type    Description
// 333     3x3x3 random state scramble
// 222so   2x2x2 random state scramble with wca restriction
// 444wca  4x4x4 random state scramble, WCA Notation
// 555wca  5x5x5 random move scramble, WCA Notation
// 666wca  6x6x6 random move scramble, WCA Notation
// 777wca  7x7x7 random move scramble, WCA Notation
// 333ni   3x3x3 random move scramble with random orientation
// clkwca  clock random state scramble, wca notation
// mgmp    megaminx random move scramble, wca notation
// pyrso   pyraminx random state scramble with wca restriction
// skbso   skewb random state scramble with wca restriction
// 444bld  4x4x4 random state scramble with random orientation, WCA Notation
// 555bld  5x5x5 random move scramble with random orientation, WCA Notation
// r3ni    multiple 3x3x3 random state scramble with random orientation, use length to indicate number of cubes.

function getNewScramble() {
    
    lastScramble = scrambleElement.innerHTML;

    if(dropDownElement.value === '3x3') {
        cstimerScrambler.getScramble(['333'], function(scramble) {
            scrambleElement.innerHTML = scramble;
        });
    }
    else if(dropDownElement.value === 'Pyraminx') {
        cstimerScrambler.getScramble(['pyrso'], function(scramble) {
            scrambleElement.innerHTML = scramble;
        });
    }
    else if(dropDownElement.value === 'Skewb') {
        cstimerScrambler.getScramble(['skbso'], function(scramble) {
            scrambleElement.innerHTML = scramble;
        });
    }
    else if(dropDownElement.value === '2x2') {
        cstimerScrambler.getScramble(['222so'], function(scramble) {
            scrambleElement.innerHTML = scramble;
        });
    }
    else if(dropDownElement.value === '4x4') {
        cstimerScrambler.getScramble(['444'], function(scramble) {
            scrambleElement.innerHTML = scramble;
        });
    }
    else {
        scrambleElement.innerHTML = '-';
    }

    prevIconElement.classList.remove('no-prev-scramble');
}

function getLastScramble() {
    if(lastScramble != '') {
        scrambleElement.innerHTML = lastScramble;
        lastScramble = '';
        prevIconElement.classList.add('no-prev-scramble');
    }
}

function addPbs() {
    let HTMLToAdd2 = '';

    if(curAo12List.length >= 12) {
        HTMLToAdd2 += `
        <p class="pb-text">${bestSingle}</p>
        <p class="pb-text">Single</p>
        <p class="pb-text">${bestAo5}</p>
        <p class="pb-text">Ao5</p>
        <p class="pb-text">${bestAo12}</p>
        <p class="pb-text">Ao12</p>
    `;
    }
    else if(curAo5List.length >= 5) {
        HTMLToAdd2 += `
        <p class="pb-text">${bestSingle}</p>
        <p class="pb-text">Single</p>
        <p class="pb-text">${bestAo5}</p>
        <p class="pb-text">Ao5</p>
        <p class="pb-text">-</p>
        <p class="pb-text">Ao12</p>
    `;
    }
    else {
        HTMLToAdd2 += `
        <p class="pb-text">${bestSingle.toFixed(2)}</p>
        <p class="pb-text">Single</p>
        <p class="pb-text">-</p>
        <p class="pb-text">Ao5</p>
        <p class="pb-text">-</p>
        <p class="pb-text">Ao12</p>
    `;
    }

    pbDisplay.innerHTML = HTMLToAdd2;
}