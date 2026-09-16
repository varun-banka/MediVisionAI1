// =========================================================
// MEDVISIONAI - HOSPITAL DOCTORS JS
// =========================================================

document.addEventListener("DOMContentLoaded", function () {

    // =====================================================
    // ELEMENTS
    // =====================================================

    const sidebar =
        document.getElementById("sidebar");

    const mobileMenuBtn =
        document.getElementById("mobileMenuBtn");

    const sidebarOverlay =
        document.getElementById("sidebarOverlay");

    const notificationBtn =
        document.getElementById("notificationBtn");

    const notificationDot =
        document.getElementById("notificationDot");

    const addDoctorBtn =
        document.getElementById("addDoctorBtn");

    const emptyAddDoctorBtn =
        document.getElementById("emptyAddDoctorBtn");

    const doctorModal =
        document.getElementById("doctorModal");

    const closeDoctorModal =
        document.getElementById("closeDoctorModal");

    const cancelDoctorBtn =
        document.getElementById("cancelDoctorBtn");

    const doctorForm =
        document.getElementById("doctorForm");

    const searchInput =
        document.getElementById("doctorSearch");

    const departmentFilter =
        document.getElementById("departmentFilter");


    // =====================================================
    // MOBILE SIDEBAR
    // =====================================================

    if (mobileMenuBtn) {

        mobileMenuBtn.addEventListener(
            "click",
            function () {

                sidebar.classList.toggle(
                    "sidebar-open"
                );

                sidebarOverlay.classList.toggle(
                    "active"
                );

            }
        );

    }


    // =====================================================
    // CLOSE SIDEBAR
    // =====================================================

    if (sidebarOverlay) {

        sidebarOverlay.addEventListener(
            "click",
            function () {

                sidebar.classList.remove(
                    "sidebar-open"
                );

                sidebarOverlay.classList.remove(
                    "active"
                );

            }
        );

    }


    // =====================================================
    // SIDEBAR LINKS
    // =====================================================

    const sidebarLinks =
        document.querySelectorAll(
            ".sidebar-menu a"
        );

    sidebarLinks.forEach(function (link) {

        link.addEventListener(
            "click",
            function () {

                if (window.innerWidth <= 992) {

                    sidebar.classList.remove(
                        "sidebar-open"
                    );

                    sidebarOverlay.classList.remove(
                        "active"
                    );

                }

            }
        );

    });


    // =====================================================
    // OPEN ADD DOCTOR MODAL
    // =====================================================

    if (addDoctorBtn) {

        addDoctorBtn.addEventListener(
            "click",
            openAddDoctorForm
        );

    }


    if (emptyAddDoctorBtn) {

        emptyAddDoctorBtn.addEventListener(
            "click",
            openAddDoctorForm
        );

    }


    // =====================================================
    // CLOSE MODAL
    // =====================================================

    if (closeDoctorModal) {

        closeDoctorModal.addEventListener(
            "click",
            closeAddDoctorForm
        );

    }


    if (cancelDoctorBtn) {

        cancelDoctorBtn.addEventListener(
            "click",
            closeAddDoctorForm
        );

    }


    // =====================================================
    // CLICK OUTSIDE MODAL
    // =====================================================

    if (doctorModal) {

        doctorModal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === doctorModal
                ) {

                    closeAddDoctorForm();

                }

            }
        );

    }


    // =====================================================
    // ESCAPE KEY
    // =====================================================

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                doctorModal.classList.contains(
                    "active"
                )
            ) {

                closeAddDoctorForm();

            }

        }
    );


    // =====================================================
    // DOCTOR FORM SUBMIT
    // =====================================================

    if (doctorForm) {

        doctorForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                saveDoctor();

            }
        );

    }


    // =====================================================
    // SEARCH
    // =====================================================

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterDoctors
        );

    }


    // =====================================================
    // DEPARTMENT FILTER
    // =====================================================

    if (departmentFilter) {

        departmentFilter.addEventListener(
            "change",
            filterDoctors
        );

    }


    // =====================================================
    // NOTIFICATION
    // =====================================================

    if (notificationBtn) {

        notificationBtn.addEventListener(
            "click",
            showNotificationMessage
        );

    }


    // =====================================================
    // LOAD INITIAL DATA
    // =====================================================

    loadDoctors();

    loadHospitalName();


    // =====================================================
    // RESPONSIVE
    // =====================================================

    window.addEventListener(
        "resize",
        function () {

            if (window.innerWidth > 992) {

                sidebar.classList.remove(
                    "sidebar-open"
                );

                sidebarOverlay.classList.remove(
                    "active"
                );

            }

        }
    );

});


// =========================================================
// OPEN ADD DOCTOR FORM
// =========================================================

function openAddDoctorForm() {

    const doctorModal =
        document.getElementById(
            "doctorModal"
        );

    const doctorForm =
        document.getElementById(
            "doctorForm"
        );


    if (!doctorModal) {
        return;
    }


    if (doctorForm) {

        doctorForm.reset();

    }


    doctorModal.classList.add(
        "active"
    );


    document.body.style.overflow =
        "hidden";


    const doctorName =
        document.getElementById(
            "doctorName"
        );


    if (doctorName) {

        setTimeout(
            function () {

                doctorName.focus();

            },
            200
        );

    }

}


