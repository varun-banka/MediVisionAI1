/* =========================================================
   MEDVISIONAI
   DOCTOR UPLOAD MEDICAL REPORT
   ========================================================= */


/*
    Backend endpoints expected by this page:

    GET
    /api/doctor/profile

    GET
    /api/doctor/patients

    GET
    /api/doctor/patients/{patient_id}/trials

    POST
    /api/doctor/reports/upload

    POST
    /api/doctor/logout
*/


const PROFILE_API =
    "/api/doctor/profile/";


const PATIENTS_API =
    "/api/doctor/patients/";


const UPLOAD_API =
    "/api/doctor/reports/upload/";


const LOGOUT_API =
    "/api/doctor/logout/";



/* =========================================================
   DOM
   ========================================================= */

const patientSelect =
    document.getElementById(
        "patient"
    );


const trialSelect =
    document.getElementById(
        "trial"
    );


const reportFile =
    document.getElementById(
        "reportFile"
    );


const fileName =
    document.getElementById(
        "fileName"
    );


const fileDropArea =
    document.getElementById(
        "fileDropArea"
    );


const filePreview =
    document.getElementById(
        "filePreview"
    );


const uploadForm =
    document.getElementById(
        "reportUploadForm"
    );


const uploadButton =
    document.getElementById(
        "uploadButton"
    );


const uploadStatus =
    document.getElementById(
        "uploadStatus"
    );


const doctorName =
    document.getElementById(
        "doctorName"
    );



/* =========================================================
   INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadDoctorProfile();

        loadAssignedPatients();

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
            "Profile loading error:",
            error
        );

    }

}



/* =========================================================
   LOAD ASSIGNED PATIENTS
   ========================================================= */

async function loadAssignedPatients() {

    try {

        patientSelect.innerHTML = `

            <option value="">
                Loading assigned patients...
            </option>

        `;


        const response =
            await fetch(
                PATIENTS_API,
                {
                    method: "GET",

                    credentials: "include"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load patients"
            );

        }


        const data =
            await response.json();


        const patients =
            Array.isArray(
                data.patients
            )
                ? data.patients
                : [];


        patientSelect.innerHTML = `

            <option value="">
                Select patient
            </option>

        `;


        if (patients.length === 0) {

            patientSelect.innerHTML = `

                <option value="">
                    No assigned patients
                </option>

            `;

            patientSelect.disabled =
                true;

            return;

        }


        patients.forEach(
            patient => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    patient.id;


                option.textContent =
                    patient.name;


                patientSelect.appendChild(
                    option
                );

            }
        );

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


        loadPatientTrials(
            patientId
        );

    }
);



/* =========================================================
   LOAD PATIENT TRIALS
   ========================================================= */

async function loadPatientTrials(
    patientId
) {

    try {

        trialSelect.innerHTML = `

            <option value="">
                Loading trials...
            </option>

        `;


        const response =
            await fetch(
                `/api/doctor/patients/${encodeURIComponent(patientId)}/trials/`,
                {
                    method: "GET",

                    credentials: "include"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load trials"
            );

        }


        const data =
            await response.json();


        const trials =
            Array.isArray(
                data.trials
            )
                ? data.trials
                : [];


        trialSelect.innerHTML = `

            <option value="">
                Select trial
            </option>

        `;


        trials.forEach(
            trial => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    trial.id;


                option.textContent =
                    trial.name;


                trialSelect.appendChild(
                    option
                );

            }
        );


        if (trials.length === 0) {

            trialSelect.innerHTML = `

                <option value="">
                    No trial available
                </option>

            `;

        }

    }

    catch (error) {

        console.error(
            error
        );


        trialSelect.innerHTML = `

            <option value="">
                Unable to load trials
            </option>

        `;

    }

}



/* =========================================================
   FILE SELECTION
   ========================================================= */

reportFile.addEventListener(
    "change",
    function () {

        const file =
            this.files[0];


        if (!file) {

            resetFilePreview();

            return;

        }


        showSelectedFile(
            file
        );

    }
);



/* =========================================================
   DRAG AND DROP
   ========================================================= */

fileDropArea.addEventListener(
    "dragover",
    function (event) {

        event.preventDefault();

        fileDropArea.classList.add(
            "drag-over"
        );

    }
);


fileDropArea.addEventListener(
    "dragleave",
    function () {

        fileDropArea.classList.remove(
            "drag-over"
        );

    }
);


fileDropArea.addEventListener(
    "drop",
    function (event) {

        event.preventDefault();


        fileDropArea.classList.remove(
            "drag-over"
        );


        const files =
            event.dataTransfer.files;


        if (!files.length) {

            return;

        }


        /*
            Assign dropped file to the
            file input.
        */

        try {

            const dataTransfer =
                new DataTransfer();


            dataTransfer.items.add(
                files[0]
            );


            reportFile.files =
                dataTransfer.files;


            showSelectedFile(
                files[0]
            );

        }

        catch (error) {

            console.error(
                "File drop error:",
                error
            );

        }

    }
);



/* =========================================================
   SHOW FILE
   ========================================================= */

