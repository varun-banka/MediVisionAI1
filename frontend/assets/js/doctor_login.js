/* =========================================================
   MEDVISIONAI
   DOCTOR LOGIN
   ========================================================= */


/*
    Backend API

    This is only the endpoint placeholder.

    Once we create the backend, this endpoint
    will authenticate the doctor from the database.
*/

const DOCTOR_LOGIN_API =
    "/api/doctor/login/";



/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const loginForm =
    document.getElementById(
        "doctorLoginForm"
    );


const doctorEmail =
    document.getElementById(
        "doctorEmail"
    );


const doctorPassword =
    document.getElementById(
        "doctorPassword"
    );


const togglePassword =
    document.getElementById(
        "togglePassword"
    );


const rememberMe =
    document.getElementById(
        "rememberMe"
    );


const loginButton =
    document.getElementById(
        "loginButton"
    );


const buttonText =
    document.getElementById(
        "buttonText"
    );


const buttonSpinner =
    document.getElementById(
        "buttonSpinner"
    );


const formMessage =
    document.getElementById(
        "formMessage"
    );


/* =========================================================
   PASSWORD VISIBILITY
   ========================================================= */

togglePassword.addEventListener(
    "click",
    function () {

        const icon =
            togglePassword.querySelector(
                "i"
            );


        if (
            doctorPassword.type === "password"
        ) {

            doctorPassword.type =
                "text";

            icon.className =
                "bi bi-eye-slash";

        }

        else {

            doctorPassword.type =
                "password";

            icon.className =
                "bi bi-eye";

        }

    }
);



/* =========================================================
   CLEAR ERROR WHEN USER TYPES
   ========================================================= */

doctorEmail.addEventListener(
    "input",
    function () {

        clearFieldError(
            "emailError"
        );

        this.classList.remove(
            "input-error"
        );

    }
);


doctorPassword.addEventListener(
    "input",
    function () {

        clearFieldError(
            "passwordError"
        );

        this.classList.remove(
            "input-error"
        );

    }
);



/* =========================================================
   LOGIN FORM
   ========================================================= */

loginForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        clearErrors();

        hideMessage();


        /* Validate */

        const valid =
            validateLogin();


        if (!valid) {

            return;

        }


        setLoading(
            true
        );


        try {

            /*
                Send login details to backend.

                The backend should verify:

                email
                password

                and return authentication
                information.
            */

            const response =
                await fetch(
                    DOCTOR_LOGIN_API,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        credentials: "include",

                        body: JSON.stringify({

                            email:
                                doctorEmail.value.trim(),

                            password:
                                doctorPassword.value,

                            remember_me:
                                rememberMe.checked

                        })

                    }
                );


            let data = {};


            try {

                data =
                    await response.json();

            }

            catch {

                data = {};

            }


            /* Backend returned an error */

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Invalid email or password."
                );

            }


            /* Successful login */

            showMessage(
                data.message ||
                "Login successful. Redirecting...",
                "success"
            );


            /*
                If backend gives a redirect URL,
                use that.

                Otherwise go to dashboard.
            */

            setTimeout(
                function () {

                    if (
                        data.redirect_url
                    ) {

                        window.location.href =
                            data.redirect_url;

                    }

                    else {

                        window.location.href =
                            "doctor_dashboard.html";

                    }

                },
                800
            );

        }

        catch (error) {

            console.error(
                "Doctor login error:",
                error
            );


            showMessage(
                error.message ||
                "Unable to login. Please try again.",
                "error"
            );

        }

        finally {

            setLoading(
                false
            );

        }

    }
);



/* =========================================================
   VALIDATION
   ========================================================= */

function validateLogin() {

    let valid =
        true;


    /* ---------------------------------------------
       EMAIL
       --------------------------------------------- */

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (
        doctorEmail.value.trim() === ""
    ) {

        showFieldError(
            "emailError",
            "Email address is required."
        );

        doctorEmail.classList.add(
            "input-error"
        );

        valid = false;

    }

    else if (
        !emailPattern.test(
            doctorEmail.value.trim()
        )
    ) {

        showFieldError(
            "emailError",
            "Please enter a valid email address."
        );

        doctorEmail.classList.add(
            "input-error"
        );

        valid = false;

    }



    /* ---------------------------------------------
       PASSWORD
       --------------------------------------------- */

    if (
        doctorPassword.value === ""
    ) {

        showFieldError(
            "passwordError",
            "Password is required."
        );

        doctorPassword.classList.add(
            "input-error"
        );

        valid = false;

    }

    else if (
        doctorPassword.value.length < 8
    ) {

        showFieldError(
            "passwordError",
            "Password must contain at least 8 characters."
        );

        doctorPassword.classList.add(
            "input-error"
        );

        valid = false;

    }


    return valid;

}



/* =========================================================
   FORGOT PASSWORD
   ========================================================= */

const forgotPassword =
    document.getElementById(
        "forgotPassword"
    );


forgotPassword.addEventListener(
    "click",
    function (event) {

        event.preventDefault();


        /*
            We don't implement password reset
            in frontend yet.

            Later this will connect to:

            /api/doctor/forgot-password

            and send an OTP/email.
        */

        showMessage(
            "Password recovery will be available once the authentication backend is connected.",
            "error"
        );

    }
);



/* =========================================================
   ERROR FUNCTIONS
   ========================================================= */

function showFieldError(
    id,
    message
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =
            message;

    }

}



function clearFieldError(
    id
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =
            "";

    }

}



function clearErrors() {

    clearFieldError(
        "emailError"
    );


    clearFieldError(
        "passwordError"
    );


    doctorEmail.classList.remove(
        "input-error"
    );


    doctorPassword.classList.remove(
        "input-error"
    );

}



/* =========================================================
   MESSAGE
   ========================================================= */

function showMessage(
    message,
    type
) {

    formMessage.textContent =
        message;


    formMessage.className =
        "form-message " +
        type;


    formMessage.hidden =
        false;

}



function hideMessage() {

    formMessage.textContent =
        "";

    formMessage.hidden =
        true;

}



/* =========================================================
   LOADING
   ========================================================= */

function setLoading(
    loading
) {

    loginButton.disabled =
        loading;


    if (loading) {

        buttonText.textContent =
            "Signing In...";


        buttonSpinner.hidden =
            false;

    }

    else {

        buttonText.textContent =
            "Login to Doctor Portal";


        buttonSpinner.hidden =
            true;

    }

}