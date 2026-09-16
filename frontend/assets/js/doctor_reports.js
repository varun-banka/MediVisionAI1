/* =========================================================
   MEDVISIONAI
   DOCTOR MEDICAL REPORTS
   ========================================================= */


/*
    IMPORTANT:

    No dummy reports are created here.

    Reports come from the backend API.
*/


const REPORTS_API =
    "/api/doctor/reports/";


const PROFILE_API =
    "/api/doctor/profile/";


const LOGOUT_API =
    "/api/doctor/logout/";



/* =========================================================
   DOM
   ========================================================= */

const reportSearch =
    document.getElementById(
        "reportSearch"
    );


const reportTypeFilter =
    document.getElementById(
        "reportTypeFilter"
    );


const trialFilter =
    document.getElementById(
        "trialFilter"
    );


const reportTableBody =
    document.getElementById(
        "reportTableBody"
    );


const reportTableWrapper =
    document.getElementById(
        "reportTableWrapper"
    );


const emptyReports =
    document.getElementById(
        "emptyReports"
    );


const totalReports =
    document.getElementById(
        "totalReports"
    );


const pendingReports =
    document.getElementById(
        "pendingReports"
    );


const reviewedReports =
    document.getElementById(
        "reviewedReports"
    );


const todayReports =
    document.getElementById(
        "todayReports"
    );


const doctorName =
    document.getElementById(
        "doctorName"
    );



/* =========================================================
   DATA
   ========================================================= */

let reports = [];



/* =========================================================
   INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadDoctorProfile();

        loadReports();

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
   LOAD REPORTS
   ========================================================= */

