/* =========================================================
   MEDVISIONAI
   DOCTOR HEALTH TIMELINE
   ========================================================= */


/*
    Expected backend endpoints:

    GET
    /api/doctor/patients

    GET
    /api/doctor/patients/{patient_id}

    GET
    /api/doctor/patients/{patient_id}/health-timeline

*/


const API = {

    patients:
        "/api/doctor/patients/",

    patientDetails:
        "/api/doctor/patients/",

    timeline:
        "/api/doctor/patients/"

};


/* =========================================================
   VARIABLES
   ========================================================= */

let patients = [];

let timelineEvents = [];

let selectedPatientId = null;

let currentFilter = "all";


/* =========================================================
   DOM
   ========================================================= */

const patientSelect =
    document.getElementById(
        "patientSelect"
    );

const selectedPatient =
    document.getElementById(
        "selectedPatient"
    );

const patientName =
    document.getElementById(
        "patientName"
    );

const patientId =
    document.getElementById(
        "patientId"
    );

const patientAge =
    document.getElementById(
        "patientAge"
    );

const patientGender =
    document.getElementById(
        "patientGender"
    );

const timelineControls =
    document.getElementById(
        "timelineControls"
    );

const timelineSection =
    document.getElementById(
        "timelineSection"
    );

const timeline =
    document.getElementById(
        "timeline"
    );

const timelineLoading =
    document.getElementById(
        "timelineLoading"
    );

const timelineEmpty =
    document.getElementById(
        "timelineEmpty"
    );

const initialState =
    document.getElementById(
        "initialState"
    );

const refreshButton =
    document.getElementById(
        "refreshButton"
    );

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadDoctorInfo();

        loadPatients();

        setupFilters();

    }
);


/* =========================================================
   DOCTOR INFO
   ========================================================= */

function loadDoctorInfo() {

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


        const doctorName =
            document.getElementById(
                "doctorName"
            );


        if (doctor.name) {

            doctorName.textContent =
                doctor.name;

        }

    }

    catch (error) {

        console.error(
            "Doctor data error:",
            error
        );

    }

}


/* =========================================================
   LOAD PATIENTS
   ========================================================= */

async function loadPatients() {

    patientSelect.innerHTML = `

        <option value="">
            Loading patients...
        </option>

    `;


    try {

        const response =
            await fetch(
                API.patients,
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
                "Unable to load patients"
            );

        }


        const data =
            await response.json();


        patients =
            Array.isArray(data)
                ? data
                : data.patients || [];


        populatePatientSelect();


    }

    catch (error) {

        console.error(
            "Patient loading error:",
            error
        );


        patientSelect.innerHTML = `

            <option value="">
                Unable to load patients
            </option>

        `;

    }

}


/* =========================================================
   POPULATE PATIENT SELECT
   ========================================================= */

function populatePatientSelect() {

    patientSelect.innerHTML = `

        <option value="">
            Select a patient
        </option>

    `;


    patients.forEach(
        function (patient) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                patient.id;


            option.textContent =
                patient.name ||
                "Patient";


            patientSelect.appendChild(
                option
            );

        }
    );

}


/* =========================================================
   PATIENT SELECTION
   ========================================================= */

patientSelect.addEventListener(
    "change",
    async function () {

        const id =
            this.value;


        if (!id) {

            resetTimeline();

            return;

        }


        selectedPatientId =
            id;


        const patient =
            patients.find(
                function (item) {

                    return String(item.id) ===
                        String(id);

                }
            );


        if (patient) {

            displayPatient(
                patient
            );

        }


        initialState.hidden =
            true;


        selectedPatient.hidden =
            false;


        timelineControls.hidden =
            false;


        timelineSection.hidden =
            false;


        await loadPatientDetails(
            id
        );


        await loadTimeline(
            id
        );

    }
);


/* =========================================================
   DISPLAY PATIENT
   ========================================================= */

function displayPatient(
    patient
) {

    patientName.textContent =
        patient.name ||
        "Patient";


    patientId.textContent =
        patient.patient_id ||
        patient.id ||
        "-";


    patientAge.textContent =
        patient.age ??
        "-";


    patientGender.textContent =
        patient.gender ||
        "-";

}


