// =========================================================
// MEDVISIONAI - HOSPITAL APPOINTMENTS JS
// =========================================================

document.addEventListener("DOMContentLoaded", function () {


    // =====================================================
    // ELEMENTS
    // =====================================================

    const addAppointmentBtn =
        document.getElementById(
            "addAppointmentBtn"
        );


    const emptyAddAppointmentBtn =
        document.getElementById(
            "emptyAddAppointmentBtn"
        );


    const appointmentModal =
        document.getElementById(
            "appointmentModal"
        );


    const closeAppointmentModal =
        document.getElementById(
            "closeAppointmentModal"
        );


    const cancelAppointmentBtn =
        document.getElementById(
            "cancelAppointmentBtn"
        );


    const appointmentForm =
        document.getElementById(
            "appointmentForm"
        );


    const appointmentsTableBody =
        document.getElementById(
            "appointmentsTableBody"
        );


    const emptyState =
        document.getElementById(
            "emptyState"
        );


    const appointmentSearch =
        document.getElementById(
            "appointmentSearch"
        );


    const appointmentDateFilter =
        document.getElementById(
            "appointmentDateFilter"
        );


    const statusFilter =
        document.getElementById(
            "statusFilter"
        );


    const totalAppointments =
        document.getElementById(
            "totalAppointments"
        );


    const todayAppointments =
        document.getElementById(
            "todayAppointments"
        );


    const completedAppointments =
        document.getElementById(
            "completedAppointments"
        );


    const pendingAppointments =
        document.getElementById(
            "pendingAppointments"
        );


    const notificationBtn =
        document.getElementById(
            "notificationBtn"
        );


    const mobileMenuBtn =
        document.getElementById(
            "mobileMenuBtn"
        );


    const sidebar =
        document.getElementById(
            "sidebar"
        );


    const sidebarOverlay =
        document.getElementById(
            "sidebarOverlay"
        );


    const logoutBtn =
        document.getElementById(
            "logoutBtn"
        );



    // =====================================================
    // APPOINTMENT DATA
    // =====================================================

    /*
        Empty initially.

        Later Django/PostgreSQL will provide
        real appointment data.
    */

    let appointments = [];



    // =====================================================
    // INITIALIZE
    // =====================================================

    initializePage();


    function initializePage() {

        renderAppointments(
            appointments
        );


        updateStatistics(
            appointments
        );

    }



    // =====================================================
    // OPEN ADD APPOINTMENT MODAL
    // =====================================================

    function openAppointmentModal() {

        if (!appointmentModal) {

            console.error(
                "appointmentModal not found"
            );

            return;

        }


        appointmentModal.classList.add(
            "active"
        );


        document.body.style.overflow =
            "hidden";

    }



    // =====================================================
    // ADD APPOINTMENT BUTTON
    // =====================================================

    if (addAppointmentBtn) {

        addAppointmentBtn.addEventListener(
            "click",
            function () {

                openAppointmentModal();

            }
        );

    }



    // =====================================================
    // EMPTY STATE ADD BUTTON
    // =====================================================

    if (emptyAddAppointmentBtn) {

        emptyAddAppointmentBtn.addEventListener(
            "click",
            function () {

                openAppointmentModal();

            }
        );

    }



    // =====================================================
    // CLOSE MODAL
    // =====================================================

    function closeAppointmentModalFunction() {

        if (!appointmentModal) {
            return;
        }


        appointmentModal.classList.remove(
            "active"
        );


        document.body.style.overflow =
            "";

    }



    // =====================================================
    // CLOSE X
    // =====================================================

    if (closeAppointmentModal) {

        closeAppointmentModal.addEventListener(
            "click",
            closeAppointmentModalFunction
        );

    }



    // =====================================================
    // CANCEL
    // =====================================================

    if (cancelAppointmentBtn) {

        cancelAppointmentBtn.addEventListener(
            "click",
            closeAppointmentModalFunction
        );

    }



    // =====================================================
    // CLICK OUTSIDE MODAL
    // =====================================================

    if (appointmentModal) {

        appointmentModal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    appointmentModal
                ) {

                    closeAppointmentModalFunction();

                }

            }
        );

    }



    // =====================================================
    // FORM SUBMIT
    // =====================================================

    if (appointmentForm) {

        appointmentForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                // =========================================
                // GET VALUES
                // =========================================

                const patient =
                    document.getElementById(
                        "appointmentPatient"
                    ).value.trim();


                const doctor =
                    document.getElementById(
                        "appointmentDoctor"
                    ).value.trim();


                const date =
                    document.getElementById(
                        "appointmentDate"
                    ).value;


                const time =
                    document.getElementById(
                        "appointmentTime"
                    ).value;


                const type =
                    document.getElementById(
                        "appointmentType"
                    ).value;


                const status =
                    document.getElementById(
                        "appointmentStatus"
                    ).value;


                const notes =
                    document.getElementById(
                        "appointmentNotes"
                    ).value.trim();



                // =========================================
                // VALIDATION
                // =========================================

                if (
                    !patient ||
                    !doctor ||
                    !date ||
                    !time ||
                    !type ||
                    !status
                ) {

                    alert(
                        "Please fill all required fields."
                    );

                    return;

                }



                // =========================================
                // APPOINTMENT ID
                // =========================================

                const appointmentNumber =
                    appointments.length + 1;


                const appointmentId =
                    "APT" +
                    String(
                        appointmentNumber
                    ).padStart(
                        3,
                        "0"
                    );



                // =========================================
                // CREATE OBJECT
                // =========================================

                const newAppointment = {

                    id:
                        Date.now(),

                    appointment_id:
                        appointmentId,

                    patient:
                        patient,

                    doctor:
                        doctor,

                    date:
                        date,

                    time:
                        time,

                    type:
                        type,

                    status:
                        status,

                    notes:
                        notes

                };



                // =========================================
                // ADD
                // =========================================

                appointments.push(
                    newAppointment
                );



                // =========================================
                // UPDATE TABLE
                // =========================================

                renderAppointments(
                    appointments
                );



                // =========================================
                // UPDATE STATISTICS
                // =========================================

                updateStatistics(
                    appointments
                );



                // =========================================
                // SUCCESS
                // =========================================

                alert(
                    "Appointment added successfully!"
                );



                // =========================================
                // RESET
                // =========================================

                appointmentForm.reset();



                // =========================================
                // CLOSE
                // =========================================

                closeAppointmentModalFunction();

            }
        );

    }



    // =====================================================
    // RENDER APPOINTMENTS
    // =====================================================

    function renderAppointments(data) {

        if (!appointmentsTableBody) {
            return;
        }


        appointmentsTableBody.innerHTML =
            "";



        // =========================================
        // EMPTY
        // =========================================

        if (
            !data ||
            data.length === 0
        ) {

            appointmentsTableBody.style.display =
                "none";


            if (emptyState) {

                emptyState.style.display =
                    "flex";

            }

            return;

        }



        // =========================================
        // SHOW TABLE
        // =========================================

        appointmentsTableBody.style.display =
            "table-row-group";


        if (emptyState) {

            emptyState.style.display =
                "none";

        }



        // =========================================
        // CREATE ROWS
        // =========================================

        data.forEach(
            function (appointment) {

                const row =
                    document.createElement(
                        "tr"
                    );



                // =====================================
                // APPOINTMENT
                // =====================================

                const appointmentCell =
                    document.createElement(
                        "td"
                    );


                appointmentCell.innerHTML = `

                    <div class="appointment-cell">

                        <div class="appointment-icon">

                            <i class="bi bi-calendar-event-fill"></i>

                        </div>

                        <div class="appointment-info">

                            <strong>
                                ${escapeHTML(
                                    appointment.type
                                )}
                            </strong>

                            <small>
                                ${escapeHTML(
                                    appointment.appointment_id
                                )}
                            </small>

                        </div>

                    </div>

                `;



                // =====================================
                // PATIENT
                // =====================================

                const patientCell =
                    document.createElement(
                        "td"
                    );


                patientCell.innerHTML = `

                    <div class="patient-table-cell">

                        <strong>
                            ${escapeHTML(
                                appointment.patient
                            )}
                        </strong>

                        <small>
                            Patient
                        </small>

                    </div>

                `;



                // =====================================
                // DOCTOR
                // =====================================

                const doctorCell =
                    document.createElement(
                        "td"
                    );


                doctorCell.innerHTML = `

                    <div class="doctor-table-cell">

                        <strong>
                            ${escapeHTML(
                                appointment.doctor
                            )}
                        </strong>

                        <small>
                            Doctor
                        </small>

                    </div>

                `;



                // =====================================
                // DATE
                // =====================================

                const dateCell =
                    document.createElement(
                        "td"
                    );


                dateCell.textContent =
                    formatDate(
                        appointment.date
                    );



                // =====================================
                // TIME
                // =====================================

                const timeCell =
                    document.createElement(
                        "td"
                    );


                timeCell.textContent =
                    formatTime(
                        appointment.time
                    );



                // =====================================
                // STATUS
                // =====================================

                const statusCell =
                    document.createElement(
                        "td"
                    );


                const status =
                    String(
                        appointment.status ||
                        "Scheduled"
                    ).toLowerCase();


                if (
                    status === "scheduled"
                ) {

                    statusCell.innerHTML = `

                        <span class="status-badge status-scheduled">
                            Scheduled
                        </span>

                    `;

                }


                else if (
                    status === "completed"
                ) {

                    statusCell.innerHTML = `

                        <span class="status-badge status-completed">
                            Completed
                        </span>

                    `;

                }


                else {

                    statusCell.innerHTML = `

                        <span class="status-badge status-cancelled">
                            Cancelled
                        </span>

                    `;

                }



                // =====================================
                // ACTIONS
                // =====================================

                const actionCell =
                    document.createElement(
                        "td"
                    );


                actionCell.innerHTML = `

                    <div class="action-buttons">

                        <button
                            class="action-btn view-btn"
                            type="button"
                            title="View Appointment"
                            data-action="view"
                            data-id="${appointment.id}"
                        >

                            <i class="bi bi-eye-fill"></i>

                        </button>


                        ${
                            status === "scheduled"
                            ? `
                                <button
                                    class="action-btn complete-btn"
                                    type="button"
                                    title="Complete Appointment"
                                    data-action="complete"
                                    data-id="${appointment.id}"
                                >

                                    <i class="bi bi-check-lg"></i>

                                </button>


                                <button
                                    class="action-btn cancel-btn-small"
                                    type="button"
                                    title="Cancel Appointment"
                                    data-action="cancel"
                                    data-id="${appointment.id}"
                                >

                                    <i class="bi bi-x-lg"></i>

                                </button>
                            `
                            : ""
                        }

                    </div>

                `;



                // =====================================
                // APPEND
                // =====================================

                row.appendChild(
                    appointmentCell
                );

                row.appendChild(
                    patientCell
                );

                row.appendChild(
                    doctorCell
                );

                row.appendChild(
                    dateCell
                );

                row.appendChild(
                    timeCell
                );

                row.appendChild(
                    statusCell
                );

                row.appendChild(
                    actionCell
                );


                appointmentsTableBody.appendChild(
                    row
                );

            }
        );

    }



    // =====================================================
    // STATISTICS
    // =====================================================

    function updateStatistics(data) {

        // =========================================
        // TOTAL
        // =========================================

        if (totalAppointments) {

            totalAppointments.textContent =
                data.length;

        }



        // =========================================
        // TODAY
        // =========================================

        const today =
            getTodayDate();


        const todayCount =
            data.filter(
                function (appointment) {

                    return (
                        appointment.date ===
                        today
                    );

                }
            ).length;


        if (todayAppointments) {

            todayAppointments.textContent =
                todayCount;

        }



        // =========================================
        // COMPLETED
        // =========================================

        const completedCount =
            data.filter(
                function (appointment) {

                    return (
                        String(
                            appointment.status
                        ).toLowerCase() ===
                        "completed"
                    );

                }
            ).length;


        if (completedAppointments) {

            completedAppointments.textContent =
                completedCount;

        }



        // =========================================
        // PENDING
        // =========================================

        const pendingCount =
            data.filter(
                function (appointment) {

                    return (
                        String(
                            appointment.status
                        ).toLowerCase() ===
                        "scheduled"
                    );

                }
            ).length;


        if (pendingAppointments) {

            pendingAppointments.textContent =
                pendingCount;

        }

    }



    // =====================================================
    // SEARCH
    // =====================================================

    if (appointmentSearch) {

        appointmentSearch.addEventListener(
            "input",
            applyFilters
        );

    }



    // =====================================================
    // DATE FILTER
    // =====================================================

    if (appointmentDateFilter) {

        appointmentDateFilter.addEventListener(
            "change",
            applyFilters
        );

    }



    // =====================================================
    // STATUS FILTER
    // =====================================================

    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            applyFilters
        );

    }



    // =====================================================
    // FILTER FUNCTION
    // =====================================================

    function applyFilters() {

        const searchText =
            (
                appointmentSearch?.value ||
                ""
            )
            .toLowerCase()
            .trim();


        const selectedDate =
            appointmentDateFilter?.value ||
            "";


        const selectedStatus =
            (
                statusFilter?.value ||
                "all"
            )
            .toLowerCase();



        const filtered =
            appointments.filter(
                function (appointment) {


                    // =====================================
                    // SEARCH
                    // =====================================

                    const patient =
                        String(
                            appointment.patient ||
                            ""
                        ).toLowerCase();


                    const doctor =
                        String(
                            appointment.doctor ||
                            ""
                        ).toLowerCase();


                    const appointmentId =
                        String(
                            appointment.appointment_id ||
                            ""
                        ).toLowerCase();


                    const type =
                        String(
                            appointment.type ||
                            ""
                        ).toLowerCase();


                    const matchesSearch =

                        patient.includes(
                            searchText
                        ) ||

                        doctor.includes(
                            searchText
                        ) ||

                        appointmentId.includes(
                            searchText
                        ) ||

                        type.includes(
                            searchText
                        );



                    // =====================================
                    // DATE
                    // =====================================

                    const matchesDate =

                        !selectedDate ||

                        appointment.date ===
                        selectedDate;



                    // =====================================
                    // STATUS
                    // =====================================

                    const appointmentStatus =
                        String(
                            appointment.status ||
                            ""
                        ).toLowerCase();


                    const matchesStatus =

                        selectedStatus ===
                        "all" ||

                        appointmentStatus ===
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



    // =====================================================
    // TABLE ACTIONS
    // =====================================================

    if (appointmentsTableBody) {

        appointmentsTableBody.addEventListener(
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


                const id =
                    button.dataset.id;



                // =========================================
                // VIEW
                // =========================================

                if (
                    action === "view"
                ) {

                    viewAppointment(
                        id
                    );

                }



                // =========================================
                // COMPLETE
                // =========================================

                if (
                    action === "complete"
                ) {

                    completeAppointment(
                        id
                    );

                }



                // =========================================
                // CANCEL
                // =========================================

                if (
                    action === "cancel"
                ) {

                    cancelAppointment(
                        id
                    );

                }

            }
        );

    }



    // =====================================================
    // VIEW APPOINTMENT
    // =====================================================

    function viewAppointment(id) {

        const appointment =
            appointments.find(
                function (item) {

                    return String(
                        item.id
                    ) === String(id);

                }
            );


        if (!appointment) {
            return;
        }


        alert(

            "Appointment Details\n\n" +

            "Appointment ID: " +
            appointment.appointment_id +

            "\nPatient: " +
            appointment.patient +

            "\nDoctor: " +
            appointment.doctor +

            "\nDate: " +
            formatDate(
                appointment.date
            ) +

            "\nTime: " +
            formatTime(
                appointment.time
            ) +

            "\nType: " +
            appointment.type +

            "\nStatus: " +
            appointment.status +

            "\nNotes: " +
            (
                appointment.notes ||
                "No notes"
            )

        );

    }



    // =====================================================
    // COMPLETE APPOINTMENT
    // =====================================================

    function completeAppointment(id) {

        const appointment =
            appointments.find(
                function (item) {

                    return String(
                        item.id
                    ) === String(id);

                }
            );


        if (!appointment) {
            return;
        }


        const confirmed =
            confirm(
                "Mark this appointment as completed?"
            );


        if (!confirmed) {
            return;
        }


        appointment.status =
            "Completed";


        renderAppointments(
            appointments
        );


        updateStatistics(
            appointments
        );


        alert(
            "Appointment marked as completed."
        );

    }



    // =====================================================
    // CANCEL APPOINTMENT
    // =====================================================

    function cancelAppointment(id) {

        const appointment =
            appointments.find(
                function (item) {

                    return String(
                        item.id
                    ) === String(id);

                }
            );


        if (!appointment) {
            return;
        }


        const confirmed =
            confirm(
                "Are you sure you want to cancel this appointment?"
            );


        if (!confirmed) {
            return;
        }


        appointment.status =
            "Cancelled";


        renderAppointments(
            appointments
        );


        updateStatistics(
            appointments
        );


        alert(
            "Appointment cancelled."
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



    // =====================================================
    // SIDEBAR OVERLAY
    // =====================================================

    if (sidebarOverlay) {

        sidebarOverlay.addEventListener(
            "click",
            closeMobileSidebar
        );

    }



    // =====================================================
    // CLOSE SIDEBAR
    // =====================================================

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

                closeAppointmentModalFunction();

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
            new Date(
                dateValue + "T00:00:00"
            );


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
    // TIME FORMATTER
    // =====================================================

    function formatTime(timeValue) {

        if (!timeValue) {
            return "--";
        }


        const parts =
            timeValue.split(":");


        if (parts.length < 2) {
            return timeValue;
        }


        let hour =
            parseInt(
                parts[0],
                10
            );


        const minute =
            parts[1];


        const period =
            hour >= 12
                ? "PM"
                : "AM";


        hour =
            hour % 12 ||
            12;


        return (
            hour +
            ":" +
            minute +
            " " +
            period
        );

    }



    // =====================================================
    // TODAY
    // =====================================================

    function getTodayDate() {

        const today =
            new Date();


        const year =
            today.getFullYear();


        const month =
            String(
                today.getMonth() + 1
            ).padStart(
                2,
                "0"
            );


        const day =
            String(
                today.getDate()
            ).padStart(
                2,
                "0"
            );


        return (
            year +
            "-" +
            month +
            "-" +
            day
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
    
    Later we will replace the frontend array
    with Django API data.

    Example:

    async function fetchAppointmentsFromBackend() {

        const response =
            await fetch(
                "/api/hospital/appointments/"
            );


        const data =
            await response.json();


        appointments =
            data.appointments || [];


        renderAppointments(
            appointments
        );


        updateStatistics(
            appointments
        );

    }

    */

});