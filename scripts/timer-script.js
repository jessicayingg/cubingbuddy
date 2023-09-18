// VARIABLES

// CONSTANTS FOR HTML ELEMENTS
// Displays
const stopwatchDisplay = document.querySelector('.js-display');
const timesDisplay = document.querySelector('.js-times');
const pbDisplay = document.querySelector('.js-pbs');

// Manual time input
const inputElement = document.querySelector('.js-user-input');
const enterButton = document.querySelector('.js-manual-result');

// For the scramble/goals section
const dropDownElement = document.querySelector('.js-dropdown');
const curPageButton = document.querySelector('.js-selected-button');
const otherPageButton = document.querySelector('.js-other-button');
const scramblePage = document.querySelector('.js-scramble-container');
const goalsPage = document.querySelector('.js-goals');
const goalsPage1 = document.querySelector('.js-goals-first-page');
const goalsPage2 = document.querySelector('.js-goals-second-page');

const ao5SetButton = document.querySelector('.js-ao5');
const ao12SetButton = document.querySelector('.js-ao12');
const ao100SetButton = document.querySelector('.js-ao100');

const numGoalCover = document.querySelector('.js-num-goal-cover');
const setsGoalCover = document.querySelector('.js-sets-goal-cover');
const restGoalCover = document.querySelector('.js-rest-goal-cover');

const setGoalButton = document.querySelector('.js-set-goal');
const resetGoalButton = document.querySelector('.js-reset-goal');

const firstPageButton = document.querySelector('.js-first-page');
const secondPageButton = document.querySelector('.js-second-page');

const numSolvesInput = document.querySelector('.js-num-solves-input');
const numSetsInput = document.querySelector('.js-num-sets-input');
const numRestSolvesInput = document.querySelector('.js-num-rest-solves-input');
const restDurationInput = document.querySelector('.js-rest-duration-input');

const curGoalDisplay = document.querySelector('.js-cur-goal');
const goalProgressDisplay = document.querySelector('.js-goal-progress');
const extraGoalProgressDisplay = document.querySelector('.js-extra-progress');

// Scramble box
const scrambleElement = document.querySelector('.js-scramble');
const nextButton = document.querySelector('.js-next');
const prevButton = document.querySelector('.js-prev');
const prevIconElement = document.querySelector('.js-prev-icon');

// Logo and sidebar
const logoButton = document.querySelector('.js-logo');
const sidebar = document.querySelector('.js-sidebar');

// Full screen gray out
const screenCover = document.querySelector('.js-cover');
const screenAlert = document.querySelector('.js-alert');

// Buddy + speech bubble
const buddyImage = document.querySelector('.js-buddy');
const speechBubbleContainer = document.querySelector('.js-speech-bubble-container');
const speechBubble = document.querySelector('.js-speech-bubble');
const speechBubbleText = document.querySelector('.js-bubble-text');

const pbSingleButton = document.querySelector('.js-pb-single-button');
const pbAo5Button = document.querySelector('.js-pb-ao5-button');
const pbAo12Button = document.querySelector('.js-pb-ao12-button');
const pbAo100Button = document.querySelector('.js-pb-ao100-button');

const xButton = document.querySelector('.js-x-button');
const pbPopup = document.querySelector('.js-pb-popup');
const pbPopupTitle = document.querySelector('.js-pb-popup-title');
const pbPopupTimes = document.querySelector('.js-pb-popup-times');
const pbPopupScrambles = document.querySelector('.js-pb-popup-scrambles');

// VARIABLES

// Interval IDs
let timerIntervalID = 0;
let displayIntervalID = 0;
let buddyRotateIntervalID = 0;
let buddySpeedIntervalID = 0;

// Timer started
let timerIsStarted = false;

// For space bar press
let startTime;
let endTime;
let elapsedTime = 0;
let spacePressed = false;
// Turning colour from red to green - part of space bar press
let displayReadyCounter = 0;

// Current exact times that are used to calculate the time on the stopwatch
let timerStartTime;
let curEndTime;