async function loadReports() {

    try {

        const response =
            await fetch(
                REPORTS_API,
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


        reports =
            Array.isArray(
                data.reports
            )
                ? data.reports
                : [];


        updateStatistics(
            data
        );


        populateTrialFilter(
            reports
        );


        renderReports(
            reports
        );

    }

    catch (error) {

        console.error(
            "Report loading error:",
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

    totalReports.textContent =
        data.total_reports ?? "--";


    pendingReports.textContent =
        data.pending_reports ?? "--";


    reviewedReports.textContent =
        data.reviewed_reports ?? "--";


    todayReports.textContent =
        data.today_reports ?? "--";

}



/* =========================================================
   TRIAL FILTER
   ========================================================= */

function populateTrialFilter(
    reportData
) {

    const trials =
        [
            ...new Set(
                reportData
                    .map(
                        report =>
                            report.trial
                    )
                    .filter(Boolean)
            )
        ];


    trialFilter.innerHTML = `

        <option value="all">
            All Trials
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

}



/* =========================================================
   RENDER REPORTS
   ========================================================= */

function renderReports(
    reportData
) {

    if (
        !reportData ||
        reportData.length === 0
    ) {

        showEmptyState();

        return;

    }


    emptyReports.hidden =
        true;

    reportTableWrapper.hidden =
        false;


    reportTableBody.innerHTML =
        "";


    reportData.forEach(
        report => {

            const row =
                document.createElement(
                    "tr"
                );


            const patientName =
                escapeHTML(
                    report.patient_name ||
                    "Patient"
                );


            const patientId =
                escapeHTML(
                    report.patient_id ||
                    "--"
                );


            const reportName =
                escapeHTML(
                    report.report_name ||
                    "Medical Report"
                );


            const reportType =
                escapeHTML(
                    report.report_type ||
                    "Other"
                );


            const trial =
                escapeHTML(
                    report.trial ||
                    "--"
                );


            const uploadedBy =
                escapeHTML(
                    report.uploaded_by ||
                    "--"
                );


            const updatedDate =
                escapeHTML(
                    report.updated_at ||
                    "--"
                );


            const status =
                String(
                    report.status ||
                    ""
                ).toLowerCase();


            let statusClass =
                "status-pending";


            if (
                status === "reviewed"
            ) {

                statusClass =
                    "status-reviewed";

            }


            const photo =
                report.patient_photo ||
                "";


            let avatarHTML =
                `
                    <i class="bi bi-person"></i>
                `;


            if (photo) {

                avatarHTML = `

                    <img
                        src="${escapeAttribute(photo)}"
                        alt="Patient"
                    >

                `;

            }


            row.innerHTML = `

                <td>

                    <div class="patient-name">

                        <div class="patient-avatar">

                            ${avatarHTML}

                        </div>


                        <div>

                            <strong>
                                ${patientName}
                            </strong>

                            <span>
                                ${patientId}
                            </span>

                        </div>

                    </div>

                </td>


                <td>

                    <div class="report-file">

                        <div class="file-icon">

                            <i class="bi bi-file-earmark-medical"></i>

                        </div>


                        <div>

                            <strong>
                                ${reportName}
                            </strong>

                            <span>
                                ${escapeHTML(
                                    report.file_type || ""
                                )}
                            </span>

                        </div>

                    </div>

                </td>


                <td>

                    <span class="type-badge">

                        ${reportType}

                    </span>

                </td>


                <td>

                    <span class="trial-badge">

                        ${trial}

                    </span>

                </td>


                <td>

                    ${uploadedBy}

                </td>


                <td>

                    ${updatedDate}

                </td>


                <td>

                    <span
                        class="status-badge ${statusClass}"
                    >

                        ${escapeHTML(
                            report.status || "Pending"
                        )}

                    </span>

                </td>


                <td>

                    <button
                        class="view-report"
                        data-report-id="${escapeAttribute(
                            report.id || ""
                        )}"
                    >

                        <i class="bi bi-eye"></i>

                        View

                    </button>

                </td>

            `;


            reportTableBody.appendChild(
                row
            );

        }
    );


    attachViewButtons();

}



/* =========================================================
   VIEW REPORT
   ========================================================= */

function attachViewButtons() {

    document
        .querySelectorAll(
            ".view-report"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function () {

                        const reportId =
                            this.dataset.reportId;


                        const report =
                            reports.find(
                                item =>
                                    String(
                                        item.id
                                    ) ===
                                    String(
                                        reportId
                                    )
                            );


                        if (!report) {

                            return;

                        }


                        openReport(
                            report
                        );

                    }
                );

            }
        );

}



/* =========================================================
   OPEN REPORT
   ========================================================= */

function openReport(
    report
) {

    document.getElementById(
        "modalReportTitle"
    ).textContent =
        report.report_name ||
        "Medical Report";


    document.getElementById(
        "modalPatientName"
    ).textContent =
        report.patient_name ||
        "Patient";


    document.getElementById(
        "modalUploadedBy"
    ).textContent =
        report.uploaded_by ||
        "--";


    document.getElementById(
        "modalUploadedDate"
    ).textContent =
        report.updated_at ||
        "--";


    document.getElementById(
        "modalTrial"
    ).textContent =
        report.trial ||
        "--";


    const viewer =
        document.getElementById(
            "reportViewer"
        );


    viewer.innerHTML =
        "";


    if (!report.file_url) {

        viewer.innerHTML = `

            <div class="text-center">

                <i
                    class="bi bi-file-earmark-x"
                    style="font-size:40px;color:#94a3b8;"
                ></i>

                <p
                    style="
                        margin-top:10px;
                        color:#64748b;
                        font-size:12px;
                    "
                >

                    Report file is not available.

                </p>

            </div>

        `;

    }

    else {

        const fileType =
            String(
                report.file_type ||
                ""
            ).toLowerCase();


        if (
            fileType.includes("image") ||
            /\.(jpg|jpeg|png|webp)$/i.test(
                report.file_url
            )
        ) {

            const image =
                document.createElement(
                    "img"
                );


            image.src =
                report.file_url;


            image.alt =
                "Medical Report";


            viewer.appendChild(
                image
            );

        }

        else {

            const iframe =
                document.createElement(
                    "iframe"
                );


            iframe.src =
                report.file_url;


            iframe.title =
                "Medical Report";


            viewer.appendChild(
                iframe
            );

        }

    }


    const downloadButton =
        document.getElementById(
            "downloadReport"
        );


    downloadButton.href =
        report.file_url ||
        "#";


    const modal =
        new bootstrap.Modal(
            document.getElementById(
                "reportPreviewModal"
            )
        );


    modal.show();

}



/* =========================================================
   SEARCH + FILTER
   ========================================================= */

reportSearch.addEventListener(
    "input",
    applyFilters
);


reportTypeFilter.addEventListener(
    "change",
    applyFilters
);


trialFilter.addEventListener(
    "change",
    applyFilters
);



function applyFilters() {

    const search =
        reportSearch.value
            .trim()
            .toLowerCase();


    const type =
        reportTypeFilter.value
            .toLowerCase();


    const trial =
        trialFilter.value;


    const filtered =
        reports.filter(
            report => {

                const patient =
                    String(
                        report.patient_name ||
                        ""
                    ).toLowerCase();


                const patientId =
                    String(
                        report.patient_id ||
                        ""
                    ).toLowerCase();


                const reportName =
                    String(
                        report.report_name ||
                        ""
                    ).toLowerCase();


                const reportType =
                    String(
                        report.report_type ||
                        ""
                    ).toLowerCase();


                const matchesSearch =
                    patient.includes(search) ||
                    patientId.includes(search) ||
                    reportName.includes(search);


                const matchesType =
                    type === "all" ||
                    reportType === type;


                const matchesTrial =
                    trial === "all" ||
                    report.trial === trial;


                return (
                    matchesSearch &&
                    matchesType &&
                    matchesTrial
                );

            }
        );


    renderReports(
        filtered
    );

}



/* =========================================================
   EMPTY STATE
   ========================================================= */

function showEmptyState() {

    emptyReports.hidden =
        false;

    reportTableWrapper.hidden =
        true;

    reportTableBody.innerHTML =
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

    return String(value)

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