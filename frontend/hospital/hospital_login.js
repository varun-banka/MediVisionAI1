document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("hospitalLoginForm");
    const passwordInput = document.getElementById("loginPassword");
    const passwordToggle = document.getElementById("passwordToggle");
    const forgotPassword = document.getElementById("forgotPassword");
    const formMessage = document.getElementById("formMessage");

    function clearErrors() {
        const errors = ["usernameError", "passwordError"];
        errors.forEach(function (id) {
            const field = document.getElementById(id);
            if (field) field.textContent = "";
        });

        const inputBoxes = document.querySelectorAll(".input-box");
        inputBoxes.forEach(function (box) {
            box.classList.remove("input-error");
        });
    }

    function showError(id, message) {
        const field = document.getElementById(id);
        if (field) {
            field.textContent = message;
        }

        const input = document.getElementById(id.replace("Error", ""));
        if (input) {
            const inputBox = input.closest(".input-box");
            if (inputBox) {
                inputBox.classList.add("input-error");
            }
        }
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

    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener("click", function () {
            const icon = passwordToggle.querySelector("i");

            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                icon.classList.remove("bi-eye");
                icon.classList.add("bi-eye-slash");
            } else {
                passwordInput.type = "password";
                icon.classList.remove("bi-eye-slash");
                icon.classList.add("bi-eye");
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();
            clearErrors();
            hideMessage();

            const username = document.getElementById("loginUsername").value.trim();
            const password = document.getElementById("loginPassword").value;

            if (username === "") {
                showError("usernameError", "Please enter your username or email.");
                return;
            }

            if (password === "") {
                showError("passwordError", "Please enter your password.");
                return;
            }

            if (password.length < 6) {
                showError("passwordError", "Password must contain at least 6 characters.");
                return;
            }

            const loginButton = document.getElementById("loginButton");
            if (loginButton) {
                loginButton.classList.add("loading");
                loginButton.setAttribute("disabled", "disabled");
                const buttonText = loginButton.querySelector("#buttonText");
                if (buttonText) {
                    buttonText.textContent = "Signing in...";
                }
            }

            const apiBase = window.location.port === "5500"
                ? `${window.location.protocol}//${window.location.hostname}:8000`
                : "";

            fetch(`${apiBase}/api/hospital/login/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            })
            .then(function (response) {
                return response.json().then(function (data) {
                    if (!response.ok) {
                        throw new Error(data.message || "Invalid username or password.");
                    }
                    return data;
                });
            })
            .then(function (data) {
                if (loginButton) {
                    loginButton.classList.remove("loading");
                    loginButton.removeAttribute("disabled");
                    const buttonText = loginButton.querySelector("#buttonText");
                    if (buttonText) {
                        buttonText.textContent = "Login to Hospital Portal";
                    }
                }
                if (data.hospital) {
                    localStorage.setItem("hospital", JSON.stringify(data.hospital));
                }
                window.location.href = "/hospital/hospital_dashboard/hospital_dashboard.html";
            })
            .catch(function (error) {
                if (loginButton) {
                    loginButton.classList.remove("loading");
                    loginButton.removeAttribute("disabled");
                }
                showMessage("error", error.message);
            });
        });
    }

    if (forgotPassword) {
        forgotPassword.addEventListener("click", function (event) {
            event.preventDefault();
            alert("Password reset flow will be connected to the backend later.");
        });
    }
});