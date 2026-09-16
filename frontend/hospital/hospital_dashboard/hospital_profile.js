// =========================================================
// MEDVISIONAI - HOSPITAL PROFILE JS
// =========================================================

document.addEventListener("DOMContentLoaded", function () {


    // =====================================================
    // ELEMENTS
    // =====================================================

    const editProfileBtn =
        document.getElementById("editProfileBtn");

    const profileModal =
        document.getElementById("profileModal");

    const closeProfileModal =
        document.getElementById("closeProfileModal");

    const cancelProfileBtn =
        document.getElementById("cancelProfileBtn");

    const profileForm =
        document.getElementById("profileForm");

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
    // HOSPITAL DATA
    // =====================================================

    /*
        IMPORTANT:

        No backend data is being used yet.

        Later Django/PostgreSQL will provide
        this information through an API.

        Example:

        GET /api/hospital/profile/
    */


    let hospitalData = {

        id: "",

        name: "",

        type: "",

        registration_number: "",

        established_year: "",

        total_beds: "",

        emergency_service: "",

        email: "",

        phone: "",

        emergency_phone: "",

        website: "",

        address: "",

        city: "",

        state: "",

        country: "",

        administrator_name: "",

        administrator_email: "",

        departments: []

    };


    // =====================================================
    // INITIALIZE PAGE
    // =====================================================

    initializePage();


    function initializePage() {

        /*
            Currently there is no backend connection.

            Therefore the page remains empty.

            Later:

                fetchHospitalProfile();
        */

        renderHospitalProfile();

    }


    // =====================================================
    // RENDER PROFILE
    // =====================================================

    function renderHospitalProfile() {


        // ================================================
        // TOPBAR
        // ================================================

        setText(
            "hospitalNameTop",
            hospitalData.name || "Hospital"
        );


        // ================================================
        // OVERVIEW
        // ================================================

        setText(
            "displayHospitalName",
            hospitalData.name || "--"
        );


        setText(
            "displayHospitalType",
            hospitalData.type || "--"
        );


        setText(
            "displayHospitalId",
            hospitalData.id || "--"
        );


        // ================================================
        // BASIC INFORMATION
        // ================================================

        setText(
            "infoHospitalName",
            hospitalData.name || "--"
        );


        setText(
            "infoHospitalType",
            hospitalData.type || "--"
        );


        setText(
            "infoRegistrationNumber",
            hospitalData.registration_number || "--"
        );


        setText(
            "infoEstablishedYear",
            hospitalData.established_year || "--"
        );


        setText(
            "infoTotalBeds",
            hospitalData.total_beds || "--"
        );


        setText(
            "infoEmergency",
            hospitalData.emergency_service || "--"
        );


        // ================================================
        // CONTACT
        // ================================================

        setText(
            "infoEmail",
            hospitalData.email || "--"
        );


        setText(
            "infoPhone",
            hospitalData.phone || "--"
        );


        setText(
            "infoEmergencyPhone",
            hospitalData.emergency_phone || "--"
        );


        setText(
            "infoWebsite",
            hospitalData.website || "--"
        );


        // ================================================
        // ADDRESS
        // ================================================

        setText(
            "infoAddress",
            hospitalData.address || "--"
        );


        setText(
            "infoCityState",
            formatCityState()
        );


        setText(
            "infoCountry",
            hospitalData.country || "--"
        );


        // ================================================
        // ADMINISTRATOR
        // ================================================

        setText(
            "infoAdminName",
            hospitalData.administrator_name || "--"
        );


        setText(
            "infoAdminEmail",
            hospitalData.administrator_email || "--"
        );


        // ================================================
        // DEPARTMENTS
        // ================================================

        renderDepartments(
            hospitalData.departments
        );

    }


    // =====================================================
    // SET TEXT SAFELY
    // =====================================================

    function setText(id, value) {

        const element =
            document.getElementById(id);


        if (element) {

            element.textContent =
                value;

        }

    }


    // =====================================================
    // CITY + STATE
    // =====================================================

    function formatCityState() {

        const parts = [];

        if (hospitalData.city) {

            parts.push(
                hospitalData.city
            );

        }

        if (hospitalData.state) {

            parts.push(
                hospitalData.state
            );

        }


        if (parts.length === 0) {

            return "--";

        }


        return parts.join(", ");

    }


    // =====================================================
    // DEPARTMENTS
    // =====================================================

    function renderDepartments(departments) {


        const departmentList =
            document.getElementById(
                "departmentList"
            );


        if (!departmentList) {

            return;

        }


        departmentList.innerHTML = "";


        if (
            !departments ||
            departments.length === 0
        ) {

            departmentList.innerHTML = `

                <div class="department-item">

                    <i class="bi bi-info-circle"></i>

                    No departments added yet.

                </div>

            `;

            return;

        }


        departments.forEach(
            function (department) {


                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "department-item";


                item.innerHTML = `

                    <i class="bi bi-hospital"></i>

                    ${escapeHTML(
                        department
                    )}

                `;


                departmentList.appendChild(
                    item
                );

            }
        );

    }


    // =====================================================
    // OPEN EDIT PROFILE
    // =====================================================

    if (editProfileBtn) {

        editProfileBtn.addEventListener(
            "click",
            function () {

                populateEditForm();

                openModal();

            }
        );

    }


    // =====================================================
    // POPULATE EDIT FORM
    // =====================================================

    function populateEditForm() {


        setInputValue(
            "hospitalName",
            hospitalData.name
        );


        setInputValue(
            "hospitalType",
            hospitalData.type
        );


        setInputValue(
            "registrationNumber",
            hospitalData.registration_number
        );


        setInputValue(
            "establishedYear",
            hospitalData.established_year
        );


        setInputValue(
            "totalBeds",
            hospitalData.total_beds
        );


        setInputValue(
            "emergencyService",
            hospitalData.emergency_service
        );


        setInputValue(
            "hospitalEmail",
            hospitalData.email
        );


        setInputValue(
            "hospitalPhone",
            hospitalData.phone
        );


        setInputValue(
            "emergencyPhone",
            hospitalData.emergency_phone
        );


        setInputValue(
            "hospitalWebsite",
            hospitalData.website
        );


        setInputValue(
            "hospitalAddress",
            hospitalData.address
        );


        setInputValue(
            "hospitalCity",
            hospitalData.city
        );


        setInputValue(
            "hospitalState",
            hospitalData.state
        );


        setInputValue(
            "hospitalCountry",
            hospitalData.country
        );


        setInputValue(
            "adminName",
            hospitalData.administrator_name
        );


        setInputValue(
            "adminEmail",
            hospitalData.administrator_email
        );

    }


    // =====================================================
    // SET INPUT VALUE
    // =====================================================

    function setInputValue(id, value) {

        const element =
            document.getElementById(id);


        if (element) {

            element.value =
                value || "";

        }

    }


    // =====================================================
    // OPEN MODAL
    // =====================================================

    function openModal() {

        if (!profileModal) {

            return;

        }


        profileModal.classList.add(
            "active"
        );


        document.body.style.overflow =
            "hidden";

    }


    // =====================================================
    // CLOSE MODAL
    // =====================================================

    function closeModal() {

        if (!profileModal) {

            return;

        }


        profileModal.classList.remove(
            "active"
        );


        document.body.style.overflow =
            "";

    }


    if (closeProfileModal) {

        closeProfileModal.addEventListener(
            "click",
            closeModal
        );

    }


    if (cancelProfileBtn) {

        cancelProfileBtn.addEventListener(
            "click",
            closeModal
        );

    }


    // =====================================================
    // CLICK OUTSIDE MODAL
    // =====================================================

    if (profileModal) {

        profileModal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    profileModal
                ) {

                    closeModal();

                }

            }
        );

    }


    // =====================================================
    // SAVE PROFILE
    // =====================================================

    if (profileForm) {

        profileForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                // =========================================
                // READ FORM VALUES
                // =========================================

                hospitalData.name =
                    getInputValue(
                        "hospitalName"
                    );


                hospitalData.type =
                    getInputValue(
                        "hospitalType"
                    );


                hospitalData.registration_number =
                    getInputValue(
                        "registrationNumber"
                    );


                hospitalData.established_year =
                    getInputValue(
                        "establishedYear"
                    );


                hospitalData.total_beds =
                    getInputValue(
                        "totalBeds"
                    );


                hospitalData.emergency_service =
                    getInputValue(
                        "emergencyService"
                    );


                hospitalData.email =
                    getInputValue(
                        "hospitalEmail"
                    );


                hospitalData.phone =
                    getInputValue(
                        "hospitalPhone"
                    );


                hospitalData.emergency_phone =
                    getInputValue(
                        "emergencyPhone"
                    );


                hospitalData.website =
                    getInputValue(
                        "hospitalWebsite"
                    );


                hospitalData.address =
                    getInputValue(
                        "hospitalAddress"
                    );


                hospitalData.city =
                    getInputValue(
                        "hospitalCity"
                    );


                hospitalData.state =
                    getInputValue(
                        "hospitalState"
                    );


                hospitalData.country =
                    getInputValue(
                        "hospitalCountry"
                    );


                hospitalData.administrator_name =
                    getInputValue(
                        "adminName"
                    );


                hospitalData.administrator_email =
                    getInputValue(
                        "adminEmail"
                    );


                // =========================================
                // UPDATE PAGE
                // =========================================

                renderHospitalProfile();


                // =========================================
                // CLOSE MODAL
                // =========================================

                closeModal();


                // =========================================
                // SUCCESS
                // =========================================

                alert(
                    "Hospital profile updated successfully!"
                );


                /*
                    FUTURE DJANGO API:

                    fetch(
                        "/api/hospital/profile/",
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    hospitalData
                                )
                        }
                    );
                */

            }
        );

    }


    // =====================================================
    // GET INPUT VALUE
    // =====================================================

    function getInputValue(id) {

        const element =
            document.getElementById(id);


        if (!element) {

            return "";

        }


        return element.value.trim();

    }


    // =====================================================
    // NOTIFICATIONS
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

                    /*
                        Later Django will handle
                        actual session logout.
                    */

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
        When Django backend is ready:

        async function fetchHospitalProfile() {

            try {

                const response =
                    await fetch(
                        "/api/hospital/profile/"
                    );


                if (!response.ok) {

                    throw new Error(
                        "Failed to load hospital profile"
                    );

                }


                const data =
                    await response.json();


                hospitalData =
                    data;


                renderHospitalProfile();


            } catch (error) {

                console.error(
                    "Hospital profile API error:",
                    error
                );

            }

        }


        fetchHospitalProfile();
    */


});