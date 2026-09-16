// =========================================================
// MEDVISIONAI - HOSPITAL REPORTS JS
// =========================================================

document.addEventListener("DOMContentLoaded", function () {


    // =====================================================
    // ELEMENTS
    // =====================================================

    const reportsTableBody =
        document.getElementById("reportsTableBody");

    const emptyState =
        document.getElementById("emptyState");

    const reportSearch =
        document.getElementById("reportSearch");

    const reportTypeFilter =
        document.getElementById("reportTypeFilter");

    const reportStatusFilter =
        document.getElementById("reportStatusFilter");

    const reportCount =
        document.getElementById("reportCount");

    const totalReports =
        document.getElementById("totalReports");

    const pendingReports =
        document.getElementById("pendingReports");

    const completedReports =
        document.getElementById("completedReports");

    const todayReports =
        document.getElementById("todayReports");

    const reportModal =
        document.getElementById("reportModal");

    const closeReportModal =
        document.getElementById("closeReportModal");

    const closeReportBtn =
        document.getElementById("closeReportBtn");

    const reportDetails =
        document.getElementById("reportDetails");

    const modalReportTitle =
        document.getElementById("modalReportTitle");

    const downloadReportBtn =
        document.getElementById("downloadReportBtn");

    const notificationBtn =
        document.getElementById("notificationBtn");

    const mobileMenuBtn =
        document.getElementById("mobileMenuBtn");

    const sidebar =
        document.getElementById("sidebar");

    const sidebarOverlay =
        document.getElementById("sidebarOverlay");

    const logoutBtn =
        document.getElementById("logoutBtn");


    // =====================================================
    // REPORT DATA
    // =====================================================

    /*
        IMPORTANT:

        No dummy report data is used.

        Later Django will provide:

        GET /api/hospital/reports/

        Expected structure:

        {
            id: 1,
            report_id: "REP001",
            patient_name: "Patient Name",
            patient_id: "PAT001",
            doctor: "Doctor Name",
            report_type: "Blood Test",
            report_date: "2026-08-15",
            status: "Completed",
            description: "Report description"
        }
    */

    let reports = [];

    let selectedReportId = null;


    // =====================================================
    // INITIALIZE
    // =====================================================

    initializePage();


    function initializePage() {

        renderReports([]);

        updateStatistics([]);

    }


    // =====================================================
    // RENDER REPORTS
    // =====================================================

    function renderReports(data) {


        if (!reportsTableBody) {

            return;

        }


        reportsTableBody.innerHTML = "";


        // No reports

        if (!data || data.length === 0) {

            reportsTableBody.style.display =
                "none";


            if (emptyState) {

                emptyState.style.display =
                    "flex";

            }


            updateReportCount(0);

            return;

        }


        if (emptyState) {

            emptyState.style.display =
                "none";

        }


        reportsTableBody.style.display =
            "table-row-group";


        data.forEach(function (report) {


            const row =
                document.createElement("tr");


            // =================================================
            // REPORT
            // =================================================

            const reportCell =
                document.createElement("td");


            reportCell.innerHTML = `

                <div class="report-cell">

                    <div class="report-icon">

                        <i class="bi bi-file-earmark-medical-fill"></i>

                    </div>


                    <div class="report-name">

                        <strong>
                            ${escapeHTML(
                                report.report_id || "--"
                            )}
                        </strong>

                        <small>
                            ${escapeHTML(
                                report.report_type || "Report"
                            )}
                        </small>

                    </div>

                </div>

            `;


            // =================================================
            // PATIENT
            // =================================================

            const patientCell =
                document.createElement("td");


            patientCell.innerHTML = `

                <div class="patient-cell">

                    <div class="patient-avatar">

                        <i class="bi bi-person-fill"></i>

                    </div>


                    <div class="patient-name">

                        <strong>
                            ${escapeHTML(
                                report.patient_name ||
                                "Patient"
                            )}
                        </strong>

                        <small>
                            ${escapeHTML(
                                report.patient_id ||
                                "--"
                            )}
                        </small>

                    </div>

                </div>

            `;


            // =================================================
            // DOCTOR
            // =================================================

            const doctorCell =
                document.createElement("td");


            doctorCell.textContent =
                report.doctor || "Not Assigned";


            // =================================================
            // REPORT TYPE
            // =================================================

            const typeCell =
                document.createElement("td");


            typeCell.textContent =
                report.report_type || "--";


            // =================================================
            // DATE
            // =================================================

            const dateCell =
                document.createElement("td");


            dateCell.textContent =
                formatDate(
                    report.report_date
                );


            // =================================================
            // STATUS
            // =================================================

            const statusCell =
                document.createElement("td");


            const status =
                String(
                    report.status || "Pending"
                ).toLowerCase();


            if (status === "completed") {

                statusCell.innerHTML = `

                    <span class="status-badge status-completed">

                        Completed

                    </span>

                `;

            } else {

                statusCell.innerHTML = `

                    <span class="status-badge status-pending">

                        Pending

                    </span>

                `;

            }


            // =================================================
            // ACTIONS
            // =================================================

            const actionCell =
                document.createElement("td");


            actionCell.innerHTML = `

                <div class="action-buttons">


                    <button
                        class="action-btn view-btn"
                        title="View Report"
                        data-action="view"
                        data-id="${report.id}"
                    >

                        <i class="bi bi-eye-fill"></i>

                    </button>


                    <button
                        class="action-btn download-btn-small"
                        title="Download Report"
                        data-action="download"
                        data-id="${report.id}"
                    >

                        <i class="bi bi-download"></i>

                    </button>


                </div>

            `;


            row.appendChild(reportCell);

            row.appendChild(patientCell);

            row.appendChild(doctorCell);

            row.appendChild(typeCell);

            row.appendChild(dateCell);

            row.appendChild(statusCell);

            row.appendChild(actionCell);


            reportsTableBody.appendChild(row);

        });


        updateReportCount(data.length);

    }


    // =====================================================
    // REPORT COUNT
    // =====================================================

    function updateReportCount(count) {

        if (!reportCount) {

            return;

        }


        reportCount.textContent =
            `${count} Report${count === 1 ? "" : "s"}`;

    }


    // =====================================================
    // STATISTICS
    // =====================================================

    function updateStatistics(data) {


        if (!data) {

            data = [];

        }


        // Total

        if (totalReports) {

            totalReports.textContent =
                data.length;

        }


        // Pending

        const pending =
            data.filter(function (report) {

                return String(
                    report.status || ""
                ).toLowerCase() === "pending";

            }).length;


        if (pendingReports) {

            pendingReports.textContent =
                pending;

        }


        // Completed

        const completed =
            data.filter(function (report) {

                return String(
                    report.status || ""
                ).toLowerCase() === "completed";

            }).length;


        if (completedReports) {

            completedReports.textContent =
                completed;

        }


        // Today's reports

        const today =
            new Date()
                .toISOString()
                .split("T")[0];


        const todayCount =
            data.filter(function (report) {

                return report.report_date === today;

            }).length;


        if (todayReports) {

            todayReports.textContent =
                todayCount;

        }

    }


    // =====================================================
    // SEARCH + FILTER
    // =====================================================

    function filterReports() {


        const searchText =
            (
                reportSearch?.value || ""
            )
            .toLowerCase()
            .trim();


        const selectedType =
            (
                reportTypeFilter?.value || "all"
            )
            .toLowerCase();


        const selectedStatus =
            (
                reportStatusFilter?.value || "all"
            )
            .toLowerCase();


        const filtered =
            reports.filter(function (report) {


                const patientName =
                    String(
                        report.patient_name || ""
                    ).toLowerCase();


                const reportId =
                    String(
                        report.report_id || ""
                    ).toLowerCase();


                const doctor =
                    String(
                        report.doctor || ""
                    ).toLowerCase();


                const reportType =
                    String(
                        report.report_type || ""
                    ).toLowerCase();


                const status =
                    String(
                        report.status || ""
                    ).toLowerCase();


                const matchesSearch =

                    patientName.includes(
                        searchText
                    ) ||

                    reportId.includes(
                        searchText
                    ) ||

                    doctor.includes(
                        searchText
                    );


                const matchesType =

                    selectedType === "all" ||

                    reportType === selectedType;


                const matchesStatus =

                    selectedStatus === "all" ||

                    status === selectedStatus;


                return (

                    matchesSearch &&

                    matchesType &&

                    matchesStatus

                );

            });


        renderReports(filtered);

    }


    if (reportSearch) {

        reportSearch.addEventListener(
            "input",
            filterReports
        );

    }


    if (reportTypeFilter) {

        reportTypeFilter.addEventListener(
            "change",
            filterReports
        );

    }


    if (reportStatusFilter) {

        reportStatusFilter.addEventListener(
            "change",
            filterReports
        );

    }


    // =====================================================
    // TABLE ACTIONS
    // =====================================================

    if (reportsTableBody) {

        reportsTableBody.addEventListener(
            "click",
            function (event) {


                const button =
                    event.target.closest(
                        "[data-action]"
                    );


                if (!button) {

                    return;

                }


                const action =
                    button.dataset.action;


                const reportId =
                    button.dataset.id;


                if (action === "view") {

                    viewReport(reportId);

                }


                if (action === "download") {

                    downloadReport(reportId);

                }

            }
        );

    }


    // =====================================================
    // VIEW REPORT
    // =====================================================

    function viewReport(id) {


        selectedReportId = id;


        const report =
            reports.find(function (item) {

                return String(item.id) ===
                    String(id);

            });


        if (!report) {

            return;

        }


        showReportModal(report);

    }


    // =====================================================
    // SHOW REPORT MODAL
    // =====================================================

    function showReportModal(report) {


        if (!reportModal) {

            return;

        }


        if (modalReportTitle) {

            modalReportTitle.textContent =
                report.report_id ||
                "Report Details";

        }


        if (reportDetails) {

            reportDetails.innerHTML = `

                <div class="detail-grid">


                    <div class="detail-item">

                        <span>
                            Report ID
                        </span>

                        <strong>
                            ${escapeHTML(
                                report.report_id || "--"
                            )}
                        </strong>

                    </div>


                    <div class="detail-item">

                        <span>
                            Report Type
                        </span>

                        <strong>
                            ${escapeHTML(
                                report.report_type || "--"
                            )}
                        </strong>

                    </div>


                    <div class="detail-item">

                        <span>
                            Patient
                        </span>

                        <strong>
                            ${escapeHTML(
                                report.patient_name ||
                                "--"
                            )}
                        </strong>

                    </div>


                    <div class="detail-item">

                        <span>
                            Patient ID
                        </span>

                        <strong>
                            ${escapeHTML(
                                report.patient_id ||
                                "--"
                            )}
                        </strong>

                    </div>


                    <div class="detail-item">

                        <span>
                            Doctor
                        </span>

                        <strong>
                            ${escapeHTML(
                                report.doctor ||
                                "Not Assigned"
                            )}
                        </strong>

                    </div>


                    <div class="detail-item">

                        <span>
                            Report Date
                        </span>

                        <strong>
                            ${formatDate(
                                report.report_date
                            )}
                        </strong>

                    </div>


                    <div class="detail-item">

                        <span>
                            Status
                        </span>

                        <strong>
                            ${escapeHTML(
                                report.status ||
                                "Pending"
                            )}
                        </strong>

                    </div>


                    <div class="detail-item">

                        <span>
                            Uploaded By
                        </span>

                        <strong>
                            ${escapeHTML(
                                report.uploaded_by ||
                                "Hospital"
                            )}
                        </strong>

                    </div>


                </div>


                <div class="report-description">

                    <span>
                        Report Description
                    </span>

                    <p>

                        ${escapeHTML(
                            report.description ||
                            "No report description available."
                        )}

                    </p>

                </div>

            `;

        }


        reportModal.classList.add("show");


        document.body.style.overflow =
            "hidden";

    }


    // =====================================================
    // CLOSE MODAL
    // =====================================================

    function closeModal() {


        if (!reportModal) {

            return;

        }


        reportModal.classList.remove(
            "show"
        );


        document.body.style.overflow =
            "";


        selectedReportId = null;

    }


    if (closeReportModal) {

        closeReportModal.addEventListener(
            "click",
            closeModal
        );

    }


    if (closeReportBtn) {

        closeReportBtn.addEventListener(
            "click",
            closeModal
        );

    }


    if (reportModal) {

        reportModal.addEventListener(
            "click",
            function (event) {


                if (
                    event.target === reportModal
                ) {

                    closeModal();

                }

            }
        );

    }


    // =====================================================
    // DOWNLOAD REPORT
    // =====================================================

    function downloadReport(id) {


        const report =
            reports.find(function (item) {

                return String(item.id) ===
                    String(id);

            });


        if (!report) {

            return;

        }


        /*
            Later Django will provide
            the actual PDF file.

            Example:

            window.open(
                `/api/hospital/reports/${id}/download/`,
                "_blank"
            );
        */


        alert(
            "Report download will be connected through Django."
        );

    }


    if (downloadReportBtn) {

        downloadReportBtn.addEventListener(
            "click",
            function () {


                if (!selectedReportId) {

                    return;

                }


                downloadReport(
                    selectedReportId
                );

            }
        );

    }


    // =====================================================
    // NOTIFICATION
    // =====================================================

    if (notificationBtn) {

        notificationBtn.addEventListener(
            "click",
            function () {

                alert(
                    "Hospital notifications will appear here."
                );

            }
        );

    }


    // =====================================================
    // MOBILE SIDEBAR
    // =====================================================

    if (mobileMenuBtn) {

        mobileMenuBtn.addEventListener(
            "click",
            function () {


                if (sidebar) {

                    sidebar.classList.toggle(
                        "sidebar-open"
                    );

                }


                if (sidebarOverlay) {

                    sidebarOverlay.classList.toggle(
                        "active"
                    );

                }

            }
        );

    }


    if (sidebarOverlay) {

        sidebarOverlay.addEventListener(
            "click",
            closeMobileSidebar
        );

    }


    function closeMobileSidebar() {


        if (sidebar) {

            sidebar.classList.remove(
                "sidebar-open"
            );

        }


        if (sidebarOverlay) {

            sidebarOverlay.classList.remove(
                "active"
            );

        }

    }


    // =====================================================
    // LOGOUT
    // =====================================================

    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            function (event) {


                event.preventDefault();


                const confirmed =
                    confirm(
                        "Are you sure you want to logout?"
                    );


                if (confirmed) {

                    window.location.href =
                        "hospital_login.html";

                }

            }
        );

    }


    // =====================================================
    // ESC KEY
    // =====================================================

    document.addEventListener(
        "keydown",
        function (event) {


            if (
                event.key === "Escape"
            ) {

                closeModal();

                closeMobileSidebar();

            }

        }
    );


    // =====================================================
    // DATE FORMATTER
    // =====================================================

    function formatDate(dateValue) {


        if (!dateValue) {

            return "--";

        }


        const date =
            new Date(dateValue);


        if (
            isNaN(
                date.getTime()
            )
        ) {

            return dateValue;

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


    // =====================================================
    // HTML SECURITY
    // =====================================================

    function escapeHTML(value) {


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


    // =====================================================
    // FUTURE DJANGO API
    // =====================================================

    /*
    
    async function fetchReportsFromBackend() {

        try {

            const response =
                await fetch(
                    "/api/hospital/reports/"
                );


            if (!response.ok) {

                throw new Error(
                    "Failed to fetch reports"
                );

            }


            const data =
                await response.json();


            reports =
                data.reports || [];


            renderReports(
                reports
            );


            updateStatistics(
                reports
            );


        } catch (error) {

            console.error(
                "Reports API error:",
                error
            );


            reports = [];


            renderReports([]);

            updateStatistics([]);

        }

    }

    */


});