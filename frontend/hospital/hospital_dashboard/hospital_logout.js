// =========================================================
// MEDVISIONAI - HOSPITAL LOGOUT JS
// =========================================================


document.addEventListener(
    "DOMContentLoaded",
    function () {


        // =================================================
        // CLEAR HOSPITAL LOGIN DATA
        // =================================================

        /*
            If later we store hospital authentication
            information in localStorage/sessionStorage,
            it will be cleared here.
        */

        localStorage.removeItem(
            "hospitalUser"
        );

        localStorage.removeItem(
            "hospitalToken"
        );

        localStorage.removeItem(
            "hospitalId"
        );

        sessionStorage.removeItem(
            "hospitalUser"
        );

        sessionStorage.removeItem(
            "hospitalToken"
        );

        sessionStorage.removeItem(
            "hospitalId"
        );


        // =================================================
        // REDIRECT TO HOSPITAL LOGIN
        // =================================================

        setTimeout(
            function () {

                window.location.href =
                    "hospital_login.html";

            },
            2000
        );

    }
);