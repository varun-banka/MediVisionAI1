/* =========================================================
   MEDVISIONAI
   DOCTOR APPOINTMENTS
   ========================================================= */


/*
    Backend APIs expected:

    GET
    /api/doctor/profile

    GET
    /api/doctor/appointments

    POST
    /api/doctor/logout


    IMPORTANT:

    This frontend does NOT contain dummy appointments.

    All appointment data must come from your backend/database.
*/


const PROFILE_API =
    "/api/doctor/profile/";


const APPOINTMENTS_API =
    "/api/doctor/appointments/";


const LOGOUT_API =
    "/api/doctor/logout/";



/* =========================================================
   DOM
   ========================================================= */

const doctorName =
    document.getElementById(
        "doctorName"
    );


const tableContainer =
    document.getElementById(
        "tableContainer"
    );


const tableBody =
    document.getElementById(
        "appointmentsTableBody"
    );


const loadingState =
    document.getElementById(
        "loadingState"
    );


const emptyState =
    document.getElementById(
        "emptyState"
    );


const searchPatient =
    document.getElementById(
        "searchPatient"
    );


const appointmentDate =
    document.getElementById(
        "appointmentDate"
    );


const statusFilter =
    document.getElementById(
        "statusFilter"
    );


const todayCount =
    document.getElementById(
        "todayCount"
    );


const upcomingCount =
    document.getElementById(
        "upcomingCount"
    );


const pendingCount =
    document.getElementById(
        "pendingCount"
    );


const completedCount =
    document.getElementById(
        "completedCount"
    );



let appointments = [];



/* =========================================================
   INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        await loadDoctorProfile();

        await loadAppointments();

    }
);



/* =========================================================
   LOAD DOCTOR PROFILE
   ========================================================= */

async function loadDoctorProfile() {

    try {

        const response =
            await fetch(
                PROFILE_API,
                {
                    method: "GET",

                    credentials: "include"
                }
            );


        if (!response.ok) {

            return;

        }


        const data =
            await response.json();


        if (data.name) {

            doctorName.textContent =
                data.name;

        }

    }

    catch (error) {

        console.error(
            "Doctor profile error:",
            error
        );

    }

}



/* =========================================================
   LOAD APPOINTMENTS
   ========================================================= */

async function loadAppointments() {

    showLoading();


    try {

        const response =
            await fetch(
                APPOINTMENTS_API,
                {
                    method: "GET",

                    credentials: "include"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load appointments"
            );

        }


        const data =
            await response.json();


        /*
            Expected backend response:

            {
                "appointments": [
                    {
                        "id": "...",
                        "patient": {
                            "id": "...",
                            "name": "...",
                            "phone": "...",
                            "photo_url": "..."
                        },
                        "date": "2026-08-12",
                        "time": "10:30",
                        "type": "Follow-up",
                        "trial": "Trial 2",
                        "created_by": "Hospital Management",
                        "status": "confirmed",
                        "reminder_enabled": true,
                        "notes": "..."
                    }
                ]
            }
        */


        appointments =
            Array.isArray(
                data.appointments
            )
                ? data.appointments
                : [];


        updateSummary();


        renderAppointments(
            appointments
        );

    }

    catch (error) {

        console.error(
            "Appointments error:",
            error
        );


        appointments = [];

        updateSummary();

        showEmpty();

    }

}



/* =========================================================
   FILTER EVENTS
   ========================================================= */

searchPatient.addEventListener(
    "input",
    applyFilters
);


appointmentDate.addEventListener(
    "change",
    applyFilters
);


statusFilter.addEventListener(
    "change",
    applyFilters
);



/* =========================================================
   APPLY FILTERS
   ========================================================= */

function applyFilters() {

    const search =
        searchPatient.value
            .trim()
            .toLowerCase();


    const selectedDate =
        appointmentDate.value;


    const selectedStatus =
        statusFilter.value;


    const filtered =
        appointments.filter(
            appointment => {


                const patientName =
                    appointment.patient &&
                    appointment.patient.name
                        ? appointment.patient.name
                        : "";


                const matchesSearch =
                    !search ||
                    patientName
                        .toLowerCase()
                        .includes(search);


                const matchesDate =
                    !selectedDate ||
                    appointment.date ===
                        selectedDate;


                const matchesStatus =
                    !selectedStatus ||
                    appointment.status ===
                        selectedStatus;


                return (
                    matchesSearch &&
                    matchesDate &&
                    matchesStatus
                );

            }
        );


    renderAppointments(
        filtered
    );

}



