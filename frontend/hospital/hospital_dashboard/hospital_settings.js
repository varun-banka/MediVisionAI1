// =========================================================
// MEDVISIONAI - HOSPITAL SETTINGS JS
// =========================================================

document.addEventListener("DOMContentLoaded", function () {


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const settingsTabs =
        document.querySelectorAll(".settings-tab");

    const settingsPanels =
        document.querySelectorAll(".settings-panel");

    const mobileMenuBtn =
        document.getElementById("mobileMenuBtn");

    const sidebar =
        document.getElementById("sidebar");

    const sidebarOverlay =
        document.getElementById("sidebarOverlay");

    const notificationBtn =
        document.getElementById("notificationBtn");

    const logoutBtn =
        document.getElementById("logoutBtn");


    /* =====================================================
       SETTINGS TAB SWITCHING
    ===================================================== */

    settingsTabs.forEach(function (tab) {

        tab.addEventListener("click", function () {

            const targetSection =
                tab.dataset.section;


            /* Remove active from tabs */

            settingsTabs.forEach(function (item) {

                item.classList.remove("active");

            });


            /* Remove active from panels */

            settingsPanels.forEach(function (panel) {

                panel.classList.remove("active");

            });


            /* Activate selected tab */

            tab.classList.add("active");


            /* Activate selected panel */

            const targetPanel =
                document.getElementById(
                    targetSection
                );


            if (targetPanel) {

                targetPanel.classList.add(
                    "active"
                );

            }

        });

    });


    /* =====================================================
       SAVE ACCOUNT SETTINGS
    ===================================================== */

    const saveAccountBtn =
        document.getElementById(
            "saveAccountBtn"
        );


    if (saveAccountBtn) {

        saveAccountBtn.addEventListener(
            "click",
            function () {


                const adminName =
                    document.getElementById(
                        "adminName"
                    ).value.trim();


                const adminEmail =
                    document.getElementById(
                        "adminEmail"
                    ).value.trim();


                const adminPhone =
                    document.getElementById(
                        "adminPhone"
                    ).value.trim();


                if (!adminName) {

                    alert(
                        "Please enter administrator name."
                    );

                    return;

                }


                if (!adminEmail) {

                    alert(
                        "Please enter administrator email."
                    );

                    return;

                }


                if (!adminPhone) {

                    alert(
                        "Please enter phone number."
                    );

                    return;

                }


                /*
                    FUTURE DJANGO API

                    fetch(
                        "/api/hospital/settings/account/",
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                name: adminName,
                                email: adminEmail,
                                phone: adminPhone
                            })
                        }
                    );
                */


                alert(
                    "Account settings saved successfully!"
                );

            }
        );

    }


    /* =====================================================
       SAVE NOTIFICATION SETTINGS
    ===================================================== */

    const saveNotificationBtn =
        document.getElementById(
            "saveNotificationBtn"
        );


    if (saveNotificationBtn) {

        saveNotificationBtn.addEventListener(
            "click",
            function () {


                const notificationSettings = {

                    newPatient:
                        document.getElementById(
                            "newPatientNotification"
                        ).checked,

                    appointment:
                        document.getElementById(
                            "appointmentNotification"
                        ).checked,

                    medicalReport:
                        document.getElementById(
                            "reportNotification"
                        ).checked,

                    medicine:
                        document.getElementById(
                            "medicineNotification"
                        ).checked,

                    system:
                        document.getElementById(
                            "systemNotification"
                        ).checked

                };


                console.log(
                    "Notification settings:",
                    notificationSettings
                );


                /*
                    FUTURE DJANGO API

                    fetch(
                        "/api/hospital/settings/notifications/",
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    notificationSettings
                                )
                        }
                    );
                */


                alert(
                    "Notification preferences saved!"
                );

            }
        );

    }


    /* =====================================================
       PASSWORD VISIBILITY
    ===================================================== */

    const passwordButtons =
        document.querySelectorAll(
            ".password-toggle"
        );


    passwordButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {


                    const targetId =
                        button.dataset.target;


                    const input =
                        document.getElementById(
                            targetId
                        );


                    if (!input) {
                        return;
                    }


                    const icon =
                        button.querySelector("i");


                    if (
                        input.type === "password"
                    ) {

                        input.type = "text";


                        icon.classList.remove(
                            "bi-eye"
                        );


                        icon.classList.add(
                            "bi-eye-slash"
                        );

                    } else {

                        input.type = "password";


                        icon.classList.remove(
                            "bi-eye-slash"
                        );


                        icon.classList.add(
                            "bi-eye"
                        );

                    }

                }
            );

        }
    );


    /* =====================================================
       CHANGE PASSWORD
    ===================================================== */

    const changePasswordBtn =
        document.getElementById(
            "changePasswordBtn"
        );


    if (changePasswordBtn) {

        changePasswordBtn.addEventListener(
            "click",
            function () {


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


                if (!currentPassword) {

                    alert(
                        "Please enter your current password."
                    );

                    return;

                }


                if (!newPassword) {

                    alert(
                        "Please enter a new password."
                    );

                    return;

                }


                if (newPassword.length < 8) {

                    alert(
                        "New password must contain at least 8 characters."
                    );

                    return;

                }


                if (
                    newPassword !==
                    confirmPassword
                ) {

                    alert(
                        "New password and confirm password do not match."
                    );

                    return;

                }


                /*
                    FUTURE DJANGO API

                    fetch(
                        "/api/hospital/change-password/",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                current_password:
                                    currentPassword,

                                new_password:
                                    newPassword
                            })
                        }
                    );
                */


                alert(
                    "Password changed successfully!"
                );


                document.getElementById(
                    "currentPassword"
                ).value = "";


                document.getElementById(
                    "newPassword"
                ).value = "";


                document.getElementById(
                    "confirmPassword"
                ).value = "";

            }
        );

    }


    /* =====================================================
       SAVE SYSTEM PREFERENCES
    ===================================================== */

    const savePreferencesBtn =
        document.getElementById(
            "savePreferencesBtn"
        );


    if (savePreferencesBtn) {

        savePreferencesBtn.addEventListener(
            "click",
            function () {


                const preferences = {

                    dateFormat:
                        document.getElementById(
                            "dateFormat"
                        ).value,

                    timeFormat:
                        document.getElementById(
                            "timeFormat"
                        ).value,

                    language:
                        document.getElementById(
                            "language"
                        ).value,

                    defaultPatientStatus:
                        document.getElementById(
                            "defaultPatientStatus"
                        ).value

                };


                console.log(
                    "System preferences:",
                    preferences
                );


                /*
                    FUTURE DJANGO API

                    fetch(
                        "/api/hospital/settings/preferences/",
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    preferences
                                )
                        }
                    );
                */


                alert(
                    "System preferences saved successfully!"
                );

            }
        );

    }


    /* =====================================================
       NOTIFICATION BUTTON
    ===================================================== */

    if (notificationBtn) {

        notificationBtn.addEventListener(
            "click",
            function () {

                alert(
                    "Hospital notifications will appear here."
                );

            }
        );

    }


    /* =====================================================
       MOBILE SIDEBAR
    ===================================================== */

    if (mobileMenuBtn) {

        mobileMenuBtn.addEventListener(
            "click",
            function () {


                if (sidebar) {

                    sidebar.classList.toggle(
                        "sidebar-open"
                    );

                }


                if (sidebarOverlay) {

                    sidebarOverlay.classList.toggle(
                        "active"
                    );

                }

            }
        );

    }


    /* =====================================================
       CLOSE MOBILE SIDEBAR
    ===================================================== */

    if (sidebarOverlay) {

        sidebarOverlay.addEventListener(
            "click",
            closeMobileSidebar
        );

    }


    function closeMobileSidebar() {


        if (sidebar) {

            sidebar.classList.remove(
                "sidebar-open"
            );

        }


        if (sidebarOverlay) {

            sidebarOverlay.classList.remove(
                "active"
            );

        }

    }


    /* =====================================================
       LOGOUT
    ===================================================== */

    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                const confirmed =
                    confirm(
                        "Are you sure you want to logout?"
                    );


                if (confirmed) {

                    /*
                        Later Django will handle
                        actual session logout.
                    */

                    window.location.href =
                        "hospital_login.html";

                }

            }
        );

    }


    /* =====================================================
       ESC KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape"
            ) {

                closeMobileSidebar();

            }

        }
    );


});