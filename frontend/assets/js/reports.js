/* =========================================================
   MEDVISIONAI
   PATIENT MEDICAL REPORTS
   ========================================================= */


/*
    IMPORTANT:

    There is NO dummy report data in this file.

    All reports are obtained from the backend.

    Expected API:

        GET /api/patient/reports

*/


const REPORTS_API =
    "/api/patient/reports/";


const PATIENT_API =
    "/api/patient/profile/";


let allReports = [];



/* =========================================================
   PAGE INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadPatientProfile();

        loadReports();

        setupFilters();

        document
            .getElementById("retryButton")
            .addEventListener(
                "click",
                loadReports
            );

    }
);



/* =========================================================
   LOAD PATIENT PROFILE
   ========================================================= */

async function loadPatientProfile() {

    try {

        const response =
            await fetch(
                PATIENT_API,
                {
                    method: "GET",

                    credentials: "include",

                    headers: {
                        "Content-Type":
                            "application/json"
                    }
                }
            );


        if (!response.ok) {

            return;

        }


        const patient =
            await response.json();


        const nameElement =
            document.getElementById(
                "patientName"
            );


        const imageElement =
            document.getElementById(
                "patientProfileImage"
            );


        if (patient.name) {

            nameElement.textContent =
                patient.name;

        }


        if (patient.photo_url) {

            imageElement.src =
                patient.photo_url;

            imageElement.hidden =
                false;

        }

    }

    catch (error) {

        console.error(
            "Patient profile error:",
            error
        );

    }

}



/* =========================================================
   LOAD REPORTS
   ========================================================= */

