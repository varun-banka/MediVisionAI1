/* =========================================================
   MEDVISIONAI
   DOCTOR MEDICINES
   ========================================================= */


/*
    IMPORTANT

    These API URLs are placeholders for your backend.

    No patient or medicine data is hardcoded.

    Your backend will eventually provide:

    GET  /api/doctor/patients
    GET  /api/doctor/medicines
    POST /api/doctor/medicines
    DELETE /api/doctor/medicines/{id}

*/


const API = {

    patients: "/api/doctor/patients/",

    medicines: "/api/doctor/medicines/"

};


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const medicineForm =
    document.getElementById("medicineForm");

const patientSelect =
    document.getElementById("patientSelect");

const trialSelect =
    document.getElementById("trialSelect");

const medicineTableBody =
    document.getElementById("medicineTableBody");

const loadingState =
    document.getElementById("loadingState");

const emptyState =
    document.getElementById("emptyState");

const tableContainer =
    document.getElementById("tableContainer");

const refreshMedicines =
    document.getElementById("refreshMedicines");

const logoutButton =
    document.getElementById("logoutButton");


/* =========================================================
   PAGE INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadDoctorInfo();

        loadPatients();

        loadMedicines();

        setMinimumDates();

    }
);


/* =========================================================
   DOCTOR INFORMATION
   ========================================================= */