/* =========================================================
   LOAD PATIENT DETAILS
   ========================================================= */

async function loadPatientDetails(
    id
) {

    try {

        const response =
            await fetch(
                `${API.patientDetails}/${id}`,
                {

                    method: "GET",

                    headers: {
                        "Content-Type":
                            "application/json"
                    }

                }
            );


        if (!response.ok) {

            return;

        }


        const data =
            await response.json();


        const patient =
            data.patient ||
            data;


        displayPatient(
            patient
        );

    }

    catch (error) {

        console.error(
            "Patient details error:",
            error
        );

    }

}


/* =========================================================
   LOAD TIMELINE
   ========================================================= */

async function loadTimeline(
    patientIdValue
) {

    showTimelineLoading();


    try {

        const response =
            await fetch(
                `${API.timeline}/${patientIdValue}/health-timeline`,
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
                "Unable to load timeline"
            );

        }


        const data =
            await response.json();


        timelineEvents =
            Array.isArray(data)
                ? data
                : data.timeline || [];


        renderTimeline();


    }

    catch (error) {

        console.error(
            "Timeline loading error:",
            error
        );


        hideTimelineLoading();


        timeline.innerHTML = `

            <div class="timeline-empty">

                <div class="empty-icon">

                    <i class="bi bi-exclamation-circle"></i>

                </div>

                <h3>
                    Unable to load medical history
                </h3>

                <p>
                    Please try again later.
                </p>

            </div>

        `;

    }

}


/* =========================================================
   RENDER TIMELINE
   ========================================================= */

function renderTimeline() {

    hideTimelineLoading();


    timeline.innerHTML =
        "";


    const filteredEvents =
        timelineEvents.filter(
            function (event) {

                if (
                    currentFilter ===
                    "all"
                ) {

                    return true;

                }


                return (
                    event.type ===
                    currentFilter
                );

            }
        );


    if (
        filteredEvents.length === 0
    ) {

        timelineEmpty.hidden =
            false;

        return;

    }


    timelineEmpty.hidden =
        true;


    /*
        Newest event first.
    */

    const sortedEvents =
        [...filteredEvents].sort(
            function (a, b) {

                return new Date(
                    b.created_at ||
                    b.date
                ) -
                new Date(
                    a.created_at ||
                    a.date
                );

            }
        );


    sortedEvents.forEach(
        function (event) {

            timeline.appendChild(
                createTimelineEvent(
                    event
                )
            );

        }
    );

}


/* =========================================================
   CREATE TIMELINE EVENT
   ========================================================= */

function createTimelineEvent(
    event
) {

    const wrapper =
        document.createElement(
            "div"
        );


    const type =
        normalizeEventType(
            event.type
        );


    wrapper.className =
        `timeline-event ${type}`;


    const icon =
        getEventIcon(
            type
        );


    const title =
        event.title ||
        getDefaultTitle(
            type
        );


    const description =
        event.description ||
        "Medical event recorded in the patient's health history.";


    const date =
        formatDateTime(
            event.created_at ||
            event.date
        );


    wrapper.innerHTML = `

        <div class="timeline-icon">

            <i class="bi ${icon}"></i>

        </div>


        <div class="timeline-content">


            <div class="timeline-event-header">

                <div class="event-title">

                    ${escapeHtml(title)}

                </div>


                <div class="event-date">

                    <i class="bi bi-calendar3"></i>

                    ${escapeHtml(date)}

                </div>

            </div>


            <div class="event-description">

                ${escapeHtml(description)}

            </div>


            <div class="event-meta">

                ${createEventMetadata(
                    event
                )}

            </div>


        </div>

    `;


    return wrapper;

}


/* =========================================================
   EVENT METADATA
   ========================================================= */

