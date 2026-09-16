/* =========================================================
   MEDVISIONAI
   DOCTOR SIGNUP
   ========================================================= */


/*
    IMPORTANT:

    This frontend does NOT create dummy accounts.

    When your backend is ready, change:

        DOCTOR_SIGNUP_API

    to your real backend endpoint.

*/


const DOCTOR_SIGNUP_API =
    "/api/doctor/signup/";



/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const signupForm =
    document.getElementById(
        "doctorSignupForm"
    );


const doctorPhoto =
    document.getElementById(
        "doctorPhoto"
    );


const photoPreview =
    document.getElementById(
        "photoPreview"
    );


const photoIcon =
    document.getElementById(
        "photoIcon"
    );


const togglePassword =
    document.getElementById(
        "togglePassword"
    );


const toggleConfirmPassword =
    document.getElementById(
        "toggleConfirmPassword"
    );


const password =
    document.getElementById(
        "password"
    );


const confirmPassword =
    document.getElementById(
        "confirmPassword"
    );


const signupButton =
    document.getElementById(
        "signupButton"
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
   PROFILE PHOTO PREVIEW
   ========================================================= */

doctorPhoto.addEventListener(
    "change",
    function () {

        const file =
            this.files[0];


        clearFieldError(
            "photoError"
        );


        if (!file) {

            photoPreview.hidden =
                true;

            photoIcon.hidden =
                false;

            return;

        }


        const allowedTypes = [
            "image/jpeg",
            "image/png"
        ];


        if (
            !allowedTypes.includes(
                file.type
            )
        ) {

            showFieldError(
                "photoError",
                "Only JPG, JPEG or PNG images are allowed."
            );

            this.value = "";

            return;

        }


        const maxSize =
            5 * 1024 * 1024;


        if (
            file.size > maxSize
        ) {

            showFieldError(
                "photoError",
                "Profile photo must be smaller than 5 MB."
            );

            this.value = "";

            return;

        }


        const reader =
            new FileReader();


        reader.onload =
            function (event) {

                photoPreview.src =
                    event.target.result;

                photoPreview.hidden =
                    false;

                photoIcon.hidden =
                    true;

            };


        reader.readAsDataURL(
            file
        );

    }
);



/* =========================================================
   PASSWORD VISIBILITY
   ========================================================= */

togglePassword.addEventListener(
    "click",
    function () {

        togglePasswordVisibility(
            password,
            togglePassword
        );

    }
);


toggleConfirmPassword.addEventListener(
    "click",
    function () {

        togglePasswordVisibility(
            confirmPassword,
            toggleConfirmPassword
        );

    }
);



function togglePasswordVisibility(
    input,
    button
) {

    const icon =
        button.querySelector(
            "i"
        );


    if (
        input.type === "password"
    ) {

        input.type =
            "text";

        icon.className =
            "bi bi-eye-slash";

    }

    else {

        input.type =
            "password";

        icon.className =
            "bi bi-eye";

    }

}



/* =========================================================
   PASSWORD STRENGTH
   ========================================================= */

password.addEventListener(
    "input",
    function () {

        updatePasswordStrength(
            this.value
        );

        clearFieldError(
            "passwordError"
        );

    }
);



function updatePasswordStrength(
    value
) {

    const strength =
        document.getElementById(
            "passwordStrength"
        );


    if (!value) {

        strength.style.width =
            "0";

        strength.style.background =
            "transparent";

        return;

    }


    let score = 0;


    if (
        value.length >= 8
    ) {

        score++;

    }


    if (
        /[A-Z]/.test(value)
    ) {

        score++;

    }


    if (
        /[a-z]/.test(value)
    ) {

        score++;

    }


    if (
        /[0-9]/.test(value)
    ) {

        score++;

    }


    if (
        /[^A-Za-z0-9]/.test(value)
    ) {

        score++;

    }


    if (score <= 2) {

        strength.style.width =
            "35%";

        strength.style.background =
            "#ef4444";

    }

    else if (score <= 4) {

        strength.style.width =
            "70%";

        strength.style.background =
            "#f59e0b";

    }

    else {

        strength.style.width =
            "100%";

        strength.style.background =
            "#10b981";

    }

}



/* =========================================================
   FORM SUBMIT
   ========================================================= */

signupForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        clearAllErrors();

        hideMessage();


        const isValid =
            validateForm();


        if (!isValid) {

            return;

        }


        setLoading(
            true
        );


        try {

            /*
                FormData allows us to send both:

                - text fields
                - profile photo

                to the backend.
            */

            const formData =
                new FormData(
                    signupForm
                );


            const response =
                await fetch(
                    DOCTOR_SIGNUP_API,
                    {
                        method: "POST",

                        body: formData,

                        credentials: "include"
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


            if (!response.ok) {

                const validationErrors =
                    Object.values(data.errors || {})
                        .flat()
                        .join(" ");

                throw new Error(
                    validationErrors ||
                    data.message ||
                    "Doctor registration failed."
                );

            }


            showMessage(
                data.message ||
                "Doctor account created successfully.",
                "success"
            );


            signupForm.reset();


            photoPreview.hidden =
                true;

            photoIcon.hidden =
                false;


            document
                .getElementById(
                    "passwordStrength"
                )
                .style.width =
                "0";


            /*
                If your backend returns a login
                redirect, use it.

                Otherwise redirect to login
                after successful registration.
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
                            "doctor_login.html";

                    }

                },
                1500
            );

        }

        catch (error) {

            console.error(
                "Doctor signup error:",
                error
            );


            showMessage(
                error.message ||
                "Unable to create doctor account. Please try again.",
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

function validateForm() {

    let valid =
        true;


    const doctorName =
        document.getElementById(
            "doctorName"
        );


    const doctorPhone =
        document.getElementById(
            "doctorPhone"
        );


    const doctorEmail =
        document.getElementById(
            "doctorEmail"
        );


    const specialization =
        document.getElementById(
            "specialization"
        );


    const registrationNumber =
        document.getElementById(
            "registrationNumber"
        );


    const hospitalName =
        document.getElementById(
            "hospitalName"
        );


    const experience =
        document.getElementById(
            "experience"
        );


    const terms =
        document.getElementById(
            "terms"
        );



    /* ---------------------------------------------
       NAME
       --------------------------------------------- */

    if (
        doctorName.value.trim().length < 3
    ) {

        showFieldError(
            "doctorNameError",
            "Please enter the doctor's full name."
        );

        doctorName.classList.add(
            "input-error"
        );

        valid = false;

    }



    /* ---------------------------------------------
       PHONE
       --------------------------------------------- */

    const phonePattern =
        /^[6-9][0-9]{9}$/;


    if (
        !phonePattern.test(
            doctorPhone.value.trim()
        )
    ) {

        showFieldError(
            "doctorPhoneError",
            "Enter a valid 10-digit Indian mobile number."
        );

        doctorPhone.classList.add(
            "input-error"
        );

        valid = false;

    }



    /* ---------------------------------------------
       EMAIL
       --------------------------------------------- */

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (
        !emailPattern.test(
            doctorEmail.value.trim()
        )
    ) {

        showFieldError(
            "doctorEmailError",
            "Enter a valid email address."
        );

        doctorEmail.classList.add(
            "input-error"
        );

        valid = false;

    }



    /* ---------------------------------------------
       SPECIALIZATION
       --------------------------------------------- */

    if (
        !specialization.value
    ) {

        showFieldError(
            "specializationError",
            "Please select a specialization."
        );

        specialization.classList.add(
            "input-error"
        );

        valid = false;

    }



    /* ---------------------------------------------
       REGISTRATION NUMBER
       --------------------------------------------- */

    if (
        registrationNumber.value.trim().length < 3
    ) {

        showFieldError(
            "registrationNumberError",
            "Medical registration number is required."
        );

        registrationNumber.classList.add(
            "input-error"
        );

        valid = false;

    }



    /* ---------------------------------------------
       HOSPITAL
       --------------------------------------------- */

    if (
        hospitalName.value.trim().length < 2
    ) {

        showFieldError(
            "hospitalNameError",
            "Please enter hospital or clinic name."
        );

        hospitalName.classList.add(
            "input-error"
        );

        valid = false;

    }



    /* ---------------------------------------------
       EXPERIENCE
       --------------------------------------------- */

    const experienceValue =
        Number(
            experience.value
        );


    if (
        experience.value === "" ||
        experienceValue < 0 ||
        experienceValue > 70
    ) {

        showFieldError(
            "experienceError",
            "Enter valid years of experience."
        );

        experience.classList.add(
            "input-error"
        );

        valid = false;

    }



    /* ---------------------------------------------
       PASSWORD
       --------------------------------------------- */

    if (
        password.value.length < 8
    ) {

        showFieldError(
            "passwordError",
            "Password must contain at least 8 characters."
        );

        password.classList.add(
            "input-error"
        );

        valid = false;

    }



    /* ---------------------------------------------
       CONFIRM PASSWORD
       --------------------------------------------- */

    if (
        confirmPassword.value !==
        password.value
    ) {

        showFieldError(
            "confirmPasswordError",
            "Passwords do not match."
        );

        confirmPassword.classList.add(
            "input-error"
        );

        valid = false;

    }



    /* ---------------------------------------------
       TERMS
       --------------------------------------------- */

    if (
        !terms.checked
    ) {

        showFieldError(
            "termsError",
            "You must accept the terms and conditions."
        );

        valid = false;

    }


    return valid;

}



/* =========================================================
   CLEAR ERRORS
   ========================================================= */

function clearAllErrors() {

    document
        .querySelectorAll(
            ".field-error"
        )
        .forEach(
            element => {

                element.textContent =
                    "";

            }
        );


    document
        .querySelectorAll(
            ".input-error"
        )
        .forEach(
            element => {

                element.classList.remove(
                    "input-error"
                );

            }
        );


    document.getElementById(
        "photoError"
    ).textContent =
        "";

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



/* =========================================================
   SHOW FIELD ERROR
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

    formMessage.hidden =
        true;

    formMessage.textContent =
        "";

}



/* =========================================================
   LOADING STATE
   ========================================================= */

function setLoading(
    loading
) {

    signupButton.disabled =
        loading;


    if (loading) {

        buttonText.textContent =
            "Creating Account...";


        buttonSpinner.hidden =
            false;

    }

    else {

        buttonText.textContent =
            "Create Doctor Account";


        buttonSpinner.hidden =
            true;

    }

}