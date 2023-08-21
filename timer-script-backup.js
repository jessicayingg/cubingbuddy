// VARIABLES

// For HTML elmeents that will be altered
const stopwatchDisplay = document.querySelector('.js-display');
const timesDisplay = document.querySelector('.js-times');
const inputElement = document.querySelector('.js-user-input');
const enterButton = document.querySelector('.js-manual-result');

const logoButton = document.querySelector('.js-logo');
const normalBodyHTML = document.body.innerHTML;

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
let fastestSingle = Number.MAX_VALUE;

// For averages
let curAo5List = [];
let curAo5;

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

document.body.addEventListener('click', (event) => {
    
    if(isSidebarOpen) {
       // I set this manually, should try to change later
        if(event.pageX > 250) {
            closeSideBar();
            isSidebarOpen = false;
        }
    }
});

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
    if(curTime < fastestSingle) {
        fastestSingle = curTime;
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

    console.log(timesList);
    console.log('Best single: ' + fastestSingle);
    console.log(curAo5List);

    findAverage();
    //addTimes();
    addTime();
}

// To find average of 5
function findAverage() {
    let total = 0;
    let highest = Number.MIN_VALUE;
    let lowest = Number.MAX_VALUE;
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
}
/*
function addTimes() {
   let HTMLToAdd = '';

    timesList.forEach((time, index) => {
        if(curAo5List.length < 5) {
            HTMLToAdd = `
            <p class="num">${index+1}</p>
            <p class="time">${time.toFixed(3)}</p>
            <p class="average">-</p>
        ` + HTMLToAdd;
        }
        else {
            HTMLToAdd = `
            <p class="num">${index+1}</p>
            <p class="time">${time.toFixed(3)}</p>
            <p class="average">${curAo5}</p>
        ` + HTMLToAdd;
        }
    });

    timesDisplay.innerHTML = HTMLToAdd;
} */

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
    document.body.innerHTML += `
    <nav class="sidebar">
        <div class="sidebar-logo">
            <img src="icons/cubingbuddy_logo.png">
            <p class="web-name">Cubing Buddy</p>
        </div>
        
        <div class="sidebar-option">
            <img class="sidebar-icon" src="icons/settings-icon.png">
            <p class="subtitle">Settings</p>
        </div>

        <div class="sidebar-option">

        </div>
    </nav>

    <div class="js-cover sidebar-open-cover"></div>
    `;

 }

 // CLOSING SIDE BAR
 function closeSideBar() {
    document.body.innerHTML = normalBodyHTML;
 }