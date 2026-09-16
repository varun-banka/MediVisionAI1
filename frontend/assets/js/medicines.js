/* =========================================================
   MEDVISIONAI - PATIENT MEDICINES
   ========================================================= */


/*
    NO DUMMY MEDICINES.

    Data comes from:

    Doctor / Hospital
            ↓
        Database
            ↓
    API
            ↓
    This JavaScript
            ↓
    Patient UI
*/


const MEDICINE_API =
    "/api/patient/medicines/";


/* =========================================================
   LOAD MEDICINES
   ========================================================= */

async function loadMedicines() {

    const tableBody =
        document.getElementById(
            "medicineTableBody"
        );


    const todaySchedule =
        document.getElementById(
            "todaySchedule"
        );


    try {

        const response =
            await fetch(
                MEDICINE_API,
                {
                    method: "GET",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    credentials: "include"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load medicines"
            );

        }


        const data =
            await response.json();


        const medicines =
            data.medicines || [];


        renderMedicineTable(
            medicines
        );


        renderTodaySchedule(
            medicines
        );


    } catch (error) {

        console.error(
            "Medicine API Error:",
            error
        );


        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    class="loading-cell"
                >

                    <i class="bi bi-exclamation-circle"
                       style="font-size:35px;">
                    </i>

                    <p>
                        Unable to load medicines.
                    </p>

                </td>

            </tr>

        `;


        todaySchedule.innerHTML = `

            <div class="empty-schedule">

                <i class="bi bi-exclamation-circle"></i>

                <p>
                    Unable to load today's schedule.
                </p>

            </div>

        `;

    }

}


/* =========================================================
   MEDICINE TABLE
   ========================================================= */

function renderMedicineTable(
    medicines
) {

    const tableBody =
        document.getElementById(
            "medicineTableBody"
        );


    if (
        !medicines ||
        medicines.length === 0
    ) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    class="loading-cell"
                >

                    <i
                        class="bi bi-capsule"
                        style="font-size:40px;color:#94a3b8;"
                    ></i>

                    <p>
                        No medicines have been prescribed yet.
                    </p>

                </td>

            </tr>

        `;

        return;

    }


    tableBody.innerHTML = "";


    medicines.forEach(
        medicine => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>

                    <div class="medicine-name">

                        <div class="medicine-icon">

                            <i class="bi bi-capsule"></i>

                        </div>

                        <span>

                            ${escapeHTML(
                                medicine.medicine_name
                            )}

                        </span>

                    </div>

                </td>


                <td>

                    ${escapeHTML(
                        medicine.dosage || "-"
                    )}

                </td>


                <td>

                    ${escapeHTML(
                        medicine.frequency || "-"
                    )}

                </td>


                <td>

                    ${formatMedicineTimes(
                        medicine.times
                    )}

                </td>


                <td>

                    ${formatDate(
                        medicine.start_date
                    )}

                </td>


                <td>

                    ${formatDate(
                        medicine.end_date
                    )}

                </td>


                <td>

                    ${escapeHTML(
                        medicine.doctor_name || "-"
                    )}

                </td>


                <td>

                    <span class="medicine-status ${getStatusClass(
                        medicine.status
                    )}">

                        ${escapeHTML(
                            medicine.status || "Active"
                        )}

                    </span>

                </td>

            `;


            tableBody.appendChild(row);

        }
    );

}


/* =========================================================
   TODAY'S SCHEDULE
   ========================================================= */

function renderTodaySchedule(
    medicines
) {

    const container =
        document.getElementById(
            "todaySchedule"
        );


    const activeMedicines =
        medicines.filter(
            medicine =>
                medicine.status &&
                medicine.status.toLowerCase()
                === "active"
        );


    if (
        activeMedicines.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-schedule">

                <i class="bi bi-capsule"></i>

                <p>
                    No medicine scheduled for today.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML = "";


    activeMedicines.forEach(
        medicine => {

            const times =
                normalizeTimes(
                    medicine.times
                );


            times.forEach(
                time => {

                    const card =
                        document.createElement(
                            "div"
                        );


                    card.className =
                        "schedule-card";


                    card.innerHTML = `

                        <div class="schedule-time">

                            ${formatTime(time)}

                        </div>


                        <div class="schedule-medicine">

                            ${escapeHTML(
                                medicine.medicine_name
                            )}

                        </div>


                        <div class="schedule-dosage">

                            ${escapeHTML(
                                medicine.dosage || "-"
                            )}

                        </div>


                        <div class="schedule-reminder">

                            <i class="bi bi-phone"></i>

                            SMS reminder
                            15 min before

                        </div>

                    `;


                    container.appendChild(
                        card
                    );

                }
            );

        }
    );

}


/* =========================================================
   NORMALIZE TIMES
   ========================================================= */

function normalizeTimes(times) {

    if (!times) {

        return [];

    }


    if (Array.isArray(times)) {

        return times;

    }


    if (typeof times === "string") {

        return times
            .split(",")
            .map(
                time =>
                    time.trim()
            );

    }


    return [];

}


/* =========================================================
   FORMAT MULTIPLE MEDICINE TIMES
   ========================================================= */

function formatMedicineTimes(
    times
) {

    const normalized =
        normalizeTimes(times);


    if (normalized.length === 0) {

        return "-";

    }


    return normalized
        .map(
            time =>
                formatTime(time)
        )
        .join("<br>");

}


/* =========================================================
   FORMAT TIME
   ========================================================= */

function formatTime(
    time
) {

    if (!time) {

        return "-";

    }


    const parts =
        time.split(":");


    if (parts.length < 2) {

        return time;

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
   FORMAT DATE
   ========================================================= */

function formatDate(
    dateString
) {

    if (!dateString) {

        return "-";

    }


    const date =
        new Date(dateString);


    if (
        isNaN(
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
   STATUS
   ========================================================= */

function getStatusClass(
    status
) {

    if (!status) {

        return "active";

    }


    const value =
        status.toLowerCase();


    if (value === "completed") {

        return "completed";

    }


    if (value === "paused") {

        return "paused";

    }


    return "active";

}


/* =========================================================
   SECURITY
   ========================================================= */

function escapeHTML(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   PAGE LOAD
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadMedicines();

    }
);