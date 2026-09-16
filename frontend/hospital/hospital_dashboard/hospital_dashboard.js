// =========================================================
// MEDVISIONAI - HOSPITAL DASHBOARD JS
// =========================================================

document.addEventListener("DOMContentLoaded", function () {

    // =====================================================
    // ELEMENTS
    // =====================================================

    const sidebar = document.getElementById("sidebar");
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const sidebarOverlay = document.getElementById("sidebarOverlay");

    const notificationBtn =
        document.getElementById("notificationBtn");

    const notificationDot =
        document.getElementById("notificationDot");


    // =====================================================
    // MOBILE SIDEBAR
    // =====================================================

    if (mobileMenuBtn) {

        mobileMenuBtn.addEventListener("click", function () {

            sidebar.classList.toggle("sidebar-open");

            sidebarOverlay.classList.toggle("active");

        });

    }


    // =====================================================
    // CLOSE SIDEBAR WHEN OVERLAY IS CLICKED
    // =====================================================

    if (sidebarOverlay) {

        sidebarOverlay.addEventListener("click", function () {

            sidebar.classList.remove("sidebar-open");

            sidebarOverlay.classList.remove("active");

        });

    }


    // =====================================================
    // CLOSE SIDEBAR AFTER CLICKING MENU ITEM
    // =====================================================

    const sidebarLinks =
        document.querySelectorAll(".sidebar-menu a");

    sidebarLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            if (window.innerWidth <= 992) {

                sidebar.classList.remove("sidebar-open");

                sidebarOverlay.classList.remove("active");

            }

        });

    });


    // =====================================================
    // NOTIFICATION BUTTON
    // =====================================================

    if (notificationBtn) {

        notificationBtn.addEventListener("click", function () {

            showNotificationMessage();

        });

    }


    // =====================================================
    // LOAD HOSPITAL DATA
    // =====================================================

    loadHospitalDashboard();


    // =====================================================
    // LOAD HOSPITAL NAME
    // =====================================================

    loadHospitalName();


    // =====================================================
    // RESPONSIVE SIDEBAR
    // =====================================================

    window.addEventListener("resize", function () {

        if (window.innerWidth > 992) {

            sidebar.classList.remove("sidebar-open");

            sidebarOverlay.classList.remove("active");

        }

    });

});


// =========================================================
// LOAD HOSPITAL DASHBOARD
// =========================================================
//
// IMPORTANT:
//
// At this stage we DO NOT use dummy data.
//
// These values remain "--".
//
// Later Django will provide:
//
// Doctors
// Patients
// Appointments
// Reports
//
// through an API.
//
// Example future API:
//
// GET /api/hospital/dashboard/
//
// =========================================================

async function loadHospitalDashboard() {

    try {

        /*
        =====================================================
        FUTURE DJANGO API

        const response = await fetch(
            "/api/hospital/dashboard/",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        if (!response.ok) {
            throw new Error("Unable to load dashboard");
        }

        const data = await response.json();

        updateDashboardStats(data);

        =====================================================
        */

        // Keep dashboard empty until backend is connected.

        setDashboardValue(
            "totalDoctors",
            "--"
        );

        setDashboardValue(
            "totalPatients",
            "--"
        );

        setDashboardValue(
            "todayAppointments",
            "--"
        );

        setDashboardValue(
            "totalReports",
            "--"
        );


    } catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );

    }

}


// =========================================================
// UPDATE DASHBOARD STATISTICS
// =========================================================
//
// This function will be used when Django API is connected.
//
// Expected backend response:
//
// {
//     "total_doctors": 10,
//     "total_patients": 150,
//     "today_appointments": 12,
//     "total_reports": 85
// }
//
// =========================================================

function updateDashboardStats(data) {

    setDashboardValue(
        "totalDoctors",
        data.total_doctors ?? 0
    );

    setDashboardValue(
        "totalPatients",
        data.total_patients ?? 0
    );

    setDashboardValue(
        "todayAppointments",
        data.today_appointments ?? 0
    );

    setDashboardValue(
        "totalReports",
        data.total_reports ?? 0
    );

}


// =========================================================
// SET DASHBOARD VALUE
// =========================================================

function setDashboardValue(elementId, value) {

    const element =
        document.getElementById(elementId);

    if (element) {

        element.textContent = value;

    }

}


// =========================================================
// LOAD HOSPITAL NAME
// =========================================================
//
// Later this will come from Django:
//
// GET /api/hospital/profile/
//
// =========================================================

