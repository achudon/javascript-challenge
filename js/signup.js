/*
    Signup Form Script
    This script will load the state select list and validate the form before submission
*/

//check that page is fully loaded

"use strict";

document.addEventListener('DOMContentLoaded', onReady());
var signUp;

function onReady() {
    signUp = document.getElementById('signup');
    // populate states dropdown
    populateStates();

    // make occupation box appear if "other" is selected
    signUp.elements['occupation'].addEventListener('change', showOccInput);


    // allow user to navigate away from the page by clicking "No Thanks"
    document.getElementById('cancelButton').addEventListener('click', navAway);

    // stop submission if invalid
    signUp.addEventListener('submit', onSubmit);

}

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

function showOccInput() {
    var val = signUp.elements['occupation'].value;
    if (val == 'other') {
        signUp.elements['occupationOther'].style.display = 'block';
    } else {
        signUp.elements['occupationOther'].value = '';
        signUp.elements['occupationOther'].style.display = 'none';
    }
}

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
    }
}

function validateForm(form) {
    var fields = ['firstName', 'lastName', 'address1', 'city', 'state',
        'zip', 'birthdate'];
    var idx;
    var formValid = true;

    for (idx = 0; idx < fields.length; idx++) {
        formValid = ((formValid) && validateField(form.elements[fields[idx]]));
    }
    var occ = checkOccupation(form);
    var zip = checkZip(form);
    var birth = checkBirth(form);

    if (!occ || !zip|| !birth) {
        formValid = false;
    }

    return formValid;
}

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

function checkOccupation(form) {
    var valid = true;
    var val = form.elements['occupation'].value;
    var field;

    if (val == 'other') {
        field = form.elements['occupationOther'].value;
        valid = field.trim().length > 0;
    }

    if (!valid) {
        form.elements['occupationOther'] = 'form-control invalid-field';
    }
    return valid;
}

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

function checkBirth(form) {
    var valid = true;
    var dob = form.elements['birthdate'].value;
    var diff = moment().diff(dob, 'years');

    if (!(diff >= 13)) {
        valid = false;
        form.elements['birthdate'].className = 'form-control invalid-field';
    }
    return valid;
}

function navAway() {
    var leave = confirm('Are you sure you would like to navigate away from the page?');
    if (leave) {
        window.location = 'https://google.com';
    }
}