function loadDoctorInfo() {

    /*
        Later this will come from the logged-in doctor
        session/JWT.

        Example backend response:

        {
            "id": 12,
            "name": "Doctor Name"
        }
    */


    const storedDoctor =
        localStorage.getItem("doctor");

    if (!storedDoctor) {

        return;

    }

    try {

        const doctor =
            JSON.parse(storedDoctor);

        const doctorName =
            document.getElementById("doctorName");

        if (doctor.name) {

            doctorName.textContent =
                doctor.name;

        }

    }

    catch (error) {

        console.error(
            "Unable to read doctor information",
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
            await fetch(API.patients, {

                method: "GET",

                headers: {
                    "Content-Type": "application/json"
                }

            });


        if (!response.ok) {

            throw new Error(
                "Unable to load patients"
            );

        }


        const patients =
            await response.json();


        patientSelect.innerHTML = `
            <option value="">
                Select patient
            </option>
        `;


        /*
            Expected backend response:

            [
                {
                    "id": 1,
                    "name": "Patient Name"
                }
            ]
        */


        patients.forEach(function (patient) {

            const option =
                document.createElement("option");

            option.value =
                patient.id;

            option.textContent =
                patient.name;

            patientSelect.appendChild(
                option
            );

        });

    }

    catch (error) {

        console.error(
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
   PATIENT CHANGE
   ========================================================= */

patientSelect.addEventListener(
    "change",
    function () {

        const patientId =
            this.value;


        trialSelect.innerHTML = `
            <option value="">
                Select trial
            </option>
        `;


        if (!patientId) {

            return;

        }


        /*
            Later:

            Fetch trials belonging to this patient.

            Example:

            GET
            /api/doctor/patients/{patientId}/trials
        */


        loadPatientTrials(patientId);

    }
);


/* =========================================================
   LOAD PATIENT TRIALS
   ========================================================= */

async function loadPatientTrials(
    patientId
) {

    try {

        const response = await fetch(
            `/api/doctor/patients/${patientId}/trials/`
        );


        if (!response.ok) {

            throw new Error(
                "Unable to load patient trials"
            );

        }


        const trials =
            await response.json();


        trialSelect.innerHTML = `
            <option value="">
                Select trial
            </option>
        `;


        trials.forEach(function (trial) {

            const option =
                document.createElement("option");

            option.value =
                trial.id;

            option.textContent =
                trial.name ||
                `Trial ${trial.id}`;

            trialSelect.appendChild(
                option
            );

        });

    }

    catch (error) {

        console.error(
            error
        );

    }

}


/* =========================================================
   SET MINIMUM DATE
   ========================================================= */

function setMinimumDates() {

    const today =
        new Date();

    const year =
        today.getFullYear();

    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            today.getDate()
        ).padStart(2, "0");


    const todayString =
        `${year}-${month}-${day}`;


    const startDate =
        document.getElementById(
            "startDate"
        );

    const endDate =
        document.getElementById(
            "endDate"
        );


    startDate.min =
        todayString;

    endDate.min =
        todayString;


    startDate.addEventListener(
        "change",
        function () {

            endDate.min =
                this.value;

        }
    );

}


/* =========================================================
   FORM SUBMISSION
   ========================================================= */

medicineForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const patientId =
            patientSelect.value;

        const trialId =
            trialSelect.value;

        const medicineName =
            document.getElementById(
                "medicineName"
            ).value.trim();

        const medicineType =
            document.getElementById(
                "medicineType"
            ).value;

        const dosage =
            document.getElementById(
                "dosage"
            ).value.trim();

        const frequency =
            document.getElementById(
                "frequency"
            ).value;

        const startDate =
            document.getElementById(
                "startDate"
            ).value;

        const endDate =
            document.getElementById(
                "endDate"
            ).value;

        const instructions =
            document.getElementById(
                "instructions"
            ).value.trim();

        const smsReminder =
            document.getElementById(
                "smsReminder"
            ).checked;


        /*
            Get selected timings
        */

        const timingElements =
            document.querySelectorAll(
                'input[name="medicineTiming"]:checked'
            );


        const timings =
            Array.from(
                timingElements
            ).map(
                function (element) {

                    return element.value;

                }
            );


        /* =================================================
           VALIDATION
           ================================================= */

        if (!patientId) {

            showMessage(
                "Please select a patient.",
                "warning"
            );

            return;

        }


        if (!trialId) {

            showMessage(
                "Please select a trial.",
                "warning"
            );

            return;

        }


        if (!medicineName) {

            showMessage(
                "Please enter medicine name.",
                "warning"
            );

            return;

        }


        if (!medicineType) {

            showMessage(
                "Please select medicine type.",
                "warning"
            );

            return;

        }


        if (!dosage) {

            showMessage(
                "Please enter dosage.",
                "warning"
            );

            return;

        }


        if (!frequency) {

            showMessage(
                "Please select frequency.",
                "warning"
            );

            return;

        }


        if (!startDate || !endDate) {

            showMessage(
                "Please select medicine duration.",
                "warning"
            );

            return;

        }


        if (timings.length === 0) {

            showMessage(
                "Please select at least one medicine timing.",
                "warning"
            );

            return;

        }


        /* =================================================
           REQUEST DATA
           ================================================= */

        const medicineData = {

            patient_id: patientId,

            trial_id: trialId,

            medicine_name: medicineName,

            medicine_type: medicineType,

            dosage: dosage,

            frequency: frequency,

            timings: timings,

            start_date: startDate,

            end_date: endDate,

            instructions: instructions,

            sms_reminder: smsReminder

        };


        try {

            const button =
                medicineForm.querySelector(
                    ".prescribe-button"
                );


            button.disabled = true;

            button.innerHTML = `
                <span
                    class="spinner-border spinner-border-sm"
                ></span>

                Saving...
            `;


            const response =
                await fetch(
                    API.medicines,
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify(
                                medicineData
                            )

                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Unable to prescribe medicine"
                );

            }


            /*
                Medicine successfully saved.
            */

            showMessage(
                "Medicine prescribed successfully.",
                "success"
            );


            medicineForm.reset();


            loadMedicines();

        }

        catch (error) {

            console.error(
                error
            );


            showMessage(
                "Unable to save medicine. Please try again.",
                "danger"
            );

        }

        finally {

            const button =
                medicineForm.querySelector(
                    ".prescribe-button"
                );


            button.disabled = false;

            button.innerHTML = `
                <i class="bi bi-plus-circle"></i>

                Prescribe Medicine
            `;

        }

    }
);


/* =========================================================
   LOAD MEDICINES
   ========================================================= */

async function loadMedicines() {

    showLoading();


    try {

        const response =
            await fetch(
                API.medicines,
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
                "Unable to load medicines"
            );

        }


        const medicines =
            await response.json();


        renderMedicines(
            medicines
        );


        updateSummary(
            medicines
        );

    }

    catch (error) {

        console.error(
            error
        );


        showEmpty();

    }

}


/* =========================================================
   RENDER MEDICINES
   ========================================================= */

