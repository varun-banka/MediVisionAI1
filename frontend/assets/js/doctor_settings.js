/* =========================================================
   MEDVISIONAI
   DOCTOR SETTINGS
   ========================================================= */


/*
    Backend endpoints to connect later:

    GET
    /api/doctor/settings

    PUT
    /api/doctor/settings

    POST
    /api/doctor/change-password

    GET
    /api/doctor/sessions

*/


const API = {

    settings:
        "/api/doctor/settings/",

    password:
        "/api/doctor/change-password/",

    sessions:
        "/api/doctor/sessions/"

};


/* =========================================================
   ELEMENTS
   ========================================================= */

const menuItems =
    document.querySelectorAll(
        ".settings-menu-item"
    );

const sections =
    document.querySelectorAll(
        ".settings-section"
    );

const saveButton =
    document.getElementById(
        "saveSettings"
    );

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


/* =========================================================
   SETTINGS STORAGE
   ========================================================= */

const settingIds = [

    "appointmentNotifications",

    "messageNotifications",

    "reportNotifications",

    "medicineNotifications",

    "patientChat",

    "smsNotifications",

    "activityTracking"

];


/* =========================================================
   PAGE LOAD
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadDoctorData();

        loadSettings();

    }
);


/* =========================================================
   SIDEBAR SETTINGS NAVIGATION
   ========================================================= */

menuItems.forEach(
    function (item) {

        item.addEventListener(
            "click",
            function () {

                const target =
                    this.dataset.section;


                menuItems.forEach(
                    function (menu) {

                        menu.classList.remove(
                            "active"
                        );

                    }
                );


                sections.forEach(
                    function (section) {

                        section.classList.remove(
                            "active"
                        );

                    }
                );


                this.classList.add(
                    "active"
                );


                const targetSection =
                    document.getElementById(
                        target
                    );


                if (targetSection) {

                    targetSection.classList.add(
                        "active"
                    );

                }

            }
        );

    }
);


/* =========================================================
   LOAD DOCTOR INFORMATION
   ========================================================= */

async function loadDoctorData() {

    /*
        Do not create dummy doctor information.

        The actual information should come from
        the authenticated doctor session/backend.
    */


    const storedDoctor =
        localStorage.getItem(
            "doctor"
        );


    if (!storedDoctor) {

        return;

    }


    try {

        const doctor =
            JSON.parse(
                storedDoctor
            );


        updateDoctorHeader(
            doctor
        );

    }

    catch (error) {

        console.error(
            "Unable to read doctor data:",
            error
        );

    }

}


/* =========================================================
   UPDATE DOCTOR HEADER
   ========================================================= */

function updateDoctorHeader(
    doctor
) {

    if (!doctor) {

        return;

    }


    const name =
        doctor.full_name ||
        doctor.name;


    const nameElement =
        document.getElementById(
            "topDoctorName"
        );


    if (
        nameElement &&
        name
    ) {

        nameElement.textContent =
            name;

    }


    const photo =
        doctor.profile_photo ||
        doctor.photo ||
        doctor.profile_image;


    if (photo) {

        const image =
            document.getElementById(
                "topDoctorPhoto"
            );

        const icon =
            document.getElementById(
                "topDoctorIcon"
            );


        image.src =
            photo;

        image.hidden =
            false;

        icon.hidden =
            true;

    }

}


/* =========================================================
   LOAD SETTINGS
   ========================================================= */

async function loadSettings() {

    try {

        const response =
            await fetch(
                API.settings,
                {

                    method: "GET",

                    headers: {

                        "Content-Type":
                            "application/json"

                    }

                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load settings"
            );

        }


        const data =
            await response.json();


        applySettings(
            data.settings ||
            data
        );

    }

    catch (error) {

        console.log(
            "Settings API is not connected yet."
        );


        /*
            No dummy values are created.

            Existing browser-saved settings
            can still be used for frontend testing.
        */

        loadLocalSettings();

    }

}


/* =========================================================
   APPLY SETTINGS
   ========================================================= */

function applySettings(
    settings
) {

    if (!settings) {

        return;

    }


    settingIds.forEach(
        function (id) {

            const element =
                document.getElementById(
                    id
                );


            if (
                element &&
                typeof settings[id] !==
                "undefined"
            ) {

                element.checked =
                    Boolean(
                        settings[id]
                    );

            }

        }
    );

}


/* =========================================================
   LOCAL SETTINGS
   ========================================================= */