async function loadReports() {

    showLoading();

    hideError();

    hideEmpty();


    try {

        const response =
            await fetch(
                REPORTS_API,
                {
                    method: "GET",

                    credentials: "include",

                    headers: {
                        "Content-Type":
                            "application/json"
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to fetch reports"
            );

        }


        const data =
            await response.json();


        allReports =
            Array.isArray(data.reports)
                ? data.reports
                : [];


        hideLoading();


        populateFilters(
            allReports
        );


        if (
            allReports.length === 0
        ) {

            showEmpty();

            return;

        }


        renderReports(
            allReports
        );

    }

    catch (error) {

        console.error(
            "Reports API Error:",
            error
        );


        hideLoading();

        showError(
            "We could not retrieve your medical reports. Please try again."
        );

    }

}



/* =========================================================
   RENDER REPORTS
   ========================================================= */

function renderReports(
    reports
) {

    const container =
        document.getElementById(
            "reportsContainer"
        );


    container.innerHTML = "";


    if (
        !reports ||
        reports.length === 0
    ) {

        showEmpty();

        return;

    }


    const grid =
        document.createElement(
            "div"
        );


    grid.className =
        "reports-grid";


    reports.forEach(
        report => {

            const card =
                createReportCard(
                    report
                );


            grid.appendChild(
                card
            );

        }
    );


    container.appendChild(
        grid
    );

}



/* =========================================================
   CREATE REPORT CARD
   ========================================================= */

function createReportCard(
    report
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "report-card";


    const reportType =
        report.report_type ||
        "Medical Report";


    const icon =
        getReportIcon(
            reportType
        );


    const uploadedBy =
        report.uploaded_by ||
        report.doctor_name ||
        report.hospital_name ||
        "Medical Team";


    const trial =
        report.trial ||
        report.trial_name ||
        "Not specified";


    const uploadedDate =
        formatDateTime(
            report.uploaded_at
        );


    const updatedDate =
        formatDateTime(
            report.updated_at ||
            report.uploaded_at
        );


    card.innerHTML = `

        <div class="report-top">

            <div class="report-icon">

                <i class="${icon}"></i>

            </div>


            <span class="report-type">

                ${escapeHTML(
                    reportType
                )}

            </span>

        </div>



        <h4>

            ${escapeHTML(
                report.report_name ||
                "Medical Report"
            )}

        </h4>


        <p class="report-description">

            ${escapeHTML(
                report.description ||
                "Medical report uploaded to your patient record."
            )}

        </p>



        <div class="report-info">


            <div class="info-item">

                <span class="info-label">
                    Uploaded By
                </span>

                <span class="info-value">

                    ${escapeHTML(
                        uploadedBy
                    )}

                </span>

            </div>


            <div class="info-item">

                <span class="info-label">
                    Trial
                </span>

                <span class="info-value">

                    ${escapeHTML(
                        trial
                    )}

                </span>

            </div>


            <div class="info-item">

                <span class="info-label">
                    Doctor
                </span>

                <span class="info-value">

                    ${escapeHTML(
                        report.doctor_name ||
                        "Not specified"
                    )}

                </span>

            </div>


            <div class="info-item">

                <span class="info-label">
                    Hospital
                </span>

                <span class="info-value">

                    ${escapeHTML(
                        report.hospital_name ||
                        "Not specified"
                    )}

                </span>

            </div>


        </div>



        <div class="report-dates">


            <div class="date-row">

                <span class="date-label">

                    <i class="bi bi-upload"></i>

                    Uploaded

                </span>


                <span class="date-value">

                    ${uploadedDate}

                </span>

            </div>



            <div class="date-row">

                <span class="date-label">

                    <i class="bi bi-clock-history"></i>

                    Last Updated

                </span>


                <span class="date-value">

                    ${updatedDate}

                </span>

            </div>


        </div>



        <div class="report-actions">


            <button
                type="button"
                class="btn view-report-btn"
                data-report-id="${escapeHTML(
                    report.id
                )}"
            >

                <i class="bi bi-eye"></i>

                View Report

            </button>


            <a
                href="${escapeAttribute(
                    report.file_url ||
                    "#"
                )}"
                class="download-report-btn"
                target="_blank"
                rel="noopener noreferrer"
            >

                <i class="bi bi-download"></i>

                Download

            </a>


        </div>

    `;


    const viewButton =
        card.querySelector(
            ".view-report-btn"
        );


    viewButton.addEventListener(
        "click",
        function () {

            openReportViewer(
                report
            );

        }
    );


    return card;

}



/* =========================================================
   REPORT VIEWER
   ========================================================= */

function openReportViewer(
    report
) {

    const modalElement =
        document.getElementById(
            "reportViewerModal"
        );


    const title =
        document.getElementById(
            "viewerTitle"
        );


    const updated =
        document.getElementById(
            "viewerUpdatedDate"
        );


    const body =
        document.getElementById(
            "reportViewerBody"
        );


    const download =
        document.getElementById(
            "downloadReportButton"
        );


    title.textContent =
        report.report_name ||
        "Medical Report";


    updated.textContent =
        "Last updated: " +
        formatDateTime(
            report.updated_at ||
            report.uploaded_at
        );


    download.href =
        report.file_url ||
        "#";


    body.innerHTML = "";


    if (!report.file_url) {

        body.innerHTML = `

            <div class="text-center">

                <i
                    class="bi bi-file-earmark-x"
                    style="font-size:50px;color:#94a3b8;"
                ></i>

                <p class="mt-3">
                    Report file is not available.
                </p>

            </div>

        `;

    }

    else {

        const fileType =
            getFileType(
                report.file_url
            );


        if (
            fileType === "pdf"
        ) {

            body.innerHTML = `

                <iframe
                    src="${escapeAttribute(
                        report.file_url
                    )}"
                    title="Medical Report"
                ></iframe>

            `;

        }

        else if (
            [
                "jpg",
                "jpeg",
                "png",
                "webp"
            ].includes(fileType)
        ) {

            body.innerHTML = `

                <img
                    src="${escapeAttribute(
                        report.file_url
                    )}"
                    alt="Medical Report"
                >

            `;

        }

        else {

            body.innerHTML = `

                <div class="text-center">

                    <i
                        class="bi bi-file-earmark"
                        style="font-size:50px;color:#2563eb;"
                    ></i>

                    <p class="mt-3">

                        This report format cannot
                        be previewed here.

                    </p>

                    <p>

                        Use the Download button
                        to open the report.

                    </p>

                </div>

            `;

        }

    }


    const modal =
        new bootstrap.Modal(
            modalElement
        );


    modal.show();

}



/* =========================================================
   FILTER SETUP
   ========================================================= */

function setupFilters() {

    const trialFilter =
        document.getElementById(
            "trialFilter"
        );


    const typeFilter =
        document.getElementById(
            "reportTypeFilter"
        );


    trialFilter.addEventListener(
        "change",
        applyFilters
    );


    typeFilter.addEventListener(
        "change",
        applyFilters
    );

}



/* =========================================================
   POPULATE FILTERS
   ========================================================= */

function populateFilters(
    reports
) {

    const trialFilter =
        document.getElementById(
            "trialFilter"
        );


    const typeFilter =
        document.getElementById(
            "reportTypeFilter"
        );


    const trials =
        new Set();


    const types =
        new Set();


    reports.forEach(
        report => {

            const trial =
                report.trial ||
                report.trial_name;


            const type =
                report.report_type;


            if (trial) {

                trials.add(
                    trial
                );

            }


            if (type) {

                types.add(
                    type
                );

            }

        }
    );


    trialFilter.innerHTML = `

        <option value="all">
            All Trials
        </option>

    `;


    typeFilter.innerHTML = `

        <option value="all">
            All Report Types
        </option>

    `;


    trials.forEach(
        trial => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                trial;


            option.textContent =
                trial;


            trialFilter.appendChild(
                option
            );

        }
    );


    types.forEach(
        type => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                type;


            option.textContent =
                type;


            typeFilter.appendChild(
                option
            );

        }
    );

}