// =========================================================
// CLOSE ADD DOCTOR FORM
// =========================================================

function closeAddDoctorForm() {

    const doctorModal =
        document.getElementById(
            "doctorModal"
        );


    if (!doctorModal) {
        return;
    }


    doctorModal.classList.remove(
        "active"
    );


    document.body.style.overflow =
        "";

}


// =========================================================
// SAVE DOCTOR
// =========================================================
//
// CURRENTLY:
//
// We collect the form data.
//
// Later:
//
// POST /api/hospital/doctors/
//
// =========================================================

async function saveDoctor() {

    const form =
        document.getElementById(
            "doctorForm"
        );


    if (!form) {
        return;
    }


    const formData =
        new FormData(form);


    const doctorData = {

        name:
            formData.get(
                "doctor_name"
            ),

        email:
            formData.get(
                "email"
            ),

        phone:
            formData.get(
                "phone"
            ),

        specialization:
            formData.get(
                "specialization"
            ),

        qualification:
            formData.get(
                "qualification"
            ),

        experience:
            formData.get(
                "experience"
            ),

        license_number:
            formData.get(
                "license_number"
            ),

        department:
            formData.get(
                "department"
            ),

        status:
            formData.get(
                "status"
            )

    };


    // =====================================================
    // BASIC VALIDATION
    // =====================================================

    if (
        !doctorData.name ||
        !doctorData.email ||
        !doctorData.phone ||
        !doctorData.specialization ||
        !doctorData.qualification ||
        !doctorData.experience ||
        !doctorData.license_number ||
        !doctorData.department
    ) {

        alert(
            "Please fill all required fields."
        );

        return;

    }


    const apiBase = window.location.port === "5500"
        ? `${window.location.protocol}//${window.location.hostname}:8000`
        : "";

    try {
        const response = await fetch(
            `${apiBase}/api/hospital/doctors/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(doctorData)
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Unable to save doctor."
            );
        }

        closeAddDoctorForm();
        await loadDoctors();
        alert("Doctor added successfully.");
    } catch (error) {
        console.error("Doctor save error:", error);
        alert(error.message || "Unable to save doctor.");
    }

}


// =========================================================
// LOAD DOCTORS
// =========================================================

async function loadDoctors() {

    try {

        const apiBase = window.location.port === "5500"
            ? `${window.location.protocol}//${window.location.hostname}:8000`
            : "";
        const response = await fetch(
            `${apiBase}/api/hospital/doctors/`,
            { credentials: "include" }
        );
        const doctors = await response.json();

        if (!response.ok) {
            throw new Error(doctors.message || "Unable to load doctors.");
        }

        renderDoctors(doctors);

    }
    catch (error) {

        console.error(
            "Doctor loading error:",
            error
        );

        showEmptyDoctors();

    }

}


// =========================================================
// SHOW EMPTY DOCTOR STATE
// =========================================================

function showEmptyDoctors() {

    const doctorList =
        document.getElementById(
            "doctorList"
        );

    const doctorEmpty =
        document.getElementById(
            "doctorEmpty"
        );


    if (doctorList) {

        doctorList.innerHTML = "";

        doctorList.style.display =
            "none";

    }


    if (doctorEmpty) {

        doctorEmpty.style.display =
            "flex";

    }


    updateDoctorStats(
        0,
        0,
        0
    );

}


// =========================================================
// RENDER DOCTORS
// =========================================================

function renderDoctors(doctors) {

    const doctorList =
        document.getElementById(
            "doctorList"
        );

    const doctorEmpty =
        document.getElementById(
            "doctorEmpty"
        );


    if (!doctorList) {
        return;
    }


    doctorList.innerHTML = "";


    if (
        !doctors ||
        doctors.length === 0
    ) {

        showEmptyDoctors();

        return;

    }


    doctorList.style.display =
        "grid";


    if (doctorEmpty) {

        doctorEmpty.style.display =
            "none";

    }


    let activeCount = 0;

    const departments =
        new Set();


    doctors.forEach(
        function (doctor) {

            if (
                doctor.status ===
                "Active"
            ) {

                activeCount++;

            }


            if (
                doctor.department
            ) {

                departments.add(
                    doctor.department
                );

            }


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "doctor-card";


            card.dataset.name =
                doctor.name || "";


            card.dataset.department =
                doctor.department ||
                doctor.specialization ||
                "";


            card.innerHTML = `

                <div class="doctor-card-header">

                    <div class="doctor-avatar">

                        <i class="bi bi-person-fill"></i>

                    </div>

                    <span class="doctor-status">

                        ${escapeHTML(
                            doctor.status ||
                            "Active"
                        )}

                    </span>

                </div>


                <div class="doctor-card-body">

                    <h3>
                        ${escapeHTML(
                            doctor.name ||
                            "Doctor"
                        )}
                    </h3>

                    <p class="doctor-specialization">

                        <i class="bi bi-heart-pulse"></i>

                        ${escapeHTML(
                            doctor.specialization ||
                            "Not specified"
                        )}

                    </p>

                    <p>

                        <i class="bi bi-envelope"></i>

                        ${escapeHTML(
                            doctor.email ||
                            "No email"
                        )}

                    </p>

                    <p>

                        <i class="bi bi-telephone"></i>

                        ${escapeHTML(
                            doctor.phone ||
                            "No phone"
                        )}

                    </p>

                </div>


                <div class="doctor-card-actions">

                    <button
                        type="button"
                        class="view-doctor-btn"
                        onclick="viewDoctor(${doctor.id})"
                    >

                        <i class="bi bi-eye"></i>

                        View

                    </button>


                    <button
                        type="button"
                        class="edit-doctor-btn"
                        onclick="editDoctor(${doctor.id})"
                    >

                        <i class="bi bi-pencil"></i>

                        Edit

                    </button>


                    <button
                        type="button"
                        class="delete-doctor-btn"
                        onclick="deleteDoctor(${doctor.id})"
                    >

                        <i class="bi bi-trash"></i>

                    </button>

                </div>

            `;


            doctorList.appendChild(
                card
            );

        }
    );


    updateDoctorStats(
        doctors.length,
        activeCount,
        departments.size
    );

}


// =========================================================
// UPDATE STATISTICS
// =========================================================

function updateDoctorStats(
    total,
    active,
    departments
) {

    const doctorCount =
        document.getElementById(
            "doctorCount"
        );

    const activeDoctorCount =
        document.getElementById(
            "activeDoctorCount"
        );

    const departmentCount =
        document.getElementById(
            "departmentCount"
        );


    if (doctorCount) {

        doctorCount.textContent =
            total;

    }


    if (activeDoctorCount) {

        activeDoctorCount.textContent =
            active;

    }


    if (departmentCount) {

        departmentCount.textContent =
            departments;

    }

}


// =========================================================
// SEARCH + FILTER
// =========================================================

function filterDoctors() {

    const searchInput =
        document.getElementById(
            "doctorSearch"
        );

    const departmentFilter =
        document.getElementById(
            "departmentFilter"
        );


    const cards =
        document.querySelectorAll(
            ".doctor-card"
        );


    const searchValue =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    const departmentValue =
        departmentFilter
            ? departmentFilter.value
                .toLowerCase()
            : "";


    cards.forEach(
        function (card) {

            const name =
                (
                    card.dataset.name ||
                    ""
                ).toLowerCase();


            const department =
                (
                    card.dataset.department ||
                    ""
                ).toLowerCase();


            const matchesSearch =
                name.includes(
                    searchValue
                ) ||
                department.includes(
                    searchValue
                );


            const matchesDepartment =
                !departmentValue ||
                department ===
                departmentValue;


            if (
                matchesSearch &&
                matchesDepartment
            ) {

                card.style.display =
                    "block";

            }
            else {

                card.style.display =
                    "none";

            }

        }
    );

}


// =========================================================
// VIEW DOCTOR
// =========================================================

function viewDoctor(doctorId) {

    console.log(
        "View doctor:",
        doctorId
    );


    /*
    Later:

    window.location.href =
        "hospital_doctor_profile.html?id="
        + doctorId;
    */

}


// =========================================================
// EDIT DOCTOR
// =========================================================

function editDoctor(doctorId) {

    console.log(
        "Edit doctor:",
        doctorId
    );


    /*
    Later:

    window.location.href =
        "hospital_doctor_edit.html?id="
        + doctorId;
    */

}


// =========================================================
// DELETE DOCTOR
// =========================================================

async function deleteDoctor(doctorId) {

    const confirmed =
        confirm(
            "Are you sure you want to remove this doctor?"
        );


    if (!confirmed) {
        return;
    }


    /*
    Future Django:

    await fetch(
        `/api/hospital/doctors/${doctorId}/`,
        {
            method: "DELETE"
        }
    );

    loadDoctors();
    */


    console.log(
        "Delete doctor:",
        doctorId
    );

}


// =========================================================
// LOAD HOSPITAL NAME
// =========================================================

async function loadHospitalName() {

    const hospitalName =
        document.getElementById(
            "hospitalName"
        );


    if (!hospitalName) {
        return;
    }


    /*
    Future:

    const response =
        await fetch(
            "/api/hospital/profile/"
        );

    const data =
        await response.json();

    hospitalName.textContent =
        data.hospital_name;
    */


    hospitalName.textContent =
        "Hospital";

}


// =========================================================
// NOTIFICATION
// =========================================================

function showNotificationMessage() {

    const notificationDot =
        document.getElementById(
            "notificationDot"
        );


    if (notificationDot) {

        notificationDot.style.display =
            "none";

    }


    alert(
        "No new hospital notifications."
    );

}


// =========================================================
// ESCAPE HTML
// =========================================================

function escapeHTML(value) {

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


// =========================================================
// LOGOUT
// =========================================================

function logoutHospital() {

    window.location.href =
        "hospital_login.html";

}