async function loadHospitalName() {

    const hospitalName =
        document.getElementById("hospitalName");

    if (!hospitalName) {
        return;
    }


    /*
    =====================================================
    FUTURE DJANGO API

    try {

        const response = await fetch(
            "/api/hospital/profile/"
        );

        const data = await response.json();

        hospitalName.textContent =
            data.hospital_name;

    } catch (error) {

        console.error(error);

    }

    =====================================================
    */


    // No dummy hospital name.
    hospitalName.textContent = "Hospital";

}


// =========================================================
// NOTIFICATION
// =========================================================

function showNotificationMessage() {

    const notificationDot =
        document.getElementById("notificationDot");

    if (notificationDot) {

        notificationDot.style.display = "none";

    }


    /*
    Later this section will show real notifications:

    - New patient registered
    - Doctor assigned
    - Appointment created
    - Medical report uploaded
    - Medicine prescription updated
    - Message received

    These notifications will come from Django/PostgreSQL.
    */


    alert(
        "No new hospital notifications."
    );

}


// =========================================================
// FUTURE: LOAD APPOINTMENTS
// =========================================================
//
// The hospital dashboard will receive appointments created
// by hospital management.
//
// Example:
//
// GET /api/hospital/appointments/recent/
//
// =========================================================

async function loadRecentAppointments() {

    /*
    Future implementation:

    const response = await fetch(
        "/api/hospital/appointments/recent/"
    );

    const appointments = await response.json();

    renderAppointments(appointments);
    */

}


// =========================================================
// FUTURE: RENDER APPOINTMENTS
// =========================================================

function renderAppointments(appointments) {

    const emptyState =
        document.getElementById("appointmentsEmpty");

    const list =
        document.getElementById("appointmentsList");


    if (!list || !emptyState) {
        return;
    }


    // Remove previous content

    list.innerHTML = "";


    if (!appointments || appointments.length === 0) {

        emptyState.style.display = "flex";

        list.style.display = "none";

        return;

    }


    emptyState.style.display = "none";

    list.style.display = "flex";


    appointments.forEach(function (appointment) {

        const item =
            document.createElement("div");

        item.className =
            "appointment-item";


        item.innerHTML = `

            <div>

                <strong>
                    ${escapeHTML(
                        appointment.patient_name
                    )}
                </strong>

                <small>
                    Dr.
                    ${escapeHTML(
                        appointment.doctor_name
                    )}
                </small>

            </div>

            <div>

                <strong>
                    ${escapeHTML(
                        appointment.date
                    )}
                </strong>

                <small>
                    ${escapeHTML(
                        appointment.time
                    )}
                </small>

            </div>

        `;


        list.appendChild(item);

    });

}


// =========================================================
// FUTURE: LOAD RECENT ACTIVITY
// =========================================================

async function loadRecentActivity() {

    /*
    Future Django endpoint:

    GET /api/hospital/activity/

    Activities can include:

    Doctor registered
    Patient registered
    Appointment created
    Report uploaded
    Medicine assigned
    Message received
    */


}


// =========================================================
// FUTURE: RENDER ACTIVITY
// =========================================================

function renderActivity(activities) {

    const emptyState =
        document.getElementById("activityEmpty");

    const list =
        document.getElementById("activityList");


    if (!list || !emptyState) {
        return;
    }


    list.innerHTML = "";


    if (!activities || activities.length === 0) {

        emptyState.style.display = "flex";

        list.style.display = "none";

        return;

    }


    emptyState.style.display = "none";

    list.style.display = "flex";


    activities.forEach(function (activity) {

        const item =
            document.createElement("div");

        item.className =
            "activity-item";


        item.innerHTML = `

            <div>

                <strong>
                    ${escapeHTML(
                        activity.title
                    )}
                </strong>

                <small>
                    ${escapeHTML(
                        activity.description
                    )}
                </small>

            </div>

            <span>
                ${escapeHTML(
                    activity.time
                )}
            </span>

        `;


        list.appendChild(item);

    });

}


// =========================================================
// ESCAPE HTML
// =========================================================
//
// Prevents unsafe HTML from being inserted into the page.
//
// This becomes important when real database information
// is displayed.
// =========================================================

function escapeHTML(value) {

    if (value === null || value === undefined) {

        return "";

    }


    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


// =========================================================
// LOGOUT
// =========================================================
//
// Actual Django logout will be connected later.
//
// =========================================================

function logoutHospital() {

    /*
    Future:

    fetch("/api/hospital/logout/", {
        method: "POST"
    })
    .then(() => {
        window.location.href =
            "hospital_login.html";
    });
    */

    window.location.href =
        "hospital_login.html";

}