function showSelectedFile(
    file
) {

    fileName.textContent =
        file.name;


    fileName.title =
        file.name;


    const fileType =
        String(
            file.type
        ).toLowerCase();


    if (
        fileType.startsWith(
            "image/"
        )
    ) {

        const reader =
            new FileReader();


        reader.onload =
            function (event) {

                filePreview.innerHTML = `

                    <img
                        src="${event.target.result}"
                        alt="Medical Report Preview"
                    >

                `;

            };


        reader.readAsDataURL(
            file
        );

    }

    else if (
        fileType ===
        "application/pdf"
    ) {

        const reader =
            new FileReader();


        reader.onload =
            function (event) {

                filePreview.innerHTML = `

                    <iframe
                        src="${event.target.result}"
                        title="PDF Preview"
                    ></iframe>

                `;

            };


        reader.readAsDataURL(
            file
        );

    }

    else {

        filePreview.innerHTML = `

            <i
                class="bi bi-file-earmark-medical"
                style="
                    font-size:40px;
                    color:#2563eb;
                "
            ></i>

            <p>
                ${escapeHTML(file.name)}
            </p>

        `;

    }

}



/* =========================================================
   RESET FILE
   ========================================================= */

function resetFilePreview() {

    fileName.textContent =
        "No file selected";


    filePreview.innerHTML = `

        <i class="bi bi-file-earmark-medical"></i>

        <p>
            Select a file to preview
        </p>

    `;

}



/* =========================================================
   FORM SUBMIT
   ========================================================= */

uploadForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        clearStatus();


        const patientId =
            patientSelect.value;


        const trialId =
            trialSelect.value;


        const reportType =
            document.getElementById(
                "reportType"
            ).value;


        const reportTitle =
            document.getElementById(
                "reportTitle"
            ).value.trim();


        const doctorNotes =
            document.getElementById(
                "doctorNotes"
            ).value.trim();


        const file =
            reportFile.files[0];


        /* ---------------------------------------------
           VALIDATION
           --------------------------------------------- */

        if (!patientId) {

            showStatus(
                "Please select a patient.",
                "error"
            );

            return;

        }


        if (!trialId) {

            showStatus(
                "Please select the treatment trial.",
                "error"
            );

            return;

        }


        if (!reportType) {

            showStatus(
                "Please select the report type.",
                "error"
            );

            return;

        }


        if (!reportTitle) {

            showStatus(
                "Please enter the report name.",
                "error"
            );

            return;

        }


        if (!file) {

            showStatus(
                "Please select a medical report file.",
                "error"
            );

            return;

        }


        /* ---------------------------------------------
           FILE TYPE
           --------------------------------------------- */

        const allowedTypes = [

            "application/pdf",

            "image/jpeg",

            "image/png",

            "image/webp"

        ];


        if (
            !allowedTypes.includes(
                file.type
            )
        ) {

            showStatus(
                "Unsupported file type. Please upload PDF, JPG, JPEG, PNG or WEBP.",
                "error"
            );

            return;

        }


        /* ---------------------------------------------
           FORM DATA
           --------------------------------------------- */

        const formData =
            new FormData();


        formData.append(
            "patient_id",
            patientId
        );


        formData.append(
            "trial_id",
            trialId
        );


        formData.append(
            "report_type",
            reportType
        );


        formData.append(
            "report_name",
            reportTitle
        );


        formData.append(
            "doctor_notes",
            doctorNotes
        );


        formData.append(
            "report_file",
            file
        );


        /* ---------------------------------------------
           LOADING
           --------------------------------------------- */

        uploadButton.disabled =
            true;


        uploadButton.innerHTML = `

            <span
                class="spinner-border spinner-border-sm"
                role="status"
            ></span>

            Uploading...

        `;


        try {

            const response =
                await fetch(
                    UPLOAD_API,
                    {
                        method: "POST",

                        body: formData,

                        credentials: "include"
                    }
                );


            const data =
                await response.json()
                    .catch(
                        () => ({})
                    );


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Report upload failed."
                );

            }


            showStatus(
                "Medical report uploaded successfully.",
                "success"
            );


            uploadForm.reset();


            resetFilePreview();


            trialSelect.innerHTML = `

                <option value="">
                    Select patient first
                </option>

            `;


        }

        catch (error) {

            console.error(
                "Upload error:",
                error
            );


            showStatus(
                error.message ||
                "Unable to upload report.",
                "error"
            );

        }

        finally {

            uploadButton.disabled =
                false;


            uploadButton.innerHTML = `

                <i class="bi bi-cloud-arrow-up"></i>

                Upload Medical Report

            `;

        }

    }
);



/* =========================================================
   STATUS MESSAGE
   ========================================================= */

function showStatus(
    message,
    type
) {

    uploadStatus.hidden =
        false;


    uploadStatus.className =
        `upload-status ${type}`;


    uploadStatus.textContent =
        message;


    uploadStatus.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


function clearStatus() {

    uploadStatus.hidden =
        true;


    uploadStatus.textContent =
        "";

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
   SECURITY HELPER
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