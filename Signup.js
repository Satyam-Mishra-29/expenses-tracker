// Selecting the form and input elements from the DOM
let form = document.querySelector("form");

let first = document.querySelectorAll("input")[0];
let last = document.querySelectorAll("input")[1];
let email = document.querySelectorAll("input")[2];
let mobile = document.querySelectorAll("input")[3];
let createpass = document.querySelectorAll("input")[4];
let confirmpass = document.querySelectorAll("input")[5];

// Selecting the span elements that display error messages
let efirst = document.querySelectorAll("span")[0];
let elast = document.querySelectorAll("span")[1];
let eemail = document.querySelectorAll("span")[2];
let emob = document.querySelectorAll("span")[3];
let epass = document.querySelectorAll("span")[4];
let ecpass = document.querySelectorAll("span")[5];

// Initialize storage array to hold user details
let storage = [];
let DataFromStorage = JSON.parse(localStorage.getItem("data")); 

// If there are existing details in localStorage, populate the storage array
if (DataFromStorage) {
    storage = DataFromStorage;
}

// Adding an event listener to handle form submission
form.addEventListener("submit", (e) => {
    let flag = true; // Flag to track if the form is valid

    // First Name Validation
    let regex = /^[a-zA-Z]{1,17}$/;
    if (first.value == "") {
        efirst.innerHTML = `*Enter the first Name!`;
        flag = false; // Set flag to false if validation fails
        e.preventDefault(); // Prevent form submission
    } else if (regex.test(first.value)) {
        efirst.innerHTML = ""; // Clear error if input is valid
    } else {
        efirst.innerHTML = "Invalid First Name!";
        flag = false;
        e.preventDefault();
    }

    // Last Name Validation
    if (last.value == "") {
        elast.innerHTML = "*Enter Last Name";
        flag = false;
        e.preventDefault();
    } else if (regex.test(last.value)) {
        elast.innerHTML = "";
    } else {
        elast.innerHTML = "Invalid Last Name!";
        flag = false;
        e.preventDefault();
    }

    // Email Verification
    let emailCheck = storage.some((e) => e.Email == email.value); // Check if email is unique

    if (emailCheck) {
        eemail.innerHTML = "*Email Already Exist";
        flag = false;
        e.preventDefault();
    } else if (email.value == "") {
        eemail.innerHTML = "*Enter EmailId";
        flag = false;
        e.preventDefault();
    } else {
        eemail.innerHTML = ""; // Clear error if input is valid
    }

    // Mobile Number Validation
    let regex1 = /^[6-9][0-9]{9}$/;
    let unique = storage.find((e) => e.Phone_No == mobile.value); // Check if mobile number is unique
    
    if (unique) {
        emob.innerHTML = "*Number Already Exist";
        flag = false;
        e.preventDefault();
    } else if (mobile.value == "") {
        emob.innerHTML = "*Enter the Mobile No.";
        flag = false;
        e.preventDefault();
    } else if (regex1.test(mobile.value)) {
        emob.innerHTML = ""; // Clear error if input is valid
    } else {
        emob.innerHTML = "Invalid Mobile No.";
        flag = false;
        e.preventDefault();
    }

    // Create Password Validation
    let regpass = /^[a-zA-Z0-9!@]{6,15}$/;
    if (createpass.value == "") {
        epass.innerHTML = "Enter the Password";
        flag = false;
        e.preventDefault();
    } else if (regpass.test(createpass.value)) {
        epass.innerHTML = ""; // Clear error if input is valid
    } else {
        epass.innerHTML = "Invalid Password!";
        flag = false;
        e.preventDefault();
    }

    // Confirm Password Validation
    if (confirmpass.value == "") {
        ecpass.innerHTML = "*Enter The Password";
        flag = false;
        e.preventDefault();
    } else if (confirmpass.value == createpass.value) {
        ecpass.innerHTML = " "; // Clear error if passwords match
    } else {
        ecpass.innerHTML = "*Password is Not Matching.....!!";
        flag = false;
        e.preventDefault();
    }

    // Store the data in localStorage if all validations pass
    if (flag) {
        let data = {
            FirstName: first.value,
            LastName: last.value,
            Email: email.value,
            Phone_No: mobile.value,
            Password: createpass.value,
            Expenses:null,
            Income:null,
        };
        storage.push(data); // Add the new details to the storage array
        localStorage.setItem("data", JSON.stringify(storage)); // Save to localStorage
    }
});
