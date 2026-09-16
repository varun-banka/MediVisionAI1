// =========================================================
// MEDVISIONAI - HOSPITAL PATIENTS JS
// =========================================================
// Works directly with the hospital_patients.html + CSS
// provided above.
//
const PATIENTS_API = "/api/hospital/patients/";
// =========================================================

document.addEventListener("DOMContentLoaded", function () {

    // =====================================================
    // ELEMENTS
    // =====================================================

    const addPatientBtn =
        document.getElementById("addPatientBtn");

    const emptyAddPatientBtn =
        document.getElementById("emptyAddPatientBtn");

    const patientModal =
        document.getElementById("patientModal");

    const closePatientModal =
        document.getElementById("closePatientModal");

    const cancelPatientBtn =
        document.getElementById("cancelPatientBtn");

    const patientForm =
        document.getElementById("patientForm");

    const patientsTableBody =
        document.getElementById("patientsTableBody");

    const emptyState =
        document.getElementById("emptyState");

    const patientSearch =
        document.getElementById("patientSearch");

    const genderFilter =
        document.getElementById("genderFilter");

    const statusFilter =
        document.getElementById("statusFilter");

    const totalPatients =
        document.getElementById("totalPatients");

    const activePatients =
        document.getElementById("activePatients");

    const malePatients =
        document.getElementById("malePatients");

    const femalePatients =
        document.getElementById("femalePatients");

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
    // PATIENT DATA
    // =====================================================

    // No dummy patients.
    // New patients added through the form will appear here.

    let patients = [];


    // =====================================================
    // INITIALIZE
    // =====================================================

    initializePage();


    async function initializePage() {

        await fetchPatientsFromBackend();

        renderPatients(patients);

        updateStatistics(patients);

    }


    // =====================================================
    // OPEN ADD PATIENT MODAL
    // =====================================================

    function openAddPatientModal() {

        if (!patientModal) {
            console.error("patientModal not found");
            return;
        }

        patientModal.classList.add("active");

        document.body.style.overflow = "hidden";

    }


    // =====================================================
    // ADD PATIENT BUTTON
    // =====================================================

    if (addPatientBtn) {

        addPatientBtn.addEventListener(
            "click",
            function () {

                openAddPatientModal();

            }
        );

    }


    // =====================================================
    // EMPTY STATE ADD PATIENT BUTTON
    // =====================================================

    if (emptyAddPatientBtn) {

        emptyAddPatientBtn.addEventListener(
            "click",
            function () {

                openAddPatientModal();

            }
        );

    }


    // =====================================================
    // CLOSE MODAL
    // =====================================================

    function closePatientModalFunction() {

        if (!patientModal) {
            return;
        }

        patientModal.classList.remove("active");

        document.body.style.overflow = "";

    }


    // =====================================================
    // CLOSE BUTTON
    // =====================================================

    if (closePatientModal) {

        closePatientModal.addEventListener(
            "click",
            closePatientModalFunction
        );

    }


    // =====================================================
    // CANCEL BUTTON
    // =====================================================

    if (cancelPatientBtn) {

        cancelPatientBtn.addEventListener(
            "click",
            closePatientModalFunction
        );

    }


    // =====================================================
    // CLICK OUTSIDE MODAL
    // =====================================================

    if (patientModal) {

        patientModal.addEventListener(
            "click",
            async function (event) {

                if (
                    event.target === patientModal
                ) {

                    closePatientModalFunction();

                }

            }
        );

    }


    // =====================================================
    // ADD PATIENT FORM SUBMIT
    // =====================================================

    if (patientForm) {

        patientForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                // =============================================
                // GET FORM VALUES
                // =============================================

                const patientName =
                    document.getElementById(
                        "patientName"
                    ).value.trim();


                const patientEmail =
                    document.getElementById(
                        "patientEmail"
                    ).value.trim();


                const patientPhone =
                    document.getElementById(
                        "patientPhone"
                    ).value.trim();


                const patientDob =
                    document.getElementById(
                        "patientDob"
                    ).value;


                const patientGender =
                    document.getElementById(
                        "patientGender"
                    ).value;


                const patientBloodGroup =
                    document.getElementById(
                        "patientBloodGroup"
                    ).value;


                const patientAddress =
                    document.getElementById(
                        "patientAddress"
                    ).value.trim();


                // =============================================
                // VALIDATION
                // =============================================

                if (
                    !patientName ||
                    !patientEmail ||
                    !patientPhone ||
                    !patientDob ||
                    !patientGender
                ) {

                    alert(
                        "Please fill all required fields."
                    );

                    return;

                }


                // =============================================
                // CALCULATE AGE
                // =============================================

                const age =
                    calculateAge(
                        patientDob
                    );


                const response = await fetch(
                    PATIENTS_API,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        credentials: "include",
                        body: JSON.stringify({
                            name: patientName,
                            email: patientEmail,
                            phone: patientPhone,
                            dob: patientDob,
                            age: age,
                            gender: patientGender,
                            blood_group: patientBloodGroup,
                            address: patientAddress,
                            doctor: "Not Assigned",
                            status: "Active"
                        })
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.detail ||
                        Object.values(data).flat().join(" ") ||
                        "Unable to add patient."
                    );
                }

                patients.push(data);


                // =============================================
                // UPDATE TABLE
                // =============================================

                renderPatients(
                    patients
                );


                // =============================================
                // UPDATE STATISTICS
                // =============================================

                updateStatistics(
                    patients
                );


                // =============================================
                // SUCCESS
                // =============================================

                alert("Patient added successfully!");


                // =============================================
                // RESET FORM
                // =============================================

                patientForm.reset();


                // =============================================
                // CLOSE MODAL
                // =============================================

                closePatientModalFunction();

            }
        );

    }


    async function fetchPatientsFromBackend() {

        try {

            const response = await fetch(
                PATIENTS_API,
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            if (!response.ok) {
                return;
            }

            patients = await response.json();

        } catch (error) {

            console.error("Patient API error:", error);

        }

    }


    // =====================================================
    // CALCULATE AGE
    // =====================================================

    function calculateAge(dateOfBirth) {

        const birthDate =
            new Date(dateOfBirth);

        const today =
            new Date();

        let age =
            today.getFullYear() -
            birthDate.getFullYear();

        const monthDifference =
            today.getMonth() -
            birthDate.getMonth();


        if (
            monthDifference < 0 ||
            (
                monthDifference === 0 &&
                today.getDate() < birthDate.getDate()
            )
        ) {

            age--;

        }


        return age;

    }


    // =====================================================
    // RENDER PATIENTS
    // =====================================================

    function renderPatients(data) {

        if (!patientsTableBody) {
            return;
        }


        patientsTableBody.innerHTML = "";


        // =============================================
        // EMPTY STATE
        // =============================================

        if (!data || data.length === 0) {

            patientsTableBody.style.display =
                "none";


            if (emptyState) {

                emptyState.style.display =
                    "flex";

            }

            return;

        }


        // =============================================
        // SHOW TABLE
        // =============================================

        patientsTableBody.style.display =
            "table-row-group";


        if (emptyState) {

            emptyState.style.display =
                "none";

        }


        // =============================================
        // CREATE ROWS
        // =============================================

        data.forEach(function (patient) {

            const row =
                document.createElement("tr");


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
                                patient.name
                            )}
                        </strong>

                        <small>
                            ${escapeHTML(
                                patient.patient_id
                            )}
                        </small>

                    </div>

                </div>

            `;


            // =================================================
            // CONTACT
            // =================================================

            const contactCell =
                document.createElement("td");


            contactCell.innerHTML = `

                <div class="contact-cell">

                    <span>
                        ${escapeHTML(
                            patient.phone
                        )}
                    </span>

                    <small>
                        ${escapeHTML(
                            patient.email
                        )}
                    </small>

                </div>

            `;


            // =================================================
            // GENDER
            // =================================================

            const genderCell =
                document.createElement("td");


            genderCell.textContent =
                patient.gender || "--";


            // =================================================
            // AGE
            // =================================================

            const ageCell =
                document.createElement("td");


            ageCell.textContent =
                patient.age ?? "--";


            // =================================================
            // STATUS
            // =================================================

            const statusCell =
                document.createElement("td");


            const status =
                String(
                    patient.status || "Inactive"
                ).toLowerCase();


            if (status === "active") {

                statusCell.innerHTML = `

                    <span class="status-badge status-active">
                        Active
                    </span>

                `;

            } else {

                statusCell.innerHTML = `

                    <span class="status-badge status-inactive">
                        Inactive
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
                        title="View Patient"
                        data-action="view"
                        data-id="${patient.id}"
                        type="button"
                    >

                        <i class="bi bi-eye-fill"></i>

                    </button>


                    <button
                        class="action-btn delete-btn"
                        title="Delete Patient"
                        data-action="delete"
                        data-id="${patient.id}"
                        type="button"
                    >

                        <i class="bi bi-trash-fill"></i>

                    </button>

                </div>

            `;


            // =================================================
            // APPEND CELLS
            // =================================================

            row.appendChild(
                patientCell
            );

            row.appendChild(
                contactCell
            );

            row.appendChild(
                genderCell
            );

            row.appendChild(
                ageCell
            );

            row.appendChild(
                statusCell
            );

            row.appendChild(
                actionCell
            );


            patientsTableBody.appendChild(
                row
            );

        });

    }


    // =====================================================
    // UPDATE STATISTICS
    // =====================================================

    function updateStatistics(data) {

        // =============================================
        // TOTAL PATIENTS
        // =============================================

        if (totalPatients) {

            totalPatients.textContent =
                data.length;

        }


        // =============================================
        // ACTIVE PATIENTS
        // =============================================

        const activeCount =
            data.filter(function (patient) {

                return String(
                    patient.status
                ).toLowerCase() === "active";

            }).length;


        if (activePatients) {

            activePatients.textContent =
                activeCount;

        }


        // =============================================
        // MALE PATIENTS
        // =============================================

        const maleCount =
            data.filter(function (patient) {

                return String(
                    patient.gender
                ).toLowerCase() === "male";

            }).length;


        if (malePatients) {

            malePatients.textContent =
                maleCount;

        }


        // =============================================
        // FEMALE PATIENTS
        // =============================================

        const femaleCount =
            data.filter(function (patient) {

                return String(
                    patient.gender
                ).toLowerCase() === "female";

            }).length;


        if (femalePatients) {

            femalePatients.textContent =
                femaleCount;

        }

    }


    // =====================================================
    // SEARCH
    // =====================================================

    if (patientSearch) {

        patientSearch.addEventListener(
            "input",
            applyFilters
        );

    }


    // =====================================================
    // GENDER FILTER
    // =====================================================

    if (genderFilter) {

        genderFilter.addEventListener(
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
    // SEARCH + FILTER FUNCTION
    // =====================================================

    function applyFilters() {

        const searchText =
            (
                patientSearch?.value || ""
            )
            .toLowerCase()
            .trim();


        const selectedGender =
            (
                genderFilter?.value || "all"
            )
            .toLowerCase();


        const selectedStatus =
            (
                statusFilter?.value || "all"
            )
            .toLowerCase();


        const filteredPatients =
            patients.filter(
                function (patient) {


                    // =====================================
                    // SEARCH
                    // =====================================

                    const name =
                        String(
                            patient.name || ""
                        ).toLowerCase();


                    const email =
                        String(
                            patient.email || ""
                        ).toLowerCase();


                    const phone =
                        String(
                            patient.phone || ""
                        ).toLowerCase();


                    const patientId =
                        String(
                            patient.patient_id || ""
                        ).toLowerCase();


                    const matchesSearch =

                        name.includes(
                            searchText
                        ) ||

                        email.includes(
                            searchText
                        ) ||

                        phone.includes(
                            searchText
                        ) ||

                        patientId.includes(
                            searchText
                        );


                    // =====================================
                    // GENDER
                    // =====================================

                    const patientGender =
                        String(
                            patient.gender || ""
                        ).toLowerCase();


                    const matchesGender =

                        selectedGender === "all" ||

                        patientGender ===
                        selectedGender;


                    // =====================================
                    // STATUS
                    // =====================================

                    const patientStatus =
                        String(
                            patient.status || ""
                        ).toLowerCase();


                    const matchesStatus =

                        selectedStatus === "all" ||

                        patientStatus ===
                        selectedStatus;


                    return (

                        matchesSearch &&

                        matchesGender &&

                        matchesStatus

                    );

                }
            );


        renderPatients(
            filteredPatients
        );

    }


    // =====================================================
    // TABLE ACTIONS
    // =====================================================

    if (patientsTableBody) {

        patientsTableBody.addEventListener(
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


                const patientId =
                    button.dataset.id;


                // =========================================
                // VIEW
                // =========================================

                if (
                    action === "view"
                ) {

                    viewPatient(
                        patientId
                    );

                }


                // =========================================
                // DELETE
                // =========================================

                if (
                    action === "delete"
                ) {

                    deletePatient(
                        patientId
                    );

                }

            }
        );

    }


    // =====================================================
    // VIEW PATIENT
    // =====================================================

    function viewPatient(id) {

        const patient =
            patients.find(
                function (item) {

                    return String(
                        item.id
                    ) === String(id);

                }
            );


        if (!patient) {
            return;
        }


        alert(

            "Patient Details\n\n" +

            "Name: " +
            patient.name +

            "\nPatient ID: " +
            patient.patient_id +

            "\nEmail: " +
            patient.email +

            "\nPhone: " +
            patient.phone +

            "\nAge: " +
            patient.age +

            "\nGender: " +
            patient.gender +

            "\nBlood Group: " +
            (
                patient.blood_group ||
                "Not provided"
            ) +

            "\nStatus: " +
            patient.status

        );

    }


    // =====================================================
    // DELETE PATIENT
    // =====================================================

    function deletePatient(id) {

        const patient =
            patients.find(
                function (item) {

                    return String(
                        item.id
                    ) === String(id);

                }
            );


        if (!patient) {
            return;
        }


        const confirmed =
            confirm(
                "Are you sure you want to delete " +
                patient.name +
                "?"
            );


        if (!confirmed) {
            return;
        }


        patients =
            patients.filter(
                function (item) {

                    return String(
                        item.id
                    ) !== String(id);

                }
            );


        renderPatients(
            patients
        );


        updateStatistics(
            patients
        );


        alert(
            "Patient deleted successfully."
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
    // MOBILE MENU
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
    // CLOSE MOBILE SIDEBAR
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

                closePatientModalFunction();

                closeMobileSidebar();

            }

        }
    );


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
    
    Later, when Django backend is ready:

    async function fetchPatientsFromBackend() {

        try {

            const response =
                await fetch(
                    "/api/hospital/patients/"
                );


            if (!response.ok) {

                throw new Error(
                    "Failed to fetch patients"
                );

            }


            const data =
                await response.json();


            patients =
                data.patients || [];


            renderPatients(
                patients
            );


            updateStatistics(
                patients
            );


        } catch (error) {

            console.error(
                "Patient API error:",
                error
            );

        }

    }

    */

});