// For storing times
let timesList = [];
//let bestSingle = Number.MAX_VALUE;
let bestSingle = {
    time: Number.MAX_VALUE,
    scramble: ''
};
//let bestAo5 = Number.MAX_VALUE;
let bestAo5 = {
    time: Number.MAX_VALUE,
    scrambles: []
};
//let bestAo12 = Number.MAX_VALUE;
let bestAo12 = {
    time: Number.MAX_VALUE,
    scrambles: []
};
//let bestAo100 = Number.MAX_VALUE;
let bestAo100 = {
    time: Number.MAX_VALUE,
    scrambles: []
};

// For averages
let curAo5List = [];
let curAo5;
let curAo12List = [];
let curAo12;
let curAo100List = [];
let curAo100;

// For scramble
let lastScramble = '';

let curScramble = '';
let cur5Scramble = [];
let cur12Scramble = [];
let cur100Scramble = [];

// TRYING FOR SIDEBAR
let isSidebarOpen = false;

// For goals
let curGoalType = '';
let numSolvesToComplete = 0;
let setType = 0;
let restDuration = 0;
let numSolvesCompleted = 0;
let goalSet = false;
let restStarted = false;

// Random number for displaying encouraging messages
let randNumRolled = false;
let randNumCounter = 0;
let randNum = 0;

// List of encouraging messages
let encMessages = [
    "You're doing great!",
    "Awesome session!",
    "I'm here for you!",
    "You got this!"
];



// EVENT LISTENERS

