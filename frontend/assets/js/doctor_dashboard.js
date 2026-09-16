/* =========================================================
   MEDVISIONAI
   DOCTOR DASHBOARD
   ========================================================= */


/*
    Backend endpoints.

    These are placeholders for the backend we will create.

    No dummy patient/report/appointment data is generated
    in this JavaScript.
*/


const DOCTOR_PROFILE_API =
    "/api/doctor/profile/";


const DOCTOR_DASHBOARD_API =
    "/api/doctor/dashboard/";


const DOCTOR_LOGOUT_API =
    "/api/doctor/logout/";



/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const sidebar =
    document.getElementById(
        "sidebar"
    );


const mobileMenuButton =
    document.getElementById(
        "mobileMenuButton"
    );


const sidebarOverlay =
    document.getElementById(
        "sidebarOverlay"
    );


const logoutButton =
    document.getElementById(
        "logoutButton"
    );


const doctorName =
    document.getElementById(
        "doctorName"
    );


const welcomeDoctorName =
    document.getElementById(
        "welcomeDoctorName"
    );


const doctorSpecialization =
    document.getElementById(
        "doctorSpecialization"
    );


const doctorProfileImage =
    document.getElementById(
        "doctorProfileImage"
    );


const doctorProfileIcon =
    document.getElementById(
        "doctorProfileIcon"
    );


const totalPatients =
    document.getElementById(
        "totalPatients"
    );


const todayAppointments =
    document.getElementById(
        "todayAppointments"
    );


const pendingReports =
    document.getElementById(
        "pendingReports"
    );


const unreadMessages =
    document.getElementById(
        "unreadMessages"
    );


const messageBadge =
    document.getElementById(
        "messageBadge"
    );


const notificationDot =
    document.getElementById(
        "notificationDot"
    );


const appointmentList =
    document.getElementById(
        "appointmentList"
    );


const appointmentsEmpty =
    document.getElementById(
        "appointmentsEmpty"
    );


const patientList =
    document.getElementById(
        "patientList"
    );


const patientsEmpty =
    document.getElementById(
        "patientsEmpty"
    );


const reportsTableBody =
    document.getElementById(
        "reportsTableBody"
    );


const reportsTableWrapper =
    document.getElementById(
        "reportsTableWrapper"
    );


const reportsEmpty =
    document.getElementById(
        "reportsEmpty"
    );


const dashboardSearch =
    document.getElementById(
        "dashboardSearch"
    );



/* =========================================================
   INITIALIZE DASHBOARD
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadDoctorProfile();

        loadDashboardData();

    }
);



/* =========================================================
   LOAD DOCTOR PROFILE
   ========================================================= */

async function loadDoctorProfile() {

    try {

        const response =
            await fetch(
                DOCTOR_PROFILE_API,
                {
                    method: "GET",

                    credentials: "include"
                }
            );


        if (!response.ok) {

            /*
                Do not create dummy doctor data.

                If the backend is not connected yet,
                the default "Doctor" text remains.
            */

            return;

        }


        const data =
            await response.json();


        if (
            data.name
        ) {

            doctorName.textContent =
                data.name;

            welcomeDoctorName.textContent =
                data.name;

        }


        if (
            data.specialization
        ) {

            doctorSpecialization.textContent =
                data.specialization;

        }


        if (
            data.profile_photo
        ) {

            doctorProfileImage.src =
                data.profile_photo;

            doctorProfileImage.hidden =
                false;

            doctorProfileIcon.hidden =
                true;

        }

    }

    catch (error) {

        console.error(
            "Unable to load doctor profile:",
            error
        );

    }

}



/* =========================================================
   LOAD DASHBOARD DATA
   ========================================================= */

async function loadDashboardData() {

    try {

        const response =
            await fetch(
                DOCTOR_DASHBOARD_API,
                {
                    method: "GET",

                    credentials: "include"
                }
            );


        if (!response.ok) {

            /*
                Backend isn't connected yet.

                Keep all sections empty instead of
                displaying fake data.
            */

            clearDashboardData();

            return;

        }


        const data =
            await response.json();


        updateStatistics(
            data
        );


        renderAppointments(
            data.appointments || []
        );


        renderPatients(
            data.recent_patients || []
        );


        renderReports(
            data.recent_reports || []
        );


        updateNotifications(
            data
        );

    }

    catch (error) {

        console.error(
            "Unable to load dashboard data:",
            error
        );


        clearDashboardData();

    }

}



