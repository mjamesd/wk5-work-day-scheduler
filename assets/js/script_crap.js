// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Author: Mark Drummond
// Date: 16-Oct-2021
// Assignment: Day Planner
// See README.md for more information
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/*
Features:

    * Current date with day of the week in #currentDay <p> element. (dddd, MMM Do, YYYY)
    * Hour-long blocks of time stacked on top of each other.
        * Timeblocks in the past are grey.
        * The current hour's timeblock is red.
        * Timeblocks in the future are green.
        * There is a "Save" button on the right side. It's light blue and has the standard "save" icon (//assets/img/save.png).
    * When you click on the block, you can add a task. You can click the "Save" button to save the Todo.
        * You can edit the Todo if you click on it again. Click the "Save" button to save the changes.
        * There is only one input field per timeblock.
    * Todos are saved in localstorage so you can close the browser and come back to it later.
    * BONUS: Choose a different day and the app is cloned for that day!
        * Save the data in an object? Save the object in an array of days?

*/

// Global constants
const debugMe = true; // or false to turn off console.log
const standardBusinessHourStart = 9; // 9am
const standardBusinessHourEnd = 17; // 5pm

// Global variables
var currentDay;  // date in dddd, MMM Do, YYYY format
var currentDate; // date in YYYY-MM-DD format
var currentHour; // 24-hour format, will  always be two digits, i.e. 03
var fullDay = false; // turn fullDay on to show all 24 hours.
var timerInterval;
var timerIndex;
var localstorageItemName;

// Document selectors from HTML
var currentDayEl = $("#currentDay");
var timeblockContainerEl = $("#timeblockContainer");
var toggleFullDayEl = $("#fullDay");

// ~~~~~~~~~
// Functions
// ~~~~~~~~~

// Turn off console.log function if debugMe is false
if (debugMe === false) {
    console.log = function() {}
}

// this doesn't show the line from which the console.log comes
// Wrapper for console.log -- turn on and off debug messages using const debugMe above
//  Msg is the message that will be written
//  aVar is the variable that will be logged
//  bool overrides debugMe and returns true only
//  Return true | false for misc debug reasons.
//  Can be used in Chrome Dev Tools console to debug on the page
// function debugThis(Msg = null, aVar = null, bool = null) {
//     if (bool === true) {
//         return true;
//     } else if (debugMe === true) {
//         console.log(Msg, aVar);
//         return true;
//     }
//     return false;
// }

// Initialization function
//  datetime accepts a moment() or makes its own from this
function init(datetime = null) {
    if (datetime == null || datetime.isValid() === false) {
        datetime = moment();
    }
    setTimer();
    currentDay = moment(datetime).format("dddd, MMM Do, YYYY"); // set global
    currentDate =        moment(datetime).format("YYYY-MM-DD"); // set global
    currentHour =                moment(datetime).format("HH"); // set global
    localstorageItemName = "todos-" + currentDate + "-" + currentHour; // set global
    // Render currentDay at top of page
    currentDayEl.text(currentDay);
    if (fullDay == true) {
        toggleFullDayEl.addClass("future");
    } else {
        toggleFullDayEl.addClass("present");
    }
    // Render timeblocks to the page, respecting fullDay
    if (fullDay === true) {
        renderTimeblocks(datetime, 0, 23);
    } else {
        renderTimeblocks(datetime);
    }
}

function setFullDay() {
    fullDay = !fullDay;
    localStorage.setItem("fullDay", fullDay);
    if (fullDay == true) {
        $(this).removeClass("present");
        $(this).addClass("future");
    } else {
        $(this).removeClass("future");
        $(this).addClass("present");
    }
    console.log("fullDay truthiness: ", fullDay);
}

function setTimer() {
    timerIndex = 0;
    timerInterval = setInterval(function() {
        timerIndex++;
        if (timerIndex >= 45) {
            // do something every 45 seconds
            console.log("45 seconds have gone by");
            timerIndex = 0;
        }
    }, 1000);
}

function renderTimeblocks(datetime = null, start = standardBusinessHourStart, end = standardBusinessHourEnd) {
    if (datetime == null) {
        // datetime = moment();
        return;
    }
    
    console.log("date: ", moment(datetime).format("dddd, MMM Do, YYYY"));
    console.log("time at page load: ", moment(datetime).format("h:mm:ss"));
    console.log("current hour: ", currentHour);

    // Loop through each hour and output the timeblock like: [ currentHour] [ currentTodos            ] [ save.png ]
    for (var i = start; i <= end; i++) {
        console.log("current hour: ", i);
        // var thisHour = $("div");
        // thisHour.addClass("hour");
        // thisHour.text(i);
        // timeblockContainerEl.append(thisHour);
        var thisTodo = $("<textarea class=\"description\" />");
        thisTodo.val(renderTodos(datetime, i));
        timeblockContainerEl.append(thisTodo);
        var thisSaveBtn = $("div");
        thisSaveBtn.addClass("saveBtn"); // ,"alt","Save"));
        timeblockContainerEl.append(thisSaveBtn);
        /*
            <div class="col-12 container time-block">
                <div class="col-2 hour">
                    $(currentHour)
                </div>
                <div class="col-8 description">
                    <textarea id="todo-i"></textarea>
                </div>
                <div class="col-2 saveBtn">
                    <img src="./assets/img/save.png" alt="Save" class="saveBtn" />
                </div>
            </div>
        */
    }
}

function renderTodos(datetime, currentHour) {
    // debugMe("renderTodos for currentHour=" + currentHour, datetime);
    // 1. Validate parameters
    // 2. Declare Todos: var Todos = getLocalTodos(datetime); // Get Todos from localStorage
    // var todos = getLocalTodos(datetime);
    // 3. Loop through localstorage to find all Todos in this datetime's hour
    //  3a. Declare the current Todo: var curTodo; // keep `var` so we re-declare the variable on each iteration
    //  3b. Create HTML element for each Todo for that hour:
    //      i.   Create element: var curEl = $("#hour-currentHour-Todo-i").("div") // Use currentHour here
    //      ii.  Set text: curEl.text(Todo[details])
    //      iii. Add to the Todos array: Todos.push(curEl);
    // 4. return Todos;
}

function saveTodos() {
}



// Start code execution
$(toggleFullDayEl).click(setFullDay);
$(document).on("click", ".saveBtn", function() {
    console.log(".saveBtn $(this): ", $(this));
    var localTodos = JSON.parse(localStorage.getItem(localstorageItemName)); // "todos-" + currentDate + "-" + currentHour
    if (localTodos == null) {
        localTodos = [];
    }
    // append to localStorage "Todos"
    // localTodos.push(/* ??? */);
    // set localStorage
    localStorage.setItem(localstorageItemName, JSON.stringify(localTodos));
});

init();