// For general keydowns
document.body.addEventListener('keydown', (event) => {
    if(!restStarted)
    {
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
                
                // Track goal
                trackGoal();

                // Track display of encouraging message
                displayEncouragingMessage();
            }
        }
        // Escape
        else if(event.key === 'Escape') {
            resetTimer();
        }
        // Enter
        else if(event.key === 'Enter') {
            manualAddTime();
        }
        // R key
        else if(event.key === 'r') {
            getNewScramble();
        }
        // E key
        else if(event.key === 'e') {
            getLastScramble();
        }
        else if(event.key === 'j') {
            resetAllTimes();
        }
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

// Enter button
enterButton.addEventListener('click', (event) => {
    manualAddTime();
});

// Logo
logoButton.addEventListener('click', (event) => {
    if(!isSidebarOpen) {
        openSideBar();
        isSidebarOpen = true;
    }
});

// Next button for scramble
nextButton.addEventListener('click', (event) => {
    getNewScramble();
});

// Back button for scramble
prevButton.addEventListener('click', (event) => {
    getLastScramble();
});

// Draw scramble page
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

// Set goals page
otherPageButton.addEventListener('click', (event) => {
    curPageButton.classList.add('other-page-button');
    curPageButton.classList.remove('page-selected-button');

    otherPageButton.classList.add('page-selected-button');
    otherPageButton.classList.remove('other-page-button');

    scramblePage.classList.add('hidden');
    goalsPage.classList.remove('hidden');
    goalsPage1.classList.remove('hidden');

    firstPageButton.classList.remove('not-cur-page');
    secondPageButton.classList.add('not-cur-page');
});

// Set for average of 5 button
ao5SetButton.addEventListener('click', (event) => {
    ao5SetButton.classList.add('sets-options-chosen-button');
    ao12SetButton.classList.remove('sets-options-chosen-button');
    ao100SetButton.classList.remove('sets-options-chosen-button');
});

// Set for average of 12 button
ao12SetButton.addEventListener('click', (event) => {
    ao12SetButton.classList.add('sets-options-chosen-button');
    ao5SetButton.classList.remove('sets-options-chosen-button');
    ao100SetButton.classList.remove('sets-options-chosen-button');
});

// Set for average of 100 button
ao100SetButton.addEventListener('click', (event) => {
    ao100SetButton.classList.add('sets-options-chosen-button');
    ao5SetButton.classList.remove('sets-options-chosen-button');
    ao12SetButton.classList.remove('sets-options-chosen-button');
});

// Grayed out num solves container
numGoalCover.addEventListener('click', (event) => {
    numGoalCover.classList.add('hidden');
    setsGoalCover.classList.remove('hidden');
    restGoalCover.classList.remove('hidden');
});

// Grayed out sets container
setsGoalCover.addEventListener('click', (event) => {
    setsGoalCover.classList.add('hidden');
    numGoalCover.classList.remove('hidden');
    restGoalCover.classList.remove('hidden');
});

// Grayed out rest container
restGoalCover.addEventListener('click', (event) => {
    restGoalCover.classList.add('hidden');
    numGoalCover.classList.remove('hidden');
    setsGoalCover.classList.remove('hidden');
});

// Grayed out full screen
screenCover.addEventListener('click', (event) => {
    // Only for sidebar
    if(isSidebarOpen) {
        closeSideBar();
        isSidebarOpen = false;
    }
});

// Set goals first page (goal set options)
firstPageButton.addEventListener('click', (event) => {
    goalsPage1.classList.remove('hidden');
    goalsPage2.classList.add('hidden');

    firstPageButton.classList.remove('not-cur-page');
    secondPageButton.classList.add('not-cur-page');
});

// Set goals second page (goal tracker)
secondPageButton.addEventListener('click', (event) => {
    goalsPage2.classList.remove('hidden');
    goalsPage1.classList.add('hidden');

    secondPageButton.classList.remove('not-cur-page');
    firstPageButton.classList.add('not-cur-page');
});

// Set goal button 
setGoalButton.addEventListener('click', (event) => {
    clearGoalDisplay();
    resetGoalStats();
    setGoal();
});

// Reset goal butotn
resetGoalButton.addEventListener('click', (event) => {
    resetGoals();
    clearGoalDisplay();

    showSpeechBubble('All goals reset!');
});

// The walking buddy
buddyImage.addEventListener('click', (event) => {
    showSpeechBubble("I'm your cubing buddy!");
});

pbSingleButton.addEventListener('click', (event) => {
    showPbDetails(1);
});

pbAo5Button.addEventListener('click', (event) => {
    showPbDetails(5);
});

pbAo12Button.addEventListener('click', (event) => {
    showPbDetails(12);
});

pbAo100Button.addEventListener('click', (event) => {
    showPbDetails(100);
});

xButton.addEventListener('click', (event) => {
    pbPopup.classList.add('hidden');
    screenCover.classList.add('hidden');
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

// Resets the display and any active intervals
function resetReadyness() {
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

    curTime = parseFloat(trunTo2(curTime));

    timesList.push(curTime);

    // Finding the fastest single
    if(curTime < bestSingle.time) {
        bestSingle.time = curTime;
        bestSingle.scramble = curScramble;

        showSpeechBubble('New best single!');
    }

    // Adding to ao5
    if(curAo5List.length < 5) {
        // Just adding if less than 5 solves recorded
        curAo5List.push(curTime);

        cur5Scramble.push(curScramble);
    }
    else {
        // Delete first solve, add on the new one
        curAo5List.splice(0, 1);
        curAo5List.push(curTime);

        cur5Scramble.splice(0, 1);
        cur5Scramble.push(curScramble);
    }

    // Adding to ao12
    if(curAo12List.length < 12) {
        // Just adding if less than 12 solves recorded
        curAo12List.push(curTime);

        cur12Scramble.push(curScramble);
    }
    else {
        // Delete first solve, add on the new one
        curAo12List.splice(0, 1);
        curAo12List.push(curTime);

        cur12Scramble.splice(0, 1);
        cur12Scramble.push(curScramble);
    }

    // Adding to ao100
    if(curAo100List.length < 100) {
        // Just adding if less than 100 solves recorded
        curAo100List.push(curTime);

        cur100Scramble.push(curScramble);
    }
    else {
        // Delete first solve, add on the new one
        curAo100List.splice(0, 1);
        curAo100List.push(curTime);

        cur100Scramble.splice(0, 1);
        cur100Scramble.push(curScramble);
    }

    /*
    console.log(timesList);
    console.log('Best single: ' + bestSingle);
    console.log(curAo5List);
    */

    // Averages
    findAverageOf5();
    findAverageOf12();
    findAverageOf100();

    // Times and pbs
    addTime();
    displayPBs();

    // Generate new scramble
    getNewScramble();
}

function trunTo2(num) {
    let numStr = num + '';

    numStr = numStr.substring(0, numStr.indexOf('.')+3);

    return parseFloat(numStr);
}

// To find average of 5
function findAverageOf5() {
    // Local variables
    let total = 0;
    let highest = curAo5List[0];
    let lowest = curAo5List[0];
    let cur = 0;
    
    // Only find the average if there are more than 5 solves completed
    if(curAo5List.length >= 5) {
        
        // Find current average
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

    // Find best average
    if(curAo5 < bestAo5.time) {
        bestAo5.time = curAo5;
        bestAo5.scrambles = cur5Scramble;

        showSpeechBubble('New best average of 5!');
    }
}

// To find average of 12
function findAverageOf12() {
    // Local variables
    let total = 0;
    let highest = curAo12List[0];
    let lowest = curAo12List[0];
    let cur = 0;
    
    // Only find the average if there are more htan 12 solves completed
    if(curAo12List.length >= 12) {
        
        // Find current average
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

    // Find best average
    if(curAo12 < bestAo12.time) {
        bestAo12.time = curAo12;
        bestAo12.scrambles = cur12Scramble;

        showSpeechBubble('New best average of 12!');
    }
}

// To find average of 100
function findAverageOf100() {
    // Local variables
    let total = 0;
    let highest = curAo100List[0];
    let lowest = curAo100List[0];
    let cur = 0;
    
    // Only find the average if there are more htan 12 solves completed
    if(curAo100List.length >= 100) {
        
        // Find current average
        for(let i = 0; i < 100; i++) {
            cur = curAo100List[i];

            total += cur;

            if(cur > highest) {
                highest = cur;
            }
            else if(cur < lowest) {
                lowest = cur;
            }
        }

        total -= (highest + lowest);
        curAo100 = (total/98).toFixed(2);
    }

    // Find best average
    if(curAo100 < bestAo100.time) {
        bestAo100.time = curAo100;
        bestAo100.scrambles = cur100Scramble;

        showSpeechBubble('New best average of 100!');
    }
}

// Add time to the times list display
// Things to add: nth solve   solve time      current average
function addTime() {
    
    let HTMLToAdd = '';

    // If there aren't enough solves for a current average of 5
    if(curAo5List.length < 5) {
        HTMLToAdd = `
        <p class="num">${timesList.length}</p>
        <p class="time">${timesList[timesList.length-1].toFixed(2)}</p>
        <p class="average">-</p>
    `;
    }
    // With current average of 5
    else {
        HTMLToAdd = `
        <p class="num">${timesList.length}</p>
        <p class="time">${timesList[timesList.length-1].toFixed(2)}</p>
        <p class="average">${curAo5}</p>
    `;
    }
 
     timesDisplay.innerHTML = HTMLToAdd + timesDisplay.innerHTML;
 }

 // For adding a new time in manually
 function manualAddTime() {
    // isNaN --> is not a number
    if(!isNaN(inputElement.value) && Number(inputElement.value) != 0) {
        recordTime(false);
        trackGoal();
        displayEncouragingMessage();
    }

    inputElement.value = '';
 }

 // OPENING SIDE BAR
 function openSideBar() {
    sidebar.classList.remove('hidden');
    screenCover.classList.remove('hidden');
 }

 // CLOSING SIDE BAR
 function closeSideBar() {
    sidebar.classList.add('hidden');
    screenCover.classList.add('hidden');
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
    curScramble = scramble;
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

// Gets the next scramble
function getNewScramble() {
    
    // Save the last scramble just in case the user wants to go back
    lastScramble = scrambleElement.innerHTML;

    // Get different scrambles based on what the drop down element is selected on
    if(dropDownElement.value === '3x3') {
        cstimerScrambler.getScramble(['333'], function(scramble) {
            scrambleElement.innerHTML = scramble;
            curScramble = scramble;
        });
    }
    else if(dropDownElement.value === 'Pyraminx') {
        cstimerScrambler.getScramble(['pyrso'], function(scramble) {
            scrambleElement.innerHTML = scramble;
            curScramble = scramble;
        });
    }
    else if(dropDownElement.value === 'Skewb') {
        cstimerScrambler.getScramble(['skbso'], function(scramble) {
            scrambleElement.innerHTML = scramble;
            curScramble = scramble;
        });
    }
    else if(dropDownElement.value === '2x2') {
        cstimerScrambler.getScramble(['222so'], function(scramble) {
            scrambleElement.innerHTML = scramble;
            curScramble = scramble;
        });
    }
    else if(dropDownElement.value === '4x4') {
        cstimerScrambler.getScramble(['444wca'], function(scramble) {
            scrambleElement.innerHTML = scramble;
            curScramble = scramble;
        });
    }
    else if(dropDownElement.value === '5x5') {
        cstimerScrambler.getScramble(['555wca', 60], function(scramble) {
            scrambleElement.innerHTML = scramble;
            curScramble = scramble;
        });
    }
    else if(dropDownElement.value === 'Square-1') {
        cstimerScrambler.getScramble(['sqrs'], function(scramble) {
            scrambleElement.innerHTML = scramble;
            curScramble = scramble;
        });
    }
    else if(dropDownElement.value === 'Clock') {
        cstimerScrambler.getScramble(['clkwca'], function(scramble) {
            scrambleElement.innerHTML = scramble;
            curScramble = scramble;
        });
    }
    else if(dropDownElement.value === 'Megaminx') {
        cstimerScrambler.getScramble(['mgmp', 77], function(scramble) {
            scrambleElement.innerHTML = scramble;
            curScramble = scramble;
        });
    }
    else {
        scrambleElement.innerHTML = '-';
    }

    // Show that there is a previous scramble to go back to
    prevIconElement.classList.remove('no-prev-scramble');
}

// Gets the previous scramble
function getLastScramble() {
    if(lastScramble != '') {
        scrambleElement.innerHTML = lastScramble;
        lastScramble = '';
        prevIconElement.classList.add('no-prev-scramble');
    }
}

function displayPBs() {

    if(curAo100List.length >= 100) {
        pbSingleButton.innerHTML = `<p class="js-pb-single pb-text">${bestSingle.time}</p>`;
        pbAo5Button.innerHTML = `<p class="js-pb-single pb-text">${bestAo5.time}</p>`;
        pbAo12Button.innerHTML = `<p class="js-pb-single pb-text">${bestAo12.time}</p>`;
        pbAo100Button.innerHTML = `<p class="js-pb-single pb-text">${bestAo100.time}</p>`;
    }
    // If there is 12+ solves
    else if(curAo12List.length >= 12) {
        pbSingleButton.innerHTML = `<p class="js-pb-single pb-text">${bestSingle.time}</p>`;
        pbAo5Button.innerHTML = `<p class="js-pb-single pb-text">${bestAo5.time}</p>`;
        pbAo12Button.innerHTML = `<p class="js-pb-single pb-text">${bestAo12.time}</p>`;
    }
    // If there is 5+ solves
    else if(curAo5List.length >= 5) {
        pbSingleButton.innerHTML = `<p class="js-pb-single pb-text">${bestSingle.time}</p>`;
        pbAo5Button.innerHTML = `<p class="js-pb-single pb-text">${bestAo5.time}</p>`;
    }
    // Less than 5 solves
    else {
        pbSingleButton.innerHTML = `<p class="js-pb-single pb-text">${bestSingle.time}</p>`;
    }
}

// This activates after pressing the set goal button and sets the goal selected
function setGoal() {
    let invalidGoal = false;

    // Num goal selected
    if(numGoalCover.classList.contains('hidden')) {
        curGoalType = 'num';
        numSolvesToComplete = numSolvesInput.value;
    }
    // Sets goal selected
    else if(setsGoalCover.classList.contains('hidden')) {
        curGoalType = 'sets';
        
        if(ao5SetButton.classList.contains('sets-options-chosen-button')) {
            setType = 5;
        }
        else if(ao12SetButton.classList.contains('sets-options-chosen-button')) {
            setType = 12;
        }
        else if(ao100SetButton.classList.contains('sets-options-chosen-button')) {
            setType = 100;
        }

        numSolvesToComplete = numSetsInput.value * setType;
    }
    // Rest goal selected
    else if(restGoalCover.classList.contains('hidden')) {
        curGoalType = 'rest';
        numSolvesToComplete = numRestSolvesInput.value;
        restDuration = restDurationInput.value;
    }
    // Nothing selected
    else {
        invalidGoal = true;
    }

    // If there are 0 solves (no number was put in the input)
    if(numSolvesToComplete == 0) {
        invalidGoal = true;
        resetGoals();
    }

    /*
    console.log(curGoalType);
    console.log(numSolvesToComplete);
    console.log(restDuration);
    */

    // Buddy  messages
    if(invalidGoal) {
        showSpeechBubble('Invalid goal :(');
    }
    else {
        showSpeechBubble('Goal set!');
    }
}

// This resets all goal-related displays/variables
function resetGoals() {
    curGoalType = '';
    numSolvesToComplete = 0;
    numSolvesCompleted = 0;
    restDuration = 0;
    setType = 0;

    numGoalCover.classList.remove('hidden');
    setsGoalCover.classList.remove('hidden');
    restGoalCover.classList.remove('hidden');

    numSolvesInput.value = 0;
    numSetsInput.value = 0;
    numRestSolvesInput.value = 0;
    restDurationInput.value = 0;

    ao5SetButton.classList.remove('sets-options-chosen-button');
    ao12SetButton.classList.remove('sets-options-chosen-button');
    ao100SetButton.classList.remove('sets-options-chosen-button');
}

// This resets just the goal-related variables
function resetGoalStats() {
    curGoalType = '';
    numSolvesToComplete = 0;
    numSolvesCompleted = 0;
    restDuration = 0;
    setType = 0;
}

// This function deals with tracking goal progress
function trackGoal() {
    
    if(curGoalType != '') {
        numSolvesCompleted++;

        displayGoalStats();

        // Num goal
        if(curGoalType === 'num') {
            if(numSolvesCompleted == numSolvesToComplete) {
                console.log('goal completed!');

                showSpeechBubble('Goal completed!');

                resetGoals();
            }
    
        }
        // Sets goal
        else if(curGoalType === 'sets') {
            // After a completed set
            if(numSolvesCompleted % setType === 0) {
                console.log(numSolvesCompleted/setType + ' sets completed!');

                showSpeechBubble(numSolvesCompleted/setType + '/' + numSolvesToComplete/setType + ' sets completed!');
            }
    
            // Full goal completed
            if(numSolvesCompleted == numSolvesToComplete) {
                console.log('goal completed!');

                showSpeechBubble('Goal completed!');
    
                resetGoals();
            }
        }
        // Rest goal
        else if(curGoalType === 'rest') {
            if(numSolvesCompleted == numSolvesToComplete) {
                console.log('rest');

                goalProgressDisplay.innerHTML = numSolvesCompleted + '/' + numSolvesToComplete + ' solves... REST NOW';
                screenCover.classList.remove('hidden');

                numSolvesCompleted = 0;
                restStarted = true;

                showSpeechBubble('Rest starting!');

                // Start again after rest is finished
                setTimeout(() => {
                    screenCover.classList.add('hidden');
                    goalProgressDisplay.innerHTML = 'Starting cycle again... ';
                    restStarted = false;
                    showSpeechBubble('Rest done!');
                }, restDuration*1000);
                
            }
        }

    }

}

// This displays the goal progress in the second page of the goals tab
function displayGoalStats() {

    // Num goal
    if(curGoalType === 'num') {
        curGoalDisplay.innerHTML = numSolvesToComplete + ' solves';
        goalProgressDisplay.innerHTML = numSolvesCompleted + '/' + numSolvesToComplete + ' solves';
    }
    // Sets goal
    else if(curGoalType === 'sets') {
        curGoalDisplay.innerHTML = (numSolvesToComplete / setType) + ' sets (' + numSolvesToComplete + ' solves)';
        goalProgressDisplay.innerHTML = numSolvesCompleted + '/' + numSolvesToComplete + ' solves';

        // Show average of the set
        if(numSolvesCompleted % setType === 0) {
            if(setType == 5) {
                extraGoalProgressDisplay.innerHTML = 'Set #' + (numSolvesCompleted/setType) + ' average: ' + curAo5;
            }
            else if(setType == 12) {
                extraGoalProgressDisplay.innerHTML = 'Set #' + (numSolvesCompleted/setType) + ' average: ' + curAo12;
            }
            else if(setType == 100) {
                extraGoalProgressDisplay.innerHTML = 'Set #' + (numSolvesCompleted/setType) + ' average: ' + curAo100;
            }
        }
    
    }
    // Rest goal
    else if(curGoalType === 'rest') {
        curGoalDisplay.innerHTML = numSolvesToComplete + ' solves before ' + restDuration + 's rest';
        goalProgressDisplay.innerHTML = numSolvesCompleted + '/' + numSolvesToComplete + ' solves';

    }

}

// Clears all the goal-related displays
function clearGoalDisplay() {
    curGoalDisplay.innerHTML = '';
    goalProgressDisplay.innerHTML = '';
    extraGoalProgressDisplay.innerHTML = '';
}


let distCount = 0;

// For changing images of the buddy as it walks
function rotateCharacterPics(rotateSpeed, direction) {
    let count = 1;
    
    // Displays buddy image 
    buddyRotateIntervalID = setInterval(() => {
        // Forward
        if(direction === 'f') {
            buddyImage.src = `icons/buddy-icons/KirbyRWalk${count}.png`;
        }
        // Backward
        else {
            buddyImage.src = `icons/buddy-icons/KirbyLWalk${count}.png`;
        }
        count++;

        // Reset back to 1
        if(count === 11) {
            count = 1;
        }
    }, rotateSpeed);
}

// For moving the character's horizontal position as it walks
function characterWalk(walkSpeed, direction) {

    buddySpeedIntervalID = setInterval(() => {
        // Forward
        if(direction === 'f') {
            distCount += 1;
        }
        // Backward
        else {
            distCount -= 1;
        }

        // Moving both the buddy image and the speech bubble
        buddyImage.style.transform = `translateX(${distCount}px)`;
        speechBubbleContainer.style.transform = `translateX(${distCount}px)`;

        // Making backward
        if(distCount >= 320) {
            stopBuddyAnimation();
            rotateCharacterPics(200, 'b');
            characterWalk(walkSpeed, 'b');
        }
        // Making forward 
        else if(distCount <= 1) {
            stopBuddyAnimation();
            rotateCharacterPics(200, 'f');
            characterWalk(walkSpeed, 'f');
        }

        // Speech bubble has to flip directions because it sticks out
        // Prevents it from going off the page
        if(distCount >= 180) {
            speechBubble.classList.add('speech-bubble-flipped');
        }
        else if(distCount < 180) {
            speechBubble.classList.remove('speech-bubble-flipped');
        }

    }, walkSpeed);
}

// This resets all animations for the buddy
function stopBuddyAnimation() {
    clearInterval(buddyRotateIntervalID);
    clearInterval(buddySpeedIntervalID);
    buddyImage.src = "icons/buddy-icons/KirbyR.png";
}

// This shows the speech bubble and displays a certain string
// Parameters: String
function showSpeechBubble(strToDisplay) {
    let curTimeoutID = 0;

    speechBubbleContainer.classList.remove('hidden');
    speechBubbleText.innerHTML = strToDisplay;

    setTimeout(() => {
        speechBubbleContainer.classList.add('hidden');
    }, 4000);
}

rotateCharacterPics(300, 'f');
characterWalk(20, 'f');

// This displays a random encouraing message in the speech bubble at a random interval
function displayEncouragingMessage() {
    let randMessageNum = 0;

    // If there isn't a random number chosen yet
    if(!randNumRolled) {

        // Find a random number between 10 and 20
        // That is the number of solves needed to be completed before a message is displayed
        randNum =  parseInt(Math.random()*(20-10+1)) + 10;
        //console.log(randNum);

        randNumRolled = true;
    }
    // If a random number has been set
    else {

        // If that number of solves has been reached
        if(randNumCounter == randNum) {
            // Generate random number to get a random encouraging message
            randMessageNum = parseInt(Math.random()*((encMessages.length-1)-0+1)) + 0;
            
            showSpeechBubble(encMessages[randMessageNum]);

            randNumCounter = 0;
            randNumRolled = false;
        }
        // Keep counting towards the random number
        else {
            randNumCounter++;
        }
    }

}

displayEncouragingMessage();

// This resets all the times recorded as well as all personal bests
function resetAllTimes() {
    timesList = [];
    curAo5List = [];
    curAo12List = [];
    curAo100List = [];

    //bestSingle = Number.MAX_VALUE;
    bestSingle.time = Number.MAX_VALUE;
    bestSingle.scramble = '';

    //bestAo5 = Number.MAX_VALUE;
    bestAo5.time = Number.MAX_VALUE;
    bestAo5.scrambles = [];

    //bestAo12 = Number.MAX_VALUE;
    bestAo12.time = Number.MAX_VALUE;
    bestAo12.scrambles = [];

    bestAo100.time = Number.MAX_VALUE;
    bestAo100.scrambles = [];

    pbSingleButton.innerHTML = `<p class="js-pb-single pb-text">-</p>`;
    pbAo5Button.innerHTML = `<p class="js-pb-single pb-text">-</p>`;
    pbAo12Button.innerHTML = `<p class="js-pb-single pb-text">-</p>`;
    pbAo100Button.innerHTML = `<p class="js-pb-single pb-text">-</p>`;

    curAo5 = Number.MAX_VALUE;
    curAo12 = Number.MAX_VALUE;
    curAo100 = Number.MAX_VALUE;

    timesDisplay.innerHTML = '';
    pbDisplay.innerHTML = '';
    stopwatchDisplay.innerHTML = '0.000';
}

// This shows details of a personal best
function showPbDetails(pbType) {
    let timesHTMLToAdd = '';
    let scramblesHTMLToAdd = '';

    // Single
    if(pbType == '1') {
        console.log(bestSingle.scramble);
        pbPopupTitle.innerHTML = 'Best single';

        if(timesList.length >= 1) {
            timesHTMLToAdd = bestSingle.time;
            scramblesHTMLToAdd = bestSingle.scramble;
        }
        else {
            timesHTMLToAdd = '-';
            scramblesHTMLToAdd = '-';
        }

        // Showing the time and its associated scramble
        pbPopupTimes.innerHTML = timesHTMLToAdd;
        pbPopupScrambles.innerHTML = scramblesHTMLToAdd;
    }
    // ao5
    else if(pbType == '5') {
        console.log(bestAo5.scrambles);
        pbPopupTitle.innerHTML = 'Best average of 5 (ao5)';
    }
    // ao12
    else if(pbType == '12') {
        console.log(bestAo12.scrambles);
        pbPopupTitle.innerHTML = 'Best average of 12 (ao12)';
    }
    // ao100
    else if(pbType == '100') {
        console.log(bestAo100.scrambles);
        pbPopupTitle.innerHTML = 'Best average of 100 (ao100)';
    }

    // Making the popup show up
    pbPopup.classList.remove('hidden');
    screenCover.classList.remove('hidden');
}