/* =========================================================
   UPDATE STATISTICS
   ========================================================= */

function updateStatistics(
    data
) {

    totalPatients.textContent =
        formatNumber(
            data.total_patients
        );


    todayAppointments.textContent =
        formatNumber(
            data.today_appointments
        );


    pendingReports.textContent =
        formatNumber(
            data.pending_reports
        );


    unreadMessages.textContent =
        formatNumber(
            data.unread_messages
        );


    const unread =
        Number(
            data.unread_messages || 0
        );


    if (
        unread > 0
    ) {

        messageBadge.textContent =
            unread;

        messageBadge.hidden =
            false;

    }

    else {

        messageBadge.hidden =
            true;

    }

}



/* =========================================================
   NUMBER FORMATTER
   ========================================================= */

function formatNumber(
    value
) {

    if (
        value === undefined ||
        value === null
    ) {

        return "--";

    }


    return Number(
        value
    ).toLocaleString();

}



/* =========================================================
   APPOINTMENTS
   ========================================================= */

function renderAppointments(
    appointments
) {

    if (
        !Array.isArray(appointments) ||
        appointments.length === 0
    ) {

        appointmentsEmpty.hidden =
            false;

        appointmentList.hidden =
            true;

        appointmentList.innerHTML =
            "";

        return;

    }


    appointmentsEmpty.hidden =
        true;

    appointmentList.hidden =
        false;


    appointmentList.innerHTML =
        "";


    appointments
        .slice(0, 5)
        .forEach(
            appointment => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "appointment-item";


                const time =
                    escapeHTML(
                        appointment.time ||
                        "--"
                    );


                const patient =
                    escapeHTML(
                        appointment.patient_name ||
                        "Patient"
                    );


                const type =
                    escapeHTML(
                        appointment.type ||
                        "Appointment"
                    );


                item.innerHTML = `

                    <div class="appointment-time">
                        ${time}
                    </div>

                    <div class="appointment-details">

                        <strong>
                            ${patient}
                        </strong>

                        <span>
                            ${type}
                        </span>

                    </div>

                `;


                appointmentList.appendChild(
                    item
                );

            }
        );

}



/* =========================================================
   PATIENTS
   ========================================================= */

function renderPatients(
    patients
) {

    if (
        !Array.isArray(patients) ||
        patients.length === 0
    ) {

        patientsEmpty.hidden =
            false;

        patientList.hidden =
            true;

        patientList.innerHTML =
            "";

        return;

    }


    patientsEmpty.hidden =
        true;

    patientList.hidden =
        false;


    patientList.innerHTML =
        "";


    patients
        .slice(0, 5)
        .forEach(
            patient => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "patient-item";


                const name =
                    escapeHTML(
                        patient.name ||
                        "Patient"
                    );


                const condition =
                    escapeHTML(
                        patient.disease ||
                        patient.condition ||
                        "Medical record"
                    );


                item.innerHTML = `

                    <div class="patient-avatar">

                        <i class="bi bi-person"></i>

                    </div>


                    <div class="patient-details">

                        <strong>
                            ${name}
                        </strong>

                        <span>
                            ${condition}
                        </span>

                    </div>

                `;


                patientList.appendChild(
                    item
                );

            }
        );

}



/* =========================================================
   REPORTS
   ========================================================= */

function renderReports(
    reports
) {

    if (
        !Array.isArray(reports) ||
        reports.length === 0
    ) {

        reportsEmpty.hidden =
            false;

        reportsTableWrapper.hidden =
            true;

        reportsTableBody.innerHTML =
            "";

        return;

    }


    reportsEmpty.hidden =
        true;

    reportsTableWrapper.hidden =
        false;


    reportsTableBody.innerHTML =
        "";


    reports
        .slice(0, 10)
        .forEach(
            report => {

                const row =
                    document.createElement(
                        "tr"
                    );


                const patient =
                    escapeHTML(
                        report.patient_name ||
                        "Patient"
                    );


                const reportName =
                    escapeHTML(
                        report.report_name ||
                        "Medical Report"
                    );


                const type =
                    escapeHTML(
                        report.report_type ||
                        "--"
                    );


                const trial =
                    escapeHTML(
                        report.trial ||
                        "--"
                    );


                const updated =
                    escapeHTML(
                        report.updated_at ||
                        "--"
                    );


                const reportUrl =
                    report.report_url ||
                    "#";


                row.innerHTML = `

                    <td>
                        ${patient}
                    </td>

                    <td>
                        ${reportName}
                    </td>

                    <td>
                        ${type}
                    </td>

                    <td>
                        ${trial}
                    </td>

                    <td>
                        ${updated}
                    </td>

                    <td>

                        <a
                            href="${escapeAttribute(reportUrl)}"
                            class="report-action"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            View
                        </a>

                    </td>

                `;


                reportsTableBody.appendChild(
                    row
                );

            }
        );

}



