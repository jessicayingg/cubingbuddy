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
let bestSingle = Number.MAX_VALUE;
let bestAo5 = Number.MAX_VALUE;
let bestAo12 = Number.MAX_VALUE;
let bestAo100 = Number.MAX_VALUE;

// For averages
let curAo5List = [];
let curAo5;
let curAo12List = [];
let curAo12;
let curAo100List = [];
let curAo100;

// For scramble
let lastScramble = '';

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
    if(curTime < bestSingle) {
        bestSingle = curTime;

        showSpeechBubble('New best single!');
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
        // Just adding if less than 12 solves recorded
        curAo12List.push(curTime);
    }
    else {
        // Delete first solve, add on the new one
        curAo12List.splice(0, 1);
        curAo12List.push(curTime);
    }

    // Adding to ao100
    if(curAo100List.length < 100) {
        // Just adding if less than 100 solves recorded
        curAo100List.push(curTime);
    }
    else {
        // Delete first solve, add on the new one
        curAo100List.splice(0, 1);
        curAo100List.push(curTime);
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
    addPbs();

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
    if(curAo5 < bestAo5) {
        bestAo5 = curAo5;

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
    if(curAo12 < bestAo12) {
        bestAo12 = curAo12;

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
    if(curAo100 < bestAo100) {
        bestAo100 = curAo100;

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

function addPbs() {
    let HTMLToAdd2 = '';

    if(curAo100List.length >= 100) {
        HTMLToAdd2 += `
        <p class="pb-text">${bestSingle}</p>
        <p class="pb-text">Single</p>
        <p class="pb-text">${bestAo5}</p>
        <p class="pb-text">Ao5</p>
        <p class="pb-text">${bestAo12}</p>
        <p class="pb-text">Ao12</p>
        <p class="pb-text">${bestAo100}</p>
        <p class="pb-text">Ao100</p>
    `;
    }
    else if(curAo12List.length >= 12) {
        HTMLToAdd2 += `
        <p class="pb-text">${bestSingle}</p>
        <p class="pb-text">Single</p>
        <p class="pb-text">${bestAo5}</p>
        <p class="pb-text">Ao5</p>
        <p class="pb-text">${bestAo12}</p>
        <p class="pb-text">Ao12</p>
        <p class="pb-text">-</p>
        <p class="pb-text">Ao100</p>
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
        <p class="pb-text">-</p>
        <p class="pb-text">Ao100</p>
    `;
    }
    else {
        HTMLToAdd2 += `
        <p class="pb-text">${bestSingle}</p>
        <p class="pb-text">Single</p>
        <p class="pb-text">-</p>
        <p class="pb-text">Ao5</p>
        <p class="pb-text">-</p>
        <p class="pb-text">Ao12</p>
        <p class="pb-text">-</p>
        <p class="pb-text">Ao100</p>
    `;
    }

    pbDisplay.innerHTML = HTMLToAdd2;
}

function setGoal() {
    let invalidGoal = false;

    if(numGoalCover.classList.contains('hidden')) {
        curGoalType = 'num';
        numSolvesToComplete = numSolvesInput.value;
    }
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
    else if(restGoalCover.classList.contains('hidden')) {
        curGoalType = 'rest';
        numSolvesToComplete = numRestSolvesInput.value;
        restDuration = restDurationInput.value;
    }
    else {
        invalidGoal = true;
    }

    if(numSolvesToComplete == 0) {
        invalidGoal = true;
        resetGoals();
    }

    console.log(curGoalType);
    console.log(numSolvesToComplete);
    console.log(restDuration);

    if(invalidGoal) {
        showSpeechBubble('Invalid goal :(');
    }
    else {
        showSpeechBubble('Goal set!');
    }
}

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

function resetGoalStats() {
    curGoalType = '';
    numSolvesToComplete = 0;
    numSolvesCompleted = 0;
    restDuration = 0;
    setType = 0;
}

function trackGoal() {
    
    if(curGoalType != '') {
        numSolvesCompleted++;

        displayGoalStats();

        if(curGoalType === 'num') {
            if(numSolvesCompleted == numSolvesToComplete) {
                console.log('goal completed!');

                showSpeechBubble('Goal completed!');

                resetGoals();
            }
    
        }
        else if(curGoalType === 'sets') {
            if(numSolvesCompleted % setType === 0) {
                console.log(numSolvesCompleted/setType + ' sets completed!');

                showSpeechBubble(numSolvesCompleted/setType + '/' + numSolvesToComplete/setType + ' sets completed!');
            }
    
            if(numSolvesCompleted == numSolvesToComplete) {
                console.log('goal completed!');

                showSpeechBubble('Goal completed!');
    
                resetGoals();
            }
        }
        else if(curGoalType === 'rest') {
            if(numSolvesCompleted == numSolvesToComplete) {
                console.log('rest');

                goalProgressDisplay.innerHTML = numSolvesCompleted + '/' + numSolvesToComplete + ' solves... REST NOW';
                screenCover.classList.remove('hidden');

                numSolvesCompleted = 0;
                restStarted = true;

                showSpeechBubble('Rest starting!');

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

function displayGoalStats() {

    if(curGoalType === 'num') {
        curGoalDisplay.innerHTML = numSolvesToComplete + ' solves';
        goalProgressDisplay.innerHTML = numSolvesCompleted + '/' + numSolvesToComplete + ' solves';
    }
    else if(curGoalType === 'sets') {
        curGoalDisplay.innerHTML = (numSolvesToComplete / setType) + ' sets (' + numSolvesToComplete + ' solves)';
        goalProgressDisplay.innerHTML = numSolvesCompleted + '/' + numSolvesToComplete + ' solves';

        if(numSolvesCompleted % setType === 0) {
            if(setType == 5) {
                extraGoalProgressDisplay.innerHTML = 'Set #' + (numSolvesCompleted/setType) + ' average: ' + curAo5;
            }
            else if(setType == 12) {
                extraGoalProgressDisplay.innerHTML = 'Set #' + (numSolvesCompleted/setType) + ' average: ' + curAo12;
            }
            else if(setType == 100) {
                extraGoalProgressDisplay.innerHTML = 'Set #' + (numSolvesCompleted/setType) + ' average: ' + 'hi';
            }
        }
    
    }
    else if(curGoalType === 'rest') {
        curGoalDisplay.innerHTML = numSolvesToComplete + ' solves before ' + restDuration + 's rest';
        goalProgressDisplay.innerHTML = numSolvesCompleted + '/' + numSolvesToComplete + ' solves';

    }

}

function clearGoalDisplay() {
    curGoalDisplay.innerHTML = '';
    goalProgressDisplay.innerHTML = '';
    extraGoalProgressDisplay.innerHTML = '';
}


let distCount = 0;

function rotateCharacterPics(rotateSpeed, direction) {
    let count = 1;
    
    buddyRotateIntervalID = setInterval(() => {
        if(direction === 'f') {
            buddyImage.src = `icons/buddy-icons/KirbyRWalk${count}.png`;
        }
        else {
            buddyImage.src = `icons/buddy-icons/KirbyLWalk${count}.png`;
        }
        count++;

        if(count === 11) {
            count = 1;
        }
    }, rotateSpeed);
}

function characterWalk(walkSpeed, direction) {

    buddySpeedIntervalID = setInterval(() => {
        if(direction === 'f') {
            distCount += 1;
        }
        else {
            distCount -= 1;
        }

        buddyImage.style.transform = `translateX(${distCount}px)`;
        speechBubbleContainer.style.transform = `translateX(${distCount}px)`;

        if(distCount >= 320) {
            stopBuddyAnimation();
            rotateCharacterPics(200, 'b');
            characterWalk(walkSpeed, 'b');
        }
        else if(distCount <= 1) {
            stopBuddyAnimation();
            rotateCharacterPics(200, 'f');
            characterWalk(walkSpeed, 'f');
        }

        if(distCount >= 180) {
            speechBubble.classList.add('speech-bubble-flipped');
        }
        else if(distCount < 180) {
            speechBubble.classList.remove('speech-bubble-flipped');
        }

    }, walkSpeed);
}

function stopBuddyAnimation() {
    clearInterval(buddyRotateIntervalID);
    clearInterval(buddySpeedIntervalID);
    buddyImage.src = "icons/buddy-icons/KirbyR.png";
}

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

function displayEncouragingMessage() {
    let randMessageNum = 0;

    if(!randNumRolled) {

        randNum =  parseInt(Math.random()*(20-10+1)) + 10;
        console.log(randNum);

        randNumRolled = true;
    }
    else {

        if(randNumCounter == randNum) {
            randMessageNum = parseInt(Math.random()*((encMessages.length-1)-0+1)) + 0;
            
            showSpeechBubble(encMessages[randMessageNum]);

            randNumCounter = 0;
            randNumRolled = false;
        }
        else {
            randNumCounter++;
        }
    }

    console.log(randNumCounter);
}

displayEncouragingMessage();

function resetAllTimes() {
    timesList = [];
    curAo5List = [];
    curAo12List = [];
    curAo100List = [];

    bestSingle = Number.MAX_VALUE;
    bestAo5 = Number.MAX_VALUE;
    bestAo12 = Number.MAX_VALUE;
    bestAo100 = Number.MAX_VALUE;

    curAo5 = Number.MAX_VALUE;
    curAo12 = Number.MAX_VALUE;
    curAo100 = Number.MAX_VALUE;

    timesDisplay.innerHTML = '';
    pbDisplay.innerHTML = '';
    stopwatchDisplay.innerHTML = '0.000';
}