function loadLocalSettings() {

    const saved =
        localStorage.getItem(
            "doctorSettings"
        );


    if (!saved) {

        return;

    }


    try {

        const settings =
            JSON.parse(
                saved
            );


        applySettings(
            settings
        );

    }

    catch (error) {

        console.error(
            "Local settings error:",
            error
        );

    }

}


/* =========================================================
   SAVE SETTINGS
   ========================================================= */

saveButton.addEventListener(
    "click",
    saveSettings
);


async function saveSettings() {

    const settings =
        getCurrentSettings();


    try {

        const response =
            await fetch(
                API.settings,
                {

                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            settings
                        )

                }
            );


        if (!response.ok) {

            throw new Error(
                "Settings update failed"
            );

        }


        showMessage(
            "Settings saved successfully."
        );

    }

    catch (error) {

        console.log(
            "Backend not connected. Saving locally for frontend testing."
        );


        localStorage.setItem(
            "doctorSettings",
            JSON.stringify(
                settings
            )
        );


        showMessage(
            "Settings saved."
        );

    }

}


/* =========================================================
   GET CURRENT SETTINGS
   ========================================================= */

function getCurrentSettings() {

    const settings = {};


    settingIds.forEach(
        function (id) {

            const element =
                document.getElementById(
                    id
                );


            if (element) {

                settings[id] =
                    element.checked;

            }

        }
    );


    return settings;

}


/* =========================================================
   CHANGE PASSWORD
   ========================================================= */

const changePasswordButton =
    document.getElementById(
        "changePasswordButton"
    );


const passwordModalElement =
    document.getElementById(
        "passwordModal"
    );


const passwordModal =
    new bootstrap.Modal(
        passwordModalElement
    );


changePasswordButton.addEventListener(
    "click",
    function () {

        document
            .getElementById(
                "passwordForm"
            )
            .reset();


        passwordModal.show();

    }
);


/* =========================================================
   PASSWORD FORM
   ========================================================= */

document
    .getElementById(
        "passwordForm"
    )
    .addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const currentPassword =
                document.getElementById(
                    "currentPassword"
                ).value;


            const newPassword =
                document.getElementById(
                    "newPassword"
                ).value;


            const confirmPassword =
                document.getElementById(
                    "confirmPassword"
                ).value;


            if (
                !currentPassword ||
                !newPassword ||
                !confirmPassword
            ) {

                showMessage(
                    "Please fill all password fields."
                );

                return;

            }


            if (
                newPassword !==
                confirmPassword
            ) {

                showMessage(
                    "New passwords do not match."
                );

                return;

            }


            if (
                newPassword.length < 8
            ) {

                showMessage(
                    "Password must contain at least 8 characters."
                );

                return;

            }


            const passwordData = {

                current_password:
                    currentPassword,

                new_password:
                    newPassword

            };


            try {

                const response =
                    await fetch(
                        API.password,
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify(
                                    passwordData
                                )

                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "Password update failed"
                    );

                }


                passwordModal.hide();


                showMessage(
                    "Password updated successfully."
                );

            }

            catch (error) {

                console.error(
                    error
                );


                showMessage(
                    "Password update requires the backend API."
                );

            }

        }
    );


/* =========================================================
   MANAGE SESSIONS
   ========================================================= */

const sessionsButton =
    document.getElementById(
        "sessionsButton"
    );


sessionsButton.addEventListener(
    "click",
    async function () {

        try {

            const response =
                await fetch(
                    API.sessions,
                    {

                        method: "GET",

                        headers: {

                            "Content-Type":
                                "application/json"

                        }

                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Unable to retrieve sessions"
                );

            }


            const data =
                await response.json();


            console.log(
                "Active sessions:",
                data
            );


            showMessage(
                "Session information loaded."
            );

        }

        catch (error) {

            showMessage(
                "Session management requires the backend API."
            );

        }

    }
);


/* =========================================================
   LOGOUT
   ========================================================= */

logoutButton.addEventListener(
    "click",
    function () {

        localStorage.removeItem(
            "doctor"
        );

        localStorage.removeItem(
            "doctorToken"
        );

        localStorage.removeItem(
            "doctorSettings"
        );


        window.location.href =
            "doctor_login.html";

    }
);


/* =========================================================
   MESSAGE
   ========================================================= */

function showMessage(
    message
) {

    const existing =
        document.querySelector(
            ".settings-toast"
        );


    if (existing) {

        existing.remove();

    }


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        "settings-toast";


    toast.textContent =
        message;


    document.body.appendChild(
        toast
    );


    setTimeout(
        function () {

            toast.classList.add(
                "hide"
            );


            setTimeout(
                function () {

                    toast.remove();

                },
                300
            );

        },
        2500
    );

}