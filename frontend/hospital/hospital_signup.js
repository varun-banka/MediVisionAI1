document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("hospitalSignupForm");
    const formMessage = document.getElementById("formMessage");

    if (!form) return;

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        clearErrors();
        hideMessage();

        const hospitalName = document.getElementById("hospitalName").value.trim();
        const registrationNumber = document.getElementById("registrationNumber").value.trim();
        const email = document.getElementById("hospitalEmail").value.trim();
        const phone = document.getElementById("hospitalPhone").value.trim();
        const address = document.getElementById("hospitalAddress").value.trim();
        const city = document.getElementById("hospitalCity").value.trim();
        const state = document.getElementById("hospitalState").value.trim();
        const pincode = document.getElementById("hospitalPincode").value.trim();
        const adminName = document.getElementById("adminName").value.trim();
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const terms = document.getElementById("terms").checked;

        if (hospitalName === "") {
            showError("hospitalNameError", "Please enter hospital name.");
            return;
        }
        if (registrationNumber === "") {
            showError("registrationNumberError", "Please enter hospital registration number.");
            return;
        }
        if (email === "" || !isValidEmail(email)) {
            showError("hospitalEmailError", "Please enter a valid hospital email.");
            return;
        }
        if (phone === "" || !isValidPhone(phone)) {
            showError("hospitalPhoneError", "Please enter a valid phone number.");
            return;
        }
        if (address === "") {
            showError("hospitalAddressError", "Please enter hospital address.");
            return;
        }
        if (city === "") {
            showError("hospitalCityError", "Please enter city.");
            return;
        }
        if (state === "") {
            showError("hospitalStateError", "Please enter state.");
            return;
        }
        if (pincode === "" || !isValidPincode(pincode)) {
            showError("hospitalPincodeError", "Please enter a valid pincode.");
            return;
        }
        if (adminName === "") {
            showError("adminNameError", "Please enter administrator name.");
            return;
        }
        if (username === "") {
            showError("usernameError", "Please create a username.");
            return;
        }
        if (username.length < 4) {
            showError("usernameError", "Username must contain at least 4 characters.");
            return;
        }
        if (password === "") {
            showError("passwordError", "Please create a password.");
            return;
        }
        if (password.length < 8) {
            showError("passwordError", "Password must contain at least 8 characters.");
            return;
        }
        if (confirmPassword === "") {
            showError("confirmPasswordError", "Please confirm your password.");
            return;
        }
        if (password !== confirmPassword) {
            showError("confirmPasswordError", "Passwords do not match.");
            return;
        }
        if (!terms) {
            alert("Please accept the Terms & Conditions and Privacy Policy.");
            return;
        }

        const hospitalData = {
            hospital_name: hospitalName,
            registration_number: registrationNumber,
            email: email,
            phone: phone,
            address: address,
            city: city,
            state: state,
            pincode: pincode,
            admin_name: adminName,
            username: username,
            password: password
        };

        fetch("/api/hospital/signup/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(hospitalData)
        })
        .then(function (response) {
            return response.json().then(function (data) {
                if (!response.ok) {
                    throw new Error(data.message || "Hospital registration failed.");
                }
                return data;
            });
        })
        .then(function (data) {
            if (data.hospital) {
                localStorage.setItem("hospital", JSON.stringify(data.hospital));
            }
            window.location.href = "/hospital/hospital_dashboard/hospital_dashboard.html";
        })
        .catch(function (error) {
            showMessage("error", error.message);
        });
    });

    function clearErrors() {
        const ids = [
            "hospitalNameError", "registrationNumberError", "hospitalEmailError", "hospitalPhoneError",
            "hospitalAddressError", "hospitalCityError", "hospitalStateError", "hospitalPincodeError",
            "adminNameError", "usernameError", "passwordError", "confirmPasswordError"
        ];

        ids.forEach(function (id) {
            const field = document.getElementById(id);
            if (field) field.textContent = "";
        });
    }

    function showError(id, message) {
        const field = document.getElementById(id);
        if (field) field.textContent = message;
    }

    function showMessage(type, message) {
        if (!formMessage) return;
        formMessage.hidden = false;
        formMessage.className = "form-message " + type;
        formMessage.textContent = message;
    }

    function hideMessage() {
        if (!formMessage) return;
        formMessage.hidden = true;
        formMessage.textContent = "";
    }

    function isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function isValidPhone(value) {
        return /^[0-9+\s()-]{7,15}$/.test(value);
    }

    function isValidPincode(value) {
        return /^[0-9]{4,8}$/.test(value);
    }
});