function renderMedicines(
    medicines
) {

    medicineTableBody.innerHTML = "";


    if (
        !medicines ||
        medicines.length === 0
    ) {

        showEmpty();

        return;

    }


    loadingState.hidden = true;

    emptyState.hidden = true;

    tableContainer.hidden = false;


    medicines.forEach(
        function (medicine) {

            const row =
                document.createElement("tr");


            const timings =
                Array.isArray(
                    medicine.timings
                )
                    ? medicine.timings.join(", ")
                    : "--";


            const status =
                getMedicineStatus(
                    medicine
                );


            const smsClass =
                medicine.sms_reminder
                    ? "sms-enabled"
                    : "sms-disabled";


            const smsText =
                medicine.sms_reminder
                    ? "Enabled"
                    : "Disabled";


            row.innerHTML = `

                <td>

                    <div class="patient-cell">

                        <div class="patient-avatar">

                            <i class="bi bi-person"></i>

                        </div>

                        <strong>
                            ${escapeHtml(
                                medicine.patient_name ||
                                "--"
                            )}
                        </strong>

                    </div>

                </td>


                <td>

                    <span class="medicine-name">

                        ${escapeHtml(
                            medicine.medicine_name ||
                            "--"
                        )}

                    </span>

                </td>


                <td>

                    ${escapeHtml(
                        medicine.dosage ||
                        "--"
                    )}

                </td>


                <td>

                    ${formatFrequency(
                        medicine.frequency
                    )}

                </td>


                <td>

                    ${escapeHtml(
                        timings
                    )}

                </td>


                <td>

                    ${formatDate(
                        medicine.start_date
                    )}

                    -

                    ${formatDate(
                        medicine.end_date
                    )}

                </td>


                <td>

                    <span class="trial-badge">

                        ${escapeHtml(
                            medicine.trial_name ||
                            `Trial ${medicine.trial_id || "--"}`
                        )}

                    </span>

                </td>


                <td>

                    <span class="sms-badge ${smsClass}">

                        ${smsText}

                    </span>

                </td>


                <td>

                    <span class="status-badge ${status.className}">

                        ${status.text}

                    </span>

                </td>


                <td>

                    <button

                        class="view-button"

                        title="View medicine"

                        onclick="viewMedicine('${medicine.id}')"

                    >

                        <i class="bi bi-eye"></i>

                    </button>

                </td>

            `;


            medicineTableBody.appendChild(
                row
            );

        }
    );

}


/* =========================================================
   MEDICINE STATUS
   ========================================================= */

function getMedicineStatus(
    medicine
) {

    if (
        medicine.status
    ) {

        if (
            medicine.status ===
            "completed"
        ) {

            return {

                text: "Completed",

                className:
                    "status-completed"

            };

        }

    }


    if (
        medicine.end_date
    ) {

        const today =
            new Date();

        const end =
            new Date(
                medicine.end_date
            );


        const difference =
            end.getTime() -
            today.getTime();


        const days =
            Math.ceil(
                difference /
                (1000 * 60 * 60 * 24)
            );


        if (days < 0) {

            return {

                text: "Completed",

                className:
                    "status-completed"

            };

        }


        if (days <= 3) {

            return {

                text: "Expiring Soon",

                className:
                    "status-expiring"

            };

        }

    }


    return {

        text: "Active",

        className:
            "status-active"

    };

}


/* =========================================================
   SUMMARY
   ========================================================= */

function updateSummary(
    medicines
) {

    let active =
        0;

    let completed =
        0;

    let expiring =
        0;


    const patients =
        new Set();


    medicines.forEach(
        function (medicine) {

            const status =
                getMedicineStatus(
                    medicine
                );


            if (
                status.text ===
                "Active"
            ) {

                active++;

            }


            if (
                status.text ===
                "Completed"
            ) {

                completed++;

            }


            if (
                status.text ===
                "Expiring Soon"
            ) {

                expiring++;

            }


            if (
                medicine.patient_id
            ) {

                patients.add(
                    medicine.patient_id
                );

            }

        }
    );


    document.getElementById(
        "activeCount"
    ).textContent =
        active;


    document.getElementById(
        "completedCount"
    ).textContent =
        completed;


    document.getElementById(
        "expiringCount"
    ).textContent =
        expiring;


    document.getElementById(
        "patientCount"
    ).textContent =
        patients.size;

}


/* =========================================================
   VIEW MEDICINE
   ========================================================= */

