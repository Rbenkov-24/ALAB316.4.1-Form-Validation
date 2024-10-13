//references to the form elements
const registrationForm = document.getElementById("registration");
const loginForm = document.getElementById("login");
const errorDisplay = document.getElementById("errorDisplay");

//add event listener for the registration form
registrationForm.addEventListener("submit", function (event) {
    event.preventDefault(); //prevent form submission until validation is done
    validateRegistrationForm();
});

//add event listener for the login form
loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    validateLoginForm();
});

//function to validate registration form data
function validateRegistrationForm() {
    const username = registrationForm.username.value.trim().toLowerCase();
    const email = registrationForm.email.value.trim().toLowerCase();
    const password = registrationForm.password.value;
    const passwordCheck = registrationForm.passwordCheck.value;
    const terms = registrationForm.terms.checked;

    let errors = [];

    //validate username
    if (!username) {
        errors.push("Username cannot be empty.");
    } else if (username.length < 4) {
        errors.push("Username must be at least 4 characters long.");
    } else if (!/^[a-zA-Z0-9]+$/.test(username)) {
        errors.push("Username cannot contain special characters or spaces.");
    } else if (new Set(username).size < 2) {
        errors.push("Username must contain at least two unique characters.");
    }

    //validate email
    if (!validateEmail(email)) {
        errors.push("Invalid email format.");
    } else if (email.includes("example.com")) {
        errors.push("Email cannot be from the 'example.com' domain.");
    }

    //validate password
    if (!validatePassword(password, username)) {
        errors.push("Password must be strong. It should have at least 12 characters, an uppercase letter, a lowercase letter, a number, and a special character.");
    } else if (password !== passwordCheck) {
        errors.push("Passwords do not match.");
    }

    //validate terms and conditions
    if (!terms) {
        errors.push("You must agree to the terms and conditions.");
    }

    //check for existing username in localStorage
    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
    if (existingUsers.includes(username)) {
        errors.push("Username already exists.");
    }

    //display errors if there are any
    if (errors.length > 0) {
        displayErrors(errors);
    } else {
        //if no errors proceed with registration
        existingUsers.push(username);
        localStorage.setItem("users", JSON.stringify(existingUsers));
        localStorage.setItem(username, JSON.stringify({ email, password }));

        alert("Registration successful!");
        clearForm(registrationForm);
    }
}

//function to validate login form data
function validateLoginForm() {
    const username = loginForm.username.value.trim().toLowerCase();
    const password = loginForm.password.value;

    let errors = [];

    //validate username
    if (!username) {
        errors.push("Username cannot be empty.");
    } else {
        const userData = JSON.parse(localStorage.getItem(username));
        if (!userData) {
            errors.push("Username does not exist.");
        } else {
            //validate password
            if (!password) {
                errors.push("Password cannot be empty.");
            } else if (password !== userData.password) {
                errors.push("Incorrect password.");
            }
        }
    }

    //display errors if there are any
    if (errors.length > 0) {
        displayErrors(errors);
    } else {
        alert("Login successful!");
        clearForm(loginForm);
    }
}

//function to display errors
function displayErrors(errors) {
    const errorList = errors.map(error => `<li>${error}</li>`).join("");
    errorDisplay.innerHTML = `<ul>${errorList}</ul>`;
    errorDisplay.style.display = "block";
}

//function to validate email format
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

//function to validate password strength
function validatePassword(password, username) {
    const isValidLength = password.length >= 12;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);
    const containsPassword = password.toLowerCase().includes("password");
    const containsUsername = password.toLowerCase().includes(username.toLowerCase());

    return isValidLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar && !containsPassword && !containsUsername;
}

//function to clear form fields after registration or login
function clearForm(form) {
    form.reset();
    errorDisplay.style.display = "none";
}