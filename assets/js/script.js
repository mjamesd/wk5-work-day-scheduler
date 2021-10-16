// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Author: Mark Drummond
// Date: 16-Oct-2021
// Assignment: Day Planner
// See README.md for more information
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/*
Features:

    * Render the current date with day of the week in #currentDay <p> element. (dddd, MMM Do, YYYY)
    * Render hour-long blocks of time stacked on top of each other.
        * Timeblocks in the past are grey.
        * The current hour's timeblock is red.
        * Timeblocks in the future are green.
        * There is a "Save" button on the right side. It's light blue and has the standard "save" icon (an HTML entity).
    * When you click on the block, you can add a task. When you unfocus from the Time Block (i.e. click off it or press the tab key), it saves to localStorage.
    * You can click the "Save" button but it doesn't actually do anything -- the .change() event listener on the textarea is handling the saving.
        * You can edit the Time Block if you click on it again. Click the "Save" button to save the changes.
        * There is only one input field per timeblock.
    * Time Blocks are saved in localstorage so you can close the browser and come back to it later.
    * BONUS: Choose a different day and the app is cloned for that day!
        * Save the data in an object? Save the object in an array of days?

*/

// ~~~~~~~~~~~~~~~~~~~~
// DOCUEMENT SELECTORS HERE
// ~~~~~~~~~~~~~~~~~~~~
let currentDayEl = $("#currentDay");
let timeblockContainerEl = $("#timeblockContainer");
let toggleFullDayEl = $("#fullDay");

// ~~~~~~~~~~~~~~~~~~~~
// GLOBAL VARIABLES HERE
// ~~~~~~~~~~~~~~~~~~~~

// let datetime = moment("2020-10-12 10:34:00"); // the datetime Leon was born! ... for testing purposes
let datetime = moment(); // now
let datetimeYMD = datetime.format("YY-MM-DD"); // Unimplemented feature to have multiple days
let fullDay = false; // turn fullDay on to show all 24 hours.
const standardBusinessHourStart = 9; // 9am
const standardBusinessHourEnd = 17; // 5pm
let descriptionPlaceholder = "Enter your task here"; // set the default placeholder

// classes for time blocks
let timeBlockClasses = "time-block row";
let hourClasses = "hour col-1";
let descriptionClasses = "description col-10";
let saveBtnClasses = "saveBtn col-1";
let hiddenOnLoadClass = " hiddenOnLoad"; // space in front because we are going to add it to the other classes
let saveButtonText = "&#x1f4be;"; // HTML entity for save icon
let hourglassText = "&#x23f3;"; // HTML entity for hourglass icon


// ~~~~~~~~~~~~~~~~~~~~
// FUNCTIONS HERE
// ~~~~~~~~~~~~~~~~~~~~

function renderCurrentDay() {
    currentDayEl.append(datetime.format("dddd, MMM Do, YYYY"));
    // currentDayEl.append("<br />");
    // currentDayEl.append("Time: " + datetime.format("h:mm:ss a")); // for testing purposes
}

function renderTimeBlocks(start = 0, end = 23) { // 9am to 5pm
    // Loop through each hour and render each time block
    // Each time block has three elements: div for the hour, textarea for the description, and div with button for the save.
    // Include logic to hid all time block elements outside of standard business hours
    for (let currentHour = start; currentHour <= end; currentHour++) {
        // Unimplemented feature to have multiple days:
        // let thisDescription = localStorage.getItem(`tb-${datetime.format("YY-MM-DD")}-${currentHour}`);
        let thisDescription = localStorage.getItem(`tb-${currentHour}`);
        let thisDescriptionClasses = descriptionClasses;
        if (datetime.format("H") > currentHour)
            thisDescriptionClasses += " past";
        else if (datetime.format("H") == currentHour)
            thisDescriptionClasses += " present";
        else
            thisDescriptionClasses += " future";
        // Only show "standard business hours" on load
        let thisWrapperClasses = timeBlockClasses;
        // console.log(currentHour, standardBusinessHourStart, standardBusinessHourEnd);
        // Hide timeblocks outside of standard business hours for unimplemented feature to have multiple days.
        if (currentHour < standardBusinessHourStart || currentHour > standardBusinessHourEnd)
            thisWrapperClasses += hiddenOnLoadClass;
        let wrapper = $("<div>").addClass(thisWrapperClasses);
        let hour = $("<div>").addClass(hourClasses).text(currentHour);
        // Unimplemented feature to have multiple days:
        // let description = $("<textarea>").addClass(thisDescriptionClasses).attr("id", `tb-${datetimeYMD}-${currentHour}`).attr("data-hour", currentHour).attr("placeholder", descriptionPlaceholder).val(thisDescription);
        let description = $("<textarea>").addClass(thisDescriptionClasses).attr("id", `tb-${currentHour}`).attr("data-hour", currentHour).attr("placeholder", descriptionPlaceholder);
        if (thisDescription == null)
            thisDescription = "";
        else
            description.val(thisDescription);
        let saveBtn = $("<button>").addClass(saveBtnClasses).attr("data-hour", currentHour).html(saveButtonText); // must use .html() for HTML entity
        wrapper.append(hour, description, saveBtn);
        timeblockContainerEl.append(wrapper);
        // For accessibility:
        saveBtn.attr("aria-label", "Save");
    }

    // Add event listener for newly rendered elements
    // Whenever the textarea is changed, it saves to localStorage and alerts the user
    // Clicking the button does nothing, it's only when the textarea is changed
    $(".description").change(function () {
        // Unimplemented feature to have multiple days:
        // localStorage.setItem(`tb-${datetimeYMD}-${$(this)[0].dataset.hour}`, $(this).val());
        localStorage.setItem(`tb-${$(this)[0].dataset.hour}`, $(this).val());
        let thisDescription = $(this);
        thisDescription.attr("disabled", "disabled");
        let thisSaveBtn = $(this).next(); // The next element is the save button
        thisSaveBtn.html(hourglassText); // Change icon to hourglass...
        setTimeout(function () {
            thisSaveBtn.html(saveButtonText); // Wait half a second and then change the icon back ;-)
            thisDescription.removeAttr("disabled");
        }, 500);
    });

}

// unimplemented function to show the whole day instead of just "standard business hours"
// function setFullDay() {
//     fullDay = !fullDay;
//     localStorage.setItem("fullDay", fullDay);
//     if (fullDay == true) {
//         console.log("fullDay: ", fullDay);
//         $(this).removeClass("present");
//         $(this).addClass("future");
//         $(".time-block").removeAttr("disabled");
//     } else {
//         $(this).removeClass("future");
//         $(this).addClass("present");
//     }
//     console.log("fullDay truthiness: ", fullDay);
// }

// ~~~~~~~~~~~~~~~~~~~~
// BEGIN EXECUTION HERE
// ~~~~~~~~~~~~~~~~~~~~

// 1. Add event listeners
// $(toggleFullDayEl).click(setFullDay);
// 2. Render current day at top of page
renderCurrentDay();
// 3. Render timeblocks
renderTimeBlocks();

// eof