/* =========================================================
   APPLY FILTERS
   ========================================================= */

function applyFilters() {

    const trial =
        document.getElementById(
            "trialFilter"
        ).value;


    const type =
        document.getElementById(
            "reportTypeFilter"
        ).value;


    const filtered =
        allReports.filter(
            report => {

                const reportTrial =
                    report.trial ||
                    report.trial_name ||
                    "";


                const reportType =
                    report.report_type ||
                    "";


                const trialMatch =
                    trial === "all" ||
                    reportTrial === trial;


                const typeMatch =
                    type === "all" ||
                    reportType === type;


                return (
                    trialMatch &&
                    typeMatch
                );

            }
        );


    renderReports(
        filtered
    );

}



/* =========================================================
   REPORT ICON
   ========================================================= */

function getReportIcon(
    type
) {

    const value =
        type.toLowerCase();


    if (
        value.includes("x-ray") ||
        value.includes("xray")
    ) {

        return "bi bi-file-earmark-image";

    }


    if (
        value.includes("mri")
    ) {

        return "bi bi-camera";

    }


    if (
        value.includes("ct")
    ) {

        return "bi bi-layers";

    }


    if (
        value.includes("blood")
    ) {

        return "bi bi-droplet";

    }


    if (
        value.includes("dna") ||
        value.includes("genetic")
    ) {

        return "bi bi-diagram-3";

    }


    if (
        value.includes("skin")
    ) {

        return "bi bi-person-square";

    }


    return "bi bi-file-earmark-medical";

}



/* =========================================================
   FILE TYPE
   ========================================================= */

function getFileType(
    url
) {

    if (!url) {

        return "";

    }


    const cleanURL =
        url.split("?")[0];


    const parts =
        cleanURL.split(".");


    if (parts.length < 2) {

        return "";

    }


    return parts
        .pop()
        .toLowerCase();

}



/* =========================================================
   FORMAT DATE
   ========================================================= */

function formatDateTime(
    value
) {

    if (!value) {

        return "Not available";

    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return value;

    }


    return date.toLocaleString(
        "en-IN",
        {
            day: "2-digit",

            month: "short",

            year: "numeric",

            hour: "2-digit",

            minute: "2-digit",

            hour12: true
        }
    );

}



/* =========================================================
   UI STATES
   ========================================================= */

function showLoading() {

    document
        .getElementById(
            "reportsLoading"
        )
        .hidden = false;

}


function hideLoading() {

    document
        .getElementById(
            "reportsLoading"
        )
        .hidden = true;

}


function showEmpty() {

    document
        .getElementById(
            "noReports"
        )
        .hidden = false;

}


function hideEmpty() {

    document
        .getElementById(
            "noReports"
        )
        .hidden = true;

}


function showError(
    message
) {

    const error =
        document.getElementById(
            "reportsError"
        );


    document.getElementById(
        "errorMessage"
    ).textContent =
        message;


    error.hidden = false;

}


function hideError() {

    document
        .getElementById(
            "reportsError"
        )
        .hidden = true;

}



/* =========================================================
   SECURITY HELPERS
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



function escapeAttribute(
    value
) {

    return escapeHTML(
        value
    );

}