/* =========================================================
   RENDER APPOINTMENTS
   ========================================================= */

function renderAppointments(
    appointmentList
) {

    loadingState.hidden =
        true;


    if (
        !appointmentList ||
        appointmentList.length === 0
    ) {

        showEmpty();

        return;

    }


    emptyState.hidden =
        true;


    tableContainer.hidden =
        false;


    tableBody.innerHTML =
        "";


    appointmentList.forEach(
        appointment => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${createPatientCell(appointment)}
                </td>

                <td>

                    <div class="appointment-date">
                        ${formatDate(appointment.date)}
                    </div>

                    <div class="appointment-time">
                        ${formatTime(appointment.time)}
                    </div>

                </td>

                <td>
                    ${escapeHTML(
                        appointment.type ||
                        "—"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        appointment.trial ||
                        "—"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        appointment.created_by ||
                        "—"
                    )}
                </td>

                <td>
                    ${createStatusBadge(
                        appointment.status
                    )}
                </td>

                <td>
                    ${createReminderBadge(
                        appointment
                    )}
                </td>

                <td>

                    <button
                        class="view-button"
                        title="View appointment"
                        data-id="${escapeHTML(
                            String(
                                appointment.id
                            )
                        )}"
                    >

                        <i class="bi bi-eye"></i>

                    </button>

                </td>

            `;


            tableBody.appendChild(
                row
            );

        }
    );


    document
        .querySelectorAll(
            ".view-button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function () {

                        const id =
                            this.dataset.id;


                        openAppointment(
                            id
                        );

                    }
                );

            }
        );

}



/* =========================================================
   PATIENT CELL
   ========================================================= */

function createPatientCell(
    appointment
) {

    const patient =
        appointment.patient ||
        {};


    const name =
        patient.name ||
        "Unknown Patient";


    const patientId =
        patient.id ||
        "";


    const photo =
        patient.photo_url ||
        "";


    const avatar =
        photo
            ? `
                <div class="patient-avatar">

                    <img
                        src="${escapeHTML(photo)}"
                        alt="Patient"
                    >

                </div>
            `
            : `
                <div class="patient-avatar">

                    <i class="bi bi-person"></i>

                </div>
            `;


    return `

        <div class="patient-cell">

            ${avatar}

            <div>

                <strong>
                    ${escapeHTML(name)}
                </strong>

                <span>
                    ${escapeHTML(
                        patientId
                    )}
                </span>

            </div>

        </div>

    `;

}



/* =========================================================
   STATUS BADGE
   ========================================================= */

function createStatusBadge(
    status
) {

    const safeStatus =
        String(
            status || "scheduled"
        )
        .toLowerCase();


    const label =
        safeStatus
            .charAt(0)
            .toUpperCase() +
        safeStatus.slice(1);


    return `

        <span
            class="status-badge ${escapeHTML(
                safeStatus
            )}"
        >

            ${escapeHTML(label)}

        </span>

    `;

}



/* =========================================================
   REMINDER BADGE
   ========================================================= */

function createReminderBadge(
    appointment
) {

    if (
        appointment.reminder_enabled ===
        true
    ) {

        return `

            <span class="reminder-badge active">

                <i class="bi bi-bell-fill"></i>

                Enabled

            </span>

        `;

    }


    return `

        <span class="reminder-badge">

            <i class="bi bi-bell-slash"></i>

            Not enabled

        </span>

    `;

}



/* =========================================================
   OPEN APPOINTMENT
   ========================================================= */

function openAppointment(
    appointmentId
) {

    const appointment =
        appointments.find(
            item =>
                String(item.id) ===
                String(appointmentId)
        );


    if (!appointment) {

        return;

    }


    const patient =
        appointment.patient ||
        {};


    document.getElementById(
        "modalPatient"
    ).textContent =
        patient.name ||
        "—";


    document.getElementById(
        "modalDate"
    ).textContent =
        formatDate(
            appointment.date
        );


    document.getElementById(
        "modalTime"
    ).textContent =
        formatTime(
            appointment.time
        );


    document.getElementById(
        "modalType"
    ).textContent =
        appointment.type ||
        "—";


    document.getElementById(
        "modalTrial"
    ).textContent =
        appointment.trial ||
        "—";


    document.getElementById(
        "modalCreatedBy"
    ).textContent =
        appointment.created_by ||
        "—";


    document.getElementById(
        "modalStatus"
    ).textContent =
        appointment.status ||
        "—";


    document.getElementById(
        "modalReminder"
    ).textContent =
        appointment.reminder_enabled
            ? "SMS reminders enabled"
            : "SMS reminders not enabled";


    document.getElementById(
        "modalNotes"
    ).textContent =
        appointment.notes ||
        "No notes available.";


    const modal =
        new bootstrap.Modal(
            document.getElementById(
                "appointmentModal"
            )
        );


    modal.show();

}



/* =========================================================
   UPDATE SUMMARY
   ========================================================= */

function updateSummary() {

    const today =
        getTodayString();


    const todayAppointments =
        appointments.filter(
            appointment =>
                appointment.date ===
                today
        );


    const upcoming =
        appointments.filter(
            appointment =>
                isFutureAppointment(
                    appointment
                ) &&
                appointment.status !==
                    "cancelled"
        );


    const pending =
        appointments.filter(
            appointment =>
                appointment.status ===
                    "scheduled" ||
                appointment.status ===
                    "pending"
        );


    const completed =
        appointments.filter(
            appointment =>
                appointment.status ===
                    "completed"
        );


    todayCount.textContent =
        todayAppointments.length;


    upcomingCount.textContent =
        upcoming.length;


    pendingCount.textContent =
        pending.length;


    completedCount.textContent =
        completed.length;

}



/* =========================================================
   REFRESH
   ========================================================= */

document
    .getElementById(
        "refreshAppointments"
    )
    .addEventListener(
        "click",
        function () {

            loadAppointments();

        }
    );



/* =========================================================
   RESET FILTERS
   ========================================================= */

document
    .getElementById(
        "clearFilters"
    )
    .addEventListener(
        "click",
        function () {

            searchPatient.value =
                "";

            appointmentDate.value =
                "";

            statusFilter.value =
                "";


            renderAppointments(
                appointments
            );

        }
    );



/* =========================================================
   LOADING
   ========================================================= */

function showLoading() {

    loadingState.hidden =
        false;

    emptyState.hidden =
        true;

    tableContainer.hidden =
        true;

}



/* =========================================================
   EMPTY
   ========================================================= */

function showEmpty() {

    loadingState.hidden =
        true;

    emptyState.hidden =
        false;

    tableContainer.hidden =
        true;

}



/* =========================================================
   DATE
   ========================================================= */

function formatDate(
    dateString
) {

    if (!dateString) {

        return "—";

    }


    const date =
        new Date(
            `${dateString}T00:00:00`
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return dateString;

    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}



/* =========================================================
   TIME
   ========================================================= */

function formatTime(
    timeString
) {

    if (!timeString) {

        return "—";

    }


    const parts =
        String(
            timeString
        ).split(":");


    if (parts.length < 2) {

        return timeString;

    }


    let hours =
        parseInt(
            parts[0],
            10
        );


    const minutes =
        parts[1];


    if (
        Number.isNaN(hours)
    ) {

        return timeString;

    }


    const period =
        hours >= 12
            ? "PM"
            : "AM";


    hours =
        hours % 12 ||
        12;


    return `${hours}:${minutes} ${period}`;

}



/* =========================================================
   TODAY
   ========================================================= */

function getTodayString() {

    const now =
        new Date();


    const year =
        now.getFullYear();


    const month =
        String(
            now.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            now.getDate()
        ).padStart(
            2,
            "0"
        );


    return `${year}-${month}-${day}`;

}



/* =========================================================
   FUTURE APPOINTMENT
   ========================================================= */

function isFutureAppointment(
    appointment
) {

    if (
        !appointment.date ||
        !appointment.time
    ) {

        return false;

    }


    const appointmentDate =
        new Date(
            `${appointment.date}T${appointment.time}`
        );


    return (
        appointmentDate >
        new Date()
    );

}



/* =========================================================
   HTML ESCAPE
   ========================================================= */

function escapeHTML(
    value
) {

    const element =
        document.createElement(
            "div"
        );


    element.textContent =
        value;


    return element.innerHTML;

}



/* =========================================================
   LOGOUT
   ========================================================= */

document
    .getElementById(
        "logoutButton"
    )
    .addEventListener(
        "click",
        async function () {

            const confirmed =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (!confirmed) {

                return;

            }


            try {

                await fetch(
                    LOGOUT_API,
                    {
                        method: "POST",

                        credentials: "include"
                    }
                );

            }

            catch (error) {

                console.error(
                    error
                );

            }


            window.location.href =
                "doctor_login.html";

        }
    );