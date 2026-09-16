/* =========================================================
   MEDVISIONAI
   DOCTOR - MY PATIENTS
   ========================================================= */


const PATIENTS_API =
    "/api/doctor/patients/";


const PROFILE_API =
    "/api/doctor/profile/";


const LOGOUT_API =
    "/api/doctor/logout/";


const patientGrid =
    document.getElementById(
        "patientGrid"
    );


const emptyPatients =
    document.getElementById(
        "emptyPatients"
    );


const patientSearch =
    document.getElementById(
        "patientSearch"
    );


const patientFilter =
    document.getElementById(
        "patientFilter"
    );


const totalPatients =
    document.getElementById(
        "totalPatients"
    );


const activePatients =
    document.getElementById(
        "activePatients"
    );


const upcomingAppointments =
    document.getElementById(
        "upcomingAppointments"
    );


const reportsToReview =
    document.getElementById(
        "reportsToReview"
    );


const doctorName =
    document.getElementById(
        "doctorName"
    );



/* =========================================================
   DATA
   ========================================================= */

let patients = [];



/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadDoctorProfile();

        loadPatients();

    }
);



/* =========================================================
   DOCTOR PROFILE
   ========================================================= */

async function loadDoctorProfile() {

    try {

        const response =
            await fetch(
                PROFILE_API,
                {
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
   LOAD PATIENTS
   ========================================================= */

async function loadPatients() {

    try {

        const response =
            await fetch(
                PATIENTS_API,
                {
                    method: "GET",

                    credentials: "include"
                }
            );


        if (!response.ok) {

            showEmptyState();

            return;

        }


        const data =
            await response.json();


        patients =
            Array.isArray(data.patients)
                ? data.patients
                : [];


        updateStatistics(
            data
        );


        renderPatients(
            patients
        );

    }

    catch (error) {

        console.error(
            "Patient loading error:",
            error
        );


        showEmptyState();

    }

}



/* =========================================================
   STATISTICS
   ========================================================= */

function updateStatistics(
    data
) {

    totalPatients.textContent =
        data.total_patients ?? "--";


    activePatients.textContent =
        data.active_patients ?? "--";


    upcomingAppointments.textContent =
        data.upcoming_appointments ?? "--";


    reportsToReview.textContent =
        data.reports_to_review ?? "--";

}



/* =========================================================
   RENDER PATIENTS
   ========================================================= */

function renderPatients(
    patientData
) {

    if (
        !patientData ||
        patientData.length === 0
    ) {

        showEmptyState();

        return;

    }


    emptyPatients.hidden =
        true;

    patientGrid.hidden =
        false;


    patientGrid.innerHTML =
        "";


    patientData.forEach(
        patient => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "patient-card";


            const patientName =
                escapeHTML(
                    patient.name ||
                    "Patient"
                );


            const patientId =
                escapeHTML(
                    patient.patient_id ||
                    "--"
                );


            const gender =
                escapeHTML(
                    patient.gender ||
                    "--"
                );


            const age =
                escapeHTML(
                    patient.age ||
                    "--"
                );


            const condition =
                escapeHTML(
                    patient.condition ||
                    "Not available"
                );


            const photo =
                patient.photo || "";


            let photoHTML =
                `
                    <i class="bi bi-person"></i>
                `;


            if (photo) {

                photoHTML = `

                    <img
                        src="${escapeAttribute(photo)}"
                        alt="Patient"
                    >

                `;

            }


            card.innerHTML = `

                <div class="patient-card-top">

                    <div class="patient-photo">

                        ${photoHTML}

                    </div>


                    <div>

                        <h4>
                            ${patientName}
                        </h4>

                        <small>
                            Patient ID:
                            ${patientId}
                        </small>

                    </div>

                </div>


                <div class="patient-details">

                    <div class="detail-box">

                        <span>
                            Age
                        </span>

                        <strong>
                            ${age}
                        </strong>

                    </div>


                    <div class="detail-box">

                        <span>
                            Gender
                        </span>

                        <strong>
                            ${gender}
                        </strong>

                    </div>


                    <div class="detail-box">

                        <span>
                            Condition
                        </span>

                        <strong>
                            ${condition}
                        </strong>

                    </div>


                    <div class="detail-box">

                        <span>
                            Status
                        </span>

                        <strong>
                            ${patient.status || "--"}
                        </strong>

                    </div>

                </div>


                <button
                    class="open-profile"
                    data-patient-id="${escapeAttribute(
                        patient.patient_id || ""
                    )}"
                >

                    <i class="bi bi-person-vcard"></i>

                    Open Patient Profile

                </button>

            `;


            patientGrid.appendChild(
                card
            );

        }
    );


    attachProfileButtons();

}



/* =========================================================
   PROFILE BUTTON
   ========================================================= */

function attachProfileButtons() {

    document
        .querySelectorAll(
            ".open-profile"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function () {

                        const patientId =
                            this.dataset.patientId;


                        if (!patientId) {

                            return;

                        }


                        window.location.href =
                            `doctor_patient_profile.html?patient_id=${encodeURIComponent(patientId)}`;

                    }
                );

            }
        );

}



/* =========================================================
   EMPTY STATE
   ========================================================= */

function showEmptyState() {

    emptyPatients.hidden =
        false;

    patientGrid.hidden =
        true;

    patientGrid.innerHTML =
        "";

}



/* =========================================================
   SEARCH
   ========================================================= */

patientSearch.addEventListener(
    "input",
    applyFilters
);


patientFilter.addEventListener(
    "change",
    applyFilters
);



function applyFilters() {

    const search =
        patientSearch.value
            .trim()
            .toLowerCase();


    const filter =
        patientFilter.value;


    const filtered =
        patients.filter(
            patient => {

                const name =
                    String(
                        patient.name || ""
                    ).toLowerCase();


                const id =
                    String(
                        patient.patient_id || ""
                    ).toLowerCase();


                const status =
                    String(
                        patient.status || ""
                    ).toLowerCase();


                const matchesSearch =
                    name.includes(search) ||
                    id.includes(search);


                const matchesFilter =
                    filter === "all" ||
                    status === filter;


                return (
                    matchesSearch &&
                    matchesFilter
                );

            }
        );


    renderPatients(
        filtered
    );

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



/* =========================================================
   SECURITY HELPERS
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