// =========================================================
// MEDVISIONAI - HOSPITAL MEDICINES
// =========================================================

document.addEventListener("DOMContentLoaded", function () {


    // =====================================================
    // ELEMENTS
    // =====================================================

    const addMedicineBtn =
        document.getElementById("addMedicineBtn");

    const emptyAddMedicineBtn =
        document.getElementById("emptyAddMedicineBtn");

    const medicineModal =
        document.getElementById("medicineModal");

    const closeMedicineModal =
        document.getElementById("closeMedicineModal");

    const cancelMedicineBtn =
        document.getElementById("cancelMedicineBtn");

    const medicineForm =
        document.getElementById("medicineForm");

    const medicinesTableBody =
        document.getElementById("medicinesTableBody");

    const emptyState =
        document.getElementById("emptyState");

    const medicineSearch =
        document.getElementById("medicineSearch");

    const categoryFilter =
        document.getElementById("categoryFilter");

    const stockFilter =
        document.getElementById("stockFilter");

    const totalMedicines =
        document.getElementById("totalMedicines");

    const availableMedicines =
        document.getElementById("availableMedicines");

    const lowStockMedicines =
        document.getElementById("lowStockMedicines");

    const outOfStockMedicines =
        document.getElementById("outOfStockMedicines");

    const notificationBtn =
        document.getElementById("notificationBtn");

    const mobileMenuBtn =
        document.getElementById("mobileMenuBtn");

    const sidebar =
        document.getElementById("sidebar");

    const sidebarOverlay =
        document.getElementById("sidebarOverlay");


    // =====================================================
    // MEDICINE DATA
    // =====================================================

    /*
        IMPORTANT:

        No dummy medicine data is used.

        Later Django/PostgreSQL will provide:

        {
            id: 1,
            name: "Medicine Name",
            generic_name: "Generic Name",
            category: "Tablet",
            manufacturer: "Company",
            quantity: 100,
            price: 20,
            expiry_date: "2027-01-20",
            batch_number: "B001",
            description: "Description"
        }
    */

    let medicines = [];


    // =====================================================
    // INITIALIZE
    // =====================================================

    initializePage();


    function initializePage() {

        renderMedicines([]);

        updateStatistics([]);

    }


    // =====================================================
    // OPEN ADD MEDICINE MODAL
    // =====================================================

    function openMedicineModal() {

        if (!medicineModal) {
            return;
        }

        medicineModal.classList.add("show");

        document.body.style.overflow = "hidden";

    }


    if (addMedicineBtn) {

        addMedicineBtn.addEventListener(
            "click",
            openMedicineModal
        );

    }


    if (emptyAddMedicineBtn) {

        emptyAddMedicineBtn.addEventListener(
            "click",
            openMedicineModal
        );

    }


    // =====================================================
    // CLOSE MODAL
    // =====================================================

    function closeMedicineModalFunction() {

        if (!medicineModal) {
            return;
        }

        medicineModal.classList.remove("show");

        document.body.style.overflow = "";

    }


    if (closeMedicineModal) {

        closeMedicineModal.addEventListener(
            "click",
            closeMedicineModalFunction
        );

    }


    if (cancelMedicineBtn) {

        cancelMedicineBtn.addEventListener(
            "click",
            closeMedicineModalFunction
        );

    }


    if (medicineModal) {

        medicineModal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === medicineModal
                ) {

                    closeMedicineModalFunction();

                }

            }
        );

    }


    // =====================================================
    // ADD MEDICINE
    // =====================================================

    if (medicineForm) {

        medicineForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const name =
                    document.getElementById(
                        "medicineName"
                    ).value.trim();


                const genericName =
                    document.getElementById(
                        "genericName"
                    ).value.trim();


                const category =
                    document.getElementById(
                        "medicineCategory"
                    ).value;


                const manufacturer =
                    document.getElementById(
                        "manufacturer"
                    ).value.trim();


                const quantity =
                    Number(
                        document.getElementById(
                            "medicineQuantity"
                        ).value
                    );


                const price =
                    Number(
                        document.getElementById(
                            "medicinePrice"
                        ).value || 0
                    );


                const expiryDate =
                    document.getElementById(
                        "expiryDate"
                    ).value;


                const batchNumber =
                    document.getElementById(
                        "batchNumber"
                    ).value.trim();


                const description =
                    document.getElementById(
                        "medicineDescription"
                    ).value.trim();


                // =================================================
                // VALIDATION
                // =================================================

                if (
                    !name ||
                    !category ||
                    !manufacturer ||
                    !expiryDate ||
                    quantity < 0
                ) {

                    alert(
                        "Please fill all required fields."
                    );

                    return;

                }


                // =================================================
                // MEDICINE OBJECT
                // =================================================

                const medicine = {

                    id:
                        Date.now(),

                    name:
                        name,

                    generic_name:
                        genericName,

                    category:
                        category,

                    manufacturer:
                        manufacturer,

                    quantity:
                        quantity,

                    price:
                        price,

                    expiry_date:
                        expiryDate,

                    batch_number:
                        batchNumber,

                    description:
                        description

                };


                /*
                    FRONTEND TEMPORARY STORAGE

                    This allows you to test the UI
                    before Django is connected.
                */

                medicines.push(medicine);


                console.log(
                    "Medicine:",
                    medicine
                );


                // =================================================
                // REFRESH UI
                // =================================================

                renderMedicines(
                    medicines
                );


                updateStatistics(
                    medicines
                );


                // =================================================
                // SUCCESS
                // =================================================

                alert(
                    "Medicine added successfully!"
                );


                // =================================================
                // RESET
                // =================================================

                medicineForm.reset();


                closeMedicineModalFunction();

            }
        );

    }


    // =====================================================
    // RENDER MEDICINES
    // =====================================================

    function renderMedicines(data) {

        if (!medicinesTableBody) {
            return;
        }


        medicinesTableBody.innerHTML = "";


        if (
            !data ||
            data.length === 0
        ) {

            medicinesTableBody.style.display =
                "none";


            if (emptyState) {

                emptyState.style.display =
                    "flex";

            }

            return;

        }


        if (emptyState) {

            emptyState.style.display =
                "none";

        }


        medicinesTableBody.style.display =
            "table-row-group";


        data.forEach(function (medicine) {


            const row =
                document.createElement("tr");


            // =================================================
            // MEDICINE
            // =================================================

            const medicineCell =
                document.createElement("td");


            medicineCell.innerHTML = `

                <div class="medicine-cell">

                    <div class="medicine-avatar">

                        <i class="bi bi-capsule-pill"></i>

                    </div>

                    <div class="medicine-name">

                        <strong>
                            ${escapeHTML(
                                medicine.name ||
                                "Medicine"
                            )}
                        </strong>

                        <small>
                            ${escapeHTML(
                                medicine.generic_name ||
                                "--"
                            )}
                        </small>

                    </div>

                </div>

            `;


            // =================================================
            // CATEGORY
            // =================================================

            const categoryCell =
                document.createElement("td");

            categoryCell.textContent =
                medicine.category || "--";


            // =================================================
            // MANUFACTURER
            // =================================================

            const manufacturerCell =
                document.createElement("td");

            manufacturerCell.textContent =
                medicine.manufacturer || "--";


            // =================================================
            // QUANTITY
            // =================================================

            const quantityCell =
                document.createElement("td");

            quantityCell.textContent =
                medicine.quantity ?? 0;


            // =================================================
            // EXPIRY
            // =================================================

            const expiryCell =
                document.createElement("td");

            expiryCell.textContent =
                formatDate(
                    medicine.expiry_date
                );


            // =================================================
            // STATUS
            // =================================================

            const statusCell =
                document.createElement("td");


            const status =
                getStockStatus(
                    medicine.quantity
                );


            if (status === "available") {

                statusCell.innerHTML = `

                    <span class="status-badge status-available">
                        Available
                    </span>

                `;

            }
            else if (status === "low") {

                statusCell.innerHTML = `

                    <span class="status-badge status-low">
                        Low Stock
                    </span>

                `;

            }
            else {

                statusCell.innerHTML = `

                    <span class="status-badge status-out">
                        Out of Stock
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
                        title="View Medicine"
                        data-action="view"
                        data-id="${medicine.id}">

                        <i class="bi bi-eye-fill"></i>

                    </button>


                    <button
                        class="action-btn edit-btn"
                        title="Edit Medicine"
                        data-action="edit"
                        data-id="${medicine.id}">

                        <i class="bi bi-pencil-fill"></i>

                    </button>


                    <button
                        class="action-btn delete-btn"
                        title="Delete Medicine"
                        data-action="delete"
                        data-id="${medicine.id}">

                        <i class="bi bi-trash-fill"></i>

                    </button>

                </div>

            `;


            row.appendChild(medicineCell);

            row.appendChild(categoryCell);

            row.appendChild(manufacturerCell);

            row.appendChild(quantityCell);

            row.appendChild(expiryCell);

            row.appendChild(statusCell);

            row.appendChild(actionCell);


            medicinesTableBody.appendChild(row);

        });

    }


    // =====================================================
    // STOCK STATUS
    // =====================================================

    function getStockStatus(quantity) {

        quantity =
            Number(quantity || 0);


        if (quantity <= 0) {

            return "out";

        }


        if (quantity <= 20) {

            return "low";

        }


        return "available";

    }


    // =====================================================
    // STATISTICS
    // =====================================================

    function updateStatistics(data) {

        if (!data) {
            data = [];
        }


        if (totalMedicines) {

            totalMedicines.textContent =
                data.length;

        }


        let available = 0;

        let lowStock = 0;

        let outOfStock = 0;


        data.forEach(function (medicine) {

            const status =
                getStockStatus(
                    medicine.quantity
                );


            if (status === "available") {

                available++;

            }
            else if (status === "low") {

                lowStock++;

            }
            else {

                outOfStock++;

            }

        });


        if (availableMedicines) {

            availableMedicines.textContent =
                available;

        }


        if (lowStockMedicines) {

            lowStockMedicines.textContent =
                lowStock;

        }


        if (outOfStockMedicines) {

            outOfStockMedicines.textContent =
                outOfStock;

        }

    }


    // =====================================================
    // SEARCH + FILTER
    // =====================================================

    function filterMedicines() {

        const searchText =
            (
                medicineSearch?.value || ""
            )
            .toLowerCase()
            .trim();


        const selectedCategory =
            (
                categoryFilter?.value || "all"
            )
            .toLowerCase();


        const selectedStock =
            (
                stockFilter?.value || "all"
            )
            .toLowerCase();


        const filtered =
            medicines.filter(
                function (medicine) {


                    const name =
                        String(
                            medicine.name || ""
                        ).toLowerCase();


                    const genericName =
                        String(
                            medicine.generic_name || ""
                        ).toLowerCase();


                    const manufacturer =
                        String(
                            medicine.manufacturer || ""
                        ).toLowerCase();


                    const category =
                        String(
                            medicine.category || ""
                        ).toLowerCase();


                    const status =
                        getStockStatus(
                            medicine.quantity
                        );


                    const matchesSearch =

                        name.includes(
                            searchText
                        ) ||

                        genericName.includes(
                            searchText
                        ) ||

                        manufacturer.includes(
                            searchText
                        );


                    const matchesCategory =

                        selectedCategory === "all" ||

                        category ===
                            selectedCategory;


                    const matchesStock =

                        selectedStock === "all" ||

                        status ===
                            selectedStock;


                    return (

                        matchesSearch &&

                        matchesCategory &&

                        matchesStock

                    );

                }
            );


        renderMedicines(
            filtered
        );

    }


    if (medicineSearch) {

        medicineSearch.addEventListener(
            "input",
            filterMedicines
        );

    }


    if (categoryFilter) {

        categoryFilter.addEventListener(
            "change",
            filterMedicines
        );

    }


    if (stockFilter) {

        stockFilter.addEventListener(
            "change",
            filterMedicines
        );

    }


    // =====================================================
    // TABLE ACTIONS
    // =====================================================

    if (medicinesTableBody) {

        medicinesTableBody.addEventListener(
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


                if (action === "view") {

                    viewMedicine(id);

                }


                if (action === "edit") {

                    editMedicine(id);

                }


                if (action === "delete") {

                    deleteMedicine(id);

                }

            }
        );

    }


    // =====================================================
    // VIEW MEDICINE
    // =====================================================

    function viewMedicine(id) {

        const medicine =
            medicines.find(
                function (item) {

                    return String(item.id) ===
                        String(id);

                }
            );


        if (!medicine) {
            return;
        }


        alert(

            "Medicine: " +
            medicine.name +

            "\n\nCategory: " +
            medicine.category +

            "\nManufacturer: " +
            medicine.manufacturer +

            "\nQuantity: " +
            medicine.quantity +

            "\nExpiry: " +
            formatDate(
                medicine.expiry_date
            )

        );

    }


    // =====================================================
    // EDIT MEDICINE
    // =====================================================

    function editMedicine(id) {

        const medicine =
            medicines.find(
                function (item) {

                    return String(item.id) ===
                        String(id);

                }
            );


        if (!medicine) {
            return;
        }


        /*
            Later this will open an edit form.

            For now we show the selected
            medicine information.
        */

        alert(
            "Edit medicine will be connected to Django later.\n\n" +
            medicine.name
        );

    }


    // =====================================================
    // DELETE MEDICINE
    // =====================================================

    function deleteMedicine(id) {

        const medicine =
            medicines.find(
                function (item) {

                    return String(item.id) ===
                        String(id);

                }
            );


        if (!medicine) {
            return;
        }


        const confirmed =
            confirm(
                "Delete " +
                medicine.name +
                "?"
            );


        if (!confirmed) {
            return;
        }


        medicines =
            medicines.filter(
                function (item) {

                    return String(item.id) !==
                        String(id);

                }
            );


        renderMedicines(
            medicines
        );


        updateStatistics(
            medicines
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
                    "Medicine stock notifications will appear here."
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
    // ESC KEY
    // =====================================================

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape"
            ) {

                closeMedicineModalFunction();

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
        Later replace the frontend data with:

        async function fetchMedicinesFromBackend() {

            try {

                const response =
                    await fetch(
                        "/api/hospital/medicines/"
                    );


                if (!response.ok) {

                    throw new Error(
                        "Failed to fetch medicines"
                    );

                }


                const data =
                    await response.json();


                medicines =
                    data.medicines || [];


                renderMedicines(
                    medicines
                );


                updateStatistics(
                    medicines
                );


            } catch (error) {

                console.error(
                    "Medicine API error:",
                    error
                );

            }

        }
    */

});