/* =========================================================
   MEDVISIONAI PATIENT APPOINTMENTS
   ========================================================= */


/*
    IMPORTANT

    No dummy appointments are created here.

    The frontend expects the backend to provide:

    GET /api/patient/appointments

*/


const API_URL = "/api/patient/appointments/";


/* =========================================================
   LOAD APPOINTMENTS
   ========================================================= */

async function loadAppointments() {

    const upcomingContainer =
        document.getElementById("upcomingAppointment");

    const tableBody =
        document.getElementById("appointmentTableBody");


    try {

        const response = await fetch(API_URL, {

            method: "GET",

            headers: {
                "Content-Type": "application/json"
            },

            credentials: "include"

        });


        if (!response.ok) {

            throw new Error(
                "Unable to load appointments"
            );

        }


        const data = await response.json();


        /*
            Expected backend response:

            {
                "appointments": [
                    {
                        "doctor_name": "...",
                        "department": "...",
                        "appointment_date": "...",
                        "appointment_time": "...",
                        "appointment_type": "...",
                        "status": "confirmed"
                    }
                ]
            }
        */


        const appointments =
            data.appointments || [];


        renderUpcomingAppointment(
            appointments
        );


        renderAppointmentTable(
            appointments
        );


    } catch (error) {

        console.error(
            "Appointment Error:",
            error
        );


        upcomingContainer.innerHTML = `

            <div class="empty-state">

                <i class="bi bi-calendar-x"></i>

                <p>
                    Unable to load appointments.
                </p>

            </div>

        `;


        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="empty-state"
                >

                    <i class="bi bi-exclamation-circle"></i>

                    <p>
                        Unable to load appointments.
                    </p>

                </td>

            </tr>

        `;

    }

}


/* =========================================================
   UPCOMING APPOINTMENT
   ========================================================= */

function renderUpcomingAppointment(
    appointments
) {

    const container =
        document.getElementById(
            "upcomingAppointment"
        );


    if (
        !appointments ||
        appointments.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                <i class="bi bi-calendar-x"></i>

                <p>
                    No upcoming appointments.
                </p>

            </div>

        `;

        return;

    }


    /*
        Only future appointments.

        The backend should ideally return
        appointments sorted by date/time.
    */


    const upcoming =
        appointments
            .filter(
                appointment =>
                    appointment.status !== "cancelled"
            )
            [0];


    if (!upcoming) {

        container.innerHTML = `

            <div class="empty-state">

                <i class="bi bi-calendar-x"></i>

                <p>
                    No upcoming appointments.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML = `

        <div class="upcoming-card">


            <div class="doctor-info">

                <div class="doctor-icon">

                    <i class="bi bi-person-badge"></i>

                </div>


                <div>

                    <h4>

                        ${escapeHTML(
                            upcoming.doctor_name
                        )}

                    </h4>


                    <p>

                        ${escapeHTML(
                            upcoming.department || ""
                        )}

                    </p>

                </div>

            </div>



            <div class="appointment-date">

                <h4>

                    ${formatDate(
                        upcoming.appointment_date
                    )}

                </h4>


                <p>

                    ${formatTime(
                        upcoming.appointment_time
                    )}

                </p>

            </div>



            <div class="appointment-type">

                <span>

                    ${escapeHTML(
                        upcoming.appointment_type ||
                        "Appointment"
                    )}

                </span>

            </div>


        </div>

    `;

}


/* =========================================================
   APPOINTMENT TABLE
   ========================================================= */

function renderAppointmentTable(
    appointments
) {

    const tableBody =
        document.getElementById(
            "appointmentTableBody"
        );


    if (
        !appointments ||
        appointments.length === 0
    ) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="empty-state"
                >

                    <i class="bi bi-calendar-x"></i>

                    <p>
                        No appointments found.
                    </p>

                </td>

            </tr>

        `;

        return;

    }


    tableBody.innerHTML = "";


    appointments.forEach(
        appointment => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>

                    ${escapeHTML(
                        appointment.doctor_name
                    )}

                </td>


                <td>

                    ${escapeHTML(
                        appointment.department || "-"
                    )}

                </td>


                <td>

                    ${formatDate(
                        appointment.appointment_date
                    )}

                </td>


                <td>

                    ${formatTime(
                        appointment.appointment_time
                    )}

                </td>


                <td>

                    ${escapeHTML(
                        appointment.appointment_type ||
                        "-"
                    )}

                </td>


                <td>

                    <span class="status ${getStatusClass(
                        appointment.status
                    )}">

                        ${escapeHTML(
                            appointment.status ||
                            "Pending"
                        )}

                    </span>

                </td>

            `;


            tableBody.appendChild(row);

        }
    );

}


/* =========================================================
   STATUS CLASS
   ========================================================= */

function getStatusClass(status) {

    if (!status) {

        return "pending";

    }


    const normalized =
        status.toLowerCase();


    if (normalized === "confirmed") {

        return "confirmed";

    }


    if (normalized === "completed") {

        return "completed";

    }


    if (normalized === "cancelled") {

        return "cancelled";

    }


    return "pending";

}


/* =========================================================
   DATE FORMAT
   ========================================================= */

function formatDate(dateString) {

    if (!dateString) {

        return "-";

    }


    const date =
        new Date(dateString);


    if (isNaN(date.getTime())) {

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
   TIME FORMAT
   ========================================================= */

function formatTime(timeString) {

    if (!timeString) {

        return "-";

    }


    /*
        If backend sends:

        10:30:00

        convert to:

        10:30 AM
    */


    const parts =
        timeString.split(":");


    if (parts.length < 2) {

        return timeString;

    }


    let hour =
        parseInt(parts[0]);


    const minute =
        parts[1];


    const period =
        hour >= 12
            ? "PM"
            : "AM";


    hour =
        hour % 12 || 12;


    return `${hour}:${minute} ${period}`;

}


/* =========================================================
   HTML ESCAPE
   ========================================================= */

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


/* =========================================================
   LOAD WHEN PAGE OPENS
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadAppointments();

    }
);