function createEventMetadata(
    event
) {

    let html = "";


    if (
        event.doctor_name
    ) {

        html += `

            <span class="event-tag">

                <i class="bi bi-person-badge"></i>

                Dr. ${escapeHtml(
                    event.doctor_name
                )}

            </span>

        `;

    }


    if (
        event.report_name
    ) {

        html += `

            <span class="event-tag">

                <i class="bi bi-file-earmark-medical"></i>

                ${escapeHtml(
                    event.report_name
                )}

            </span>

        `;

    }


    if (
        event.medicine_name
    ) {

        html += `

            <span class="event-tag">

                <i class="bi bi-capsule"></i>

                ${escapeHtml(
                    event.medicine_name
                )}

            </span>

        `;

    }


    if (
        event.dosage
    ) {

        html += `

            <span class="event-tag">

                <i class="bi bi-prescription2"></i>

                ${escapeHtml(
                    event.dosage
                )}

            </span>

        `;

    }


    if (
        event.status
    ) {

        html += `

            <span class="event-tag">

                <i class="bi bi-check-circle"></i>

                ${escapeHtml(
                    event.status
                )}

            </span>

        `;

    }


    if (
        event.trial_number
    ) {

        html += `

            <span class="event-tag">

                <i class="bi bi-layers"></i>

                Trial ${escapeHtml(
                    event.trial_number
                )}

            </span>

        `;

    }


    return html;

}


/* =========================================================
   EVENT ICON
   ========================================================= */

function getEventIcon(
    type
) {

    const icons = {

        consultation:
            "bi-person-check-fill",

        report:
            "bi-file-earmark-medical-fill",

        medicine:
            "bi-capsule",

        appointment:
            "bi-calendar-check-fill",

        diagnosis:
            "bi-clipboard2-pulse-fill"

    };


    return icons[type] ||
        "bi-clock-history";

}


/* =========================================================
   DEFAULT TITLE
   ========================================================= */

function getDefaultTitle(
    type
) {

    const titles = {

        consultation:
            "Doctor Consultation",

        report:
            "Medical Report",

        medicine:
            "Medicine Prescribed",

        appointment:
            "Appointment",

        diagnosis:
            "Diagnosis"

    };


    return titles[type] ||
        "Medical Event";

}


/* =========================================================
   NORMALIZE EVENT TYPE
   ========================================================= */

function normalizeEventType(
    type
) {

    const value =
        String(
            type || ""
        ).toLowerCase();


    if (
        [
            "consultation",
            "report",
            "medicine",
            "appointment",
            "diagnosis"
        ].includes(value)
    ) {

        return value;

    }


    return "consultation";

}


/* =========================================================
   FILTERS
   ========================================================= */

function setupFilters() {

    const buttons =
        document.querySelectorAll(
            ".filter-button"
        );


    buttons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    buttons.forEach(
                        function (item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    this.classList.add(
                        "active"
                    );


                    currentFilter =
                        this.dataset.filter;


                    renderTimeline();

                }
            );

        }
    );

}


/* =========================================================
   LOADING
   ========================================================= */

function showTimelineLoading() {

    timelineLoading.hidden =
        false;

    timelineEmpty.hidden =
        true;

    timeline.innerHTML =
        "";

}


/* =========================================================
   HIDE LOADING
   ========================================================= */

function hideTimelineLoading() {

    timelineLoading.hidden =
        true;

}


/* =========================================================
   RESET
   ========================================================= */

function resetTimeline() {

    selectedPatientId =
        null;

    timelineEvents =
        [];

    selectedPatient.hidden =
        true;

    timelineControls.hidden =
        true;

    timelineSection.hidden =
        true;

    initialState.hidden =
        false;

    timeline.innerHTML =
        "";

}


/* =========================================================
   REFRESH
   ========================================================= */

refreshButton.addEventListener(
    "click",
    async function () {

        await loadPatients();


        if (
            selectedPatientId
        ) {

            await loadPatientDetails(
                selectedPatientId
            );

            await loadTimeline(
                selectedPatientId
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


        window.location.href =
            "doctor_login.html";

    }
);


/* =========================================================
   DATE FORMAT
   ========================================================= */

function formatDateTime(
    date
) {

    if (!date) {

        return "";

    }


    const parsed =
        new Date(date);


    if (
        Number.isNaN(
            parsed.getTime()
        )
    ) {

        return "";

    }


    return parsed.toLocaleString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHtml(
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