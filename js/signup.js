/*
    Signup Form Script
    This script will load the state select list and validate the form before submission
*/
"use strict";

// check that page is fully loaded
document.addEventListener('DOMContentLoaded', onReady());

// get reference to signUp form
var signUp;

// add event listeners for changes in the state of the page
function onReady() {
    signUp = document.getElementById('signup');
    // populate states dropdown
    populateStates();
    showOccInput();

    // make occupation box appear if "other" is selected
    signUp.elements['occupation'].addEventListener('change', showOccInput);


    // allow user to navigate away from the page by clicking "No Thanks"
    document.getElementById('cancelButton').addEventListener('click', navAway);

    // stop submission if invalid
    signUp.addEventListener('submit', onSubmit);

}

// add states to the dropdown
function populateStates() {
    var i;
    var newState;

    var stateSelect = signUp.elements['state'];

    for (i = 0; i < usStates.length; i++) {
        newState = document.createElement('option');
        newState.innerHTML = usStates[i].name;
        newState.value = usStates[i].code;

        stateSelect.appendChild(newState);
    }
}

// show the additional occupation input box if "other" is selected in drop-down
function showOccInput() {
    var val = signUp.elements['occupation'].value;
    if (val == 'other') {
        signUp.elements['occupationOther'].style.display = 'block';
    } else {
        signUp.elements['occupationOther'].value = '';
        signUp.elements['occupationOther'].style.display = 'none';
    }
}

// validate and submit form
function onSubmit(eventObject) {
    try {
        var valid = validateForm(this);
        if (!valid && eventObject.preventDefault) {
            eventObject.preventDefault();
        }
        eventObject.returnValue = valid;
        return valid;
    }
    catch(exception) {
        console.log(exception);
    }
}

// validate form
function validateForm(form) {
    var fields = ['firstName', 'lastName', 'address1', 'city', 'state',
        'zip', 'birthdate'];
    var idx;
    var formValid = true;

    for (idx = 0; idx < fields.length; idx++) {
        formValid = (validateField(form.elements[fields[idx]]) && (formValid));
    }

    var occ = checkOccupation(form);
    var zip = checkZip(form);
    var birth = checkBirth(form);

    if (!occ || !zip|| !birth) {
        formValid = false;
    }

    console.log(formValid);

    return formValid;
}

// validate specific field (check that it is not empty)
function validateField(field) {
    var currField = field.value.trim();
    var valid = currField.length > 0;

    if (valid) {
        field.className = 'form-control';
    } else {
        field.className = 'form-control invalid-field'
    }
    return valid;
}

// check that additional occupation info has been added if "other" is selected
function checkOccupation(form) {
    var valid = true;
    var val = form.elements['occupation'].value;
    var field;

    if (val == 'other') {
        field = form.elements['occupationOther'].value;
        valid = field.trim().length > 0;
    }

    if (!valid) {
        form.elements['occupationOther'].className = 'form-control invalid-field';
    } else {
        form.elements['occupationOther'].className = 'form-control';
    }

    return valid;
}

// check that zip is valid (5 digit number)
function checkZip(form) {
    var valid = true;
    var zipRegEx = new RegExp('^\\d{5}$');
    var toTest = form.elements['zip'].value;

    if (!zipRegEx.test(toTest)) {
        valid = false;
        form.elements['zip'].className = 'form-control invalid-field'
    }
    return valid;
}

// check that birthdate makes user 13 years or older
function checkBirth(form) {
    var valid = true;
    var dob = form.elements['birthdate'].value;
    var diff = moment().diff(dob, 'years');
    var message = document.getElementById('birthdateMessage');

    if (diff >= 13) {
        form.elements['birthdate'].className = 'form-control';
        message.innerHTML = '';
    } else {
        valid = false;
        form.elements['birthdate'].className = 'form-control invalid-field';
        message.innerHTML = 'You must be 13 or older to submit this form.';
    }
    return valid;
}

// confirm that user wants to navigate away, and if so redirect them
function navAway() {
    var leave = confirm('Are you sure you would like to navigate away from the page?');
    if (leave) {
        window.location = 'https://google.com';
    }
}