/* =========================================================
   NOTIFICATIONS
   ========================================================= */

function updateNotifications(
    data
) {

    const hasNotifications =
        Number(
            data.unread_messages || 0
        ) > 0 ||
        Number(
            data.pending_reports || 0
        ) > 0;


    notificationDot.hidden =
        !hasNotifications;

}



/* =========================================================
   CLEAR DASHBOARD
   ========================================================= */

function clearDashboardData() {

    totalPatients.textContent =
        "--";


    todayAppointments.textContent =
        "--";


    pendingReports.textContent =
        "--";


    unreadMessages.textContent =
        "--";


    messageBadge.hidden =
        true;


    notificationDot.hidden =
        true;


    appointmentsEmpty.hidden =
        false;

    appointmentList.hidden =
        true;

    appointmentList.innerHTML =
        "";


    patientsEmpty.hidden =
        false;

    patientList.hidden =
        true;

    patientList.innerHTML =
        "";


    reportsEmpty.hidden =
        false;

    reportsTableWrapper.hidden =
        true;

    reportsTableBody.innerHTML =
        "";

}



/* =========================================================
   MOBILE SIDEBAR
   ========================================================= */

mobileMenuButton.addEventListener(
    "click",
    function () {

        sidebar.classList.add(
            "show"
        );

        sidebarOverlay.classList.add(
            "show"
        );

    }
);


sidebarOverlay.addEventListener(
    "click",
    function () {

        closeSidebar();

    }
);



function closeSidebar() {

    sidebar.classList.remove(
        "show"
    );

    sidebarOverlay.classList.remove(
        "show"
    );

}



/* =========================================================
   CLOSE MOBILE SIDEBAR WHEN LINK CLICKED
   ========================================================= */

document
    .querySelectorAll(
        ".nav-item"
    )
    .forEach(
        item => {

            item.addEventListener(
                "click",
                function () {

                    closeSidebar();

                }
            );

        }
    );



/* =========================================================
   DASHBOARD SEARCH
   ========================================================= */

dashboardSearch.addEventListener(
    "input",
    function () {

        const searchTerm =
            this.value
                .trim()
                .toLowerCase();


        /*
            Search functionality will become more powerful
            once patient/report data comes from the backend.

            For now, it searches currently rendered
            dashboard content.
        */


        document
            .querySelectorAll(
                ".patient-item, .appointment-item"
            )
            .forEach(
                item => {

                    const text =
                        item.textContent
                            .toLowerCase();


                    if (
                        text.includes(
                            searchTerm
                        )
                    ) {

                        item.style.display =
                            "";

                    }

                    else {

                        item.style.display =
                            "none";

                    }

                }
            );

    }
);



/* =========================================================
   LOGOUT
   ========================================================= */

logoutButton.addEventListener(
    "click",
    async function () {

        const confirmed =
            window.confirm(
                "Are you sure you want to logout?"
            );


        if (!confirmed) {

            return;

        }


        try {

            const response =
                await fetch(
                    DOCTOR_LOGOUT_API,
                    {
                        method: "POST",

                        credentials: "include"
                    }
                );


            /*
                Whether backend succeeds or not,
                don't leave the doctor on the dashboard.
            */

            if (
                response.ok
            ) {

                window.location.href =
                    "doctor_login.html";

            }

            else {

                window.location.href =
                    "doctor_login.html";

            }

        }

        catch (error) {

            console.error(
                "Logout error:",
                error
            );


            window.location.href =
                "doctor_login.html";

        }

    }
);



/* =========================================================
   SECURITY HELPERS
   ========================================================= */

function escapeHTML(
    value
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value;


    return div.innerHTML;

}



function escapeAttribute(
    value
) {

    return String(
        value
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        );

}