async function viewMedicine(
    medicineId
) {

    try {

        const response =
            await fetch(
                `${API.medicines}/${medicineId}`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to get medicine"
            );

        }


        const medicine =
            await response.json();


        document.getElementById(
            "modalPatient"
        ).textContent =
            medicine.patient_name || "--";


        document.getElementById(
            "modalMedicine"
        ).textContent =
            medicine.medicine_name || "--";


        document.getElementById(
            "modalDosage"
        ).textContent =
            medicine.dosage || "--";


        document.getElementById(
            "modalFrequency"
        ).textContent =
            formatFrequency(
                medicine.frequency
            );


        document.getElementById(
            "modalTimings"
        ).textContent =
            Array.isArray(
                medicine.timings
            )
                ? medicine.timings.join(", ")
                : "--";


        document.getElementById(
            "modalDuration"
        ).textContent =
            `${formatDate(
                medicine.start_date
            )} - ${formatDate(
                medicine.end_date
            )}`;


        document.getElementById(
            "modalTrial"
        ).textContent =
            medicine.trial_name ||
            `Trial ${medicine.trial_id || "--"}`;


        document.getElementById(
            "modalSms"
        ).textContent =
            medicine.sms_reminder
                ? "Enabled"
                : "Disabled";


        document.getElementById(
            "modalInstructions"
        ).textContent =
            medicine.instructions ||
            "No instructions provided.";


        const modal =
            new bootstrap.Modal(
                document.getElementById(
                    "medicineModal"
                )
            );


        modal.show();

    }

    catch (error) {

        console.error(
            error
        );

        showMessage(
            "Unable to load medicine details.",
            "danger"
        );

    }

}


/* =========================================================
   REFRESH
   ========================================================= */

refreshMedicines.addEventListener(
    "click",
    function () {

        loadMedicines();

    }
);


/* =========================================================
   LOGOUT
   ========================================================= */

logoutButton.addEventListener(
    "click",
    function () {

        /*
            Later connect this with
            your authentication system.
        */

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
   FORM RESET
   ========================================================= */

medicineForm.addEventListener(
    "reset",
    function () {

        setTimeout(
            function () {

                trialSelect.innerHTML = `
                    <option value="">
                        Select trial
                    </option>
                `;

            },
            0
        );

    }
);


/* =========================================================
   LOADING STATE
   ========================================================= */

function showLoading() {

    loadingState.hidden = false;

    emptyState.hidden = true;

    tableContainer.hidden = true;

}


/* =========================================================
   EMPTY STATE
   ========================================================= */

function showEmpty() {

    loadingState.hidden = true;

    emptyState.hidden = false;

    tableContainer.hidden = true;

}


/* =========================================================
   FREQUENCY FORMAT
   ========================================================= */

function formatFrequency(
    frequency
) {

    const frequencies = {

        once_daily:
            "Once daily",

        twice_daily:
            "Twice daily",

        three_times_daily:
            "3 times daily",

        four_times_daily:
            "4 times daily",

        as_needed:
            "As needed"

    };


    return (
        frequencies[frequency] ||
        frequency ||
        "--"
    );

}


/* =========================================================
   DATE FORMAT
   ========================================================= */

function formatDate(
    date
) {

    if (!date) {

        return "--";

    }


    const parsedDate =
        new Date(date);


    if (
        Number.isNaN(
            parsedDate.getTime()
        )
    ) {

        return "--";

    }


    return parsedDate.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


/* =========================================================
   HTML ESCAPE
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


/* =========================================================
   MESSAGE
   ========================================================= */

function showMessage(
    message,
    type
) {

    const existing =
        document.querySelector(
            ".medicine-alert"
        );


    if (existing) {

        existing.remove();

    }


    const alert =
        document.createElement(
            "div"
        );


    alert.className =
        `alert alert-${type} medicine-alert`;


    alert.style.position =
        "fixed";

    alert.style.top =
        "25px";

    alert.style.right =
        "25px";

    alert.style.zIndex =
        "9999";

    alert.style.minWidth =
        "280px";

    alert.style.fontSize =
        "12px";


    alert.textContent =
        message;


    document.body.appendChild(
        alert
    );


    setTimeout(
        function () {

            alert.remove();

        },
        3500
    );

}