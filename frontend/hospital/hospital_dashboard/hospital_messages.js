// =========================================================
// MEDVISIONAI - HOSPITAL MESSAGES JS
// =========================================================

document.addEventListener("DOMContentLoaded", function () {


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const messageList =
        document.getElementById("messageList");

    const emptyState =
        document.getElementById("emptyState");

    const messageSearch =
        document.getElementById("messageSearch");

    const messageTypeFilter =
        document.getElementById("messageTypeFilter");

    const messageStatusFilter =
        document.getElementById("messageStatusFilter");


    const totalMessages =
        document.getElementById("totalMessages");

    const unreadMessages =
        document.getElementById("unreadMessages");

    const doctorMessages =
        document.getElementById("doctorMessages");

    const patientMessages =
        document.getElementById("patientMessages");


    const newMessageBtn =
        document.getElementById("newMessageBtn");

    const emptyNewMessageBtn =
        document.getElementById("emptyNewMessageBtn");


    const messageModal =
        document.getElementById("messageModal");

    const closeMessageModal =
        document.getElementById("closeMessageModal");

    const cancelMessageBtn =
        document.getElementById("cancelMessageBtn");

    const messageForm =
        document.getElementById("messageForm");


    const viewMessageModal =
        document.getElementById("viewMessageModal");

    const closeViewMessageModal =
        document.getElementById("closeViewMessageModal");

    const closeViewMessageBtn =
        document.getElementById("closeViewMessageBtn");


    const mobileMenuBtn =
        document.getElementById("mobileMenuBtn");

    const sidebar =
        document.getElementById("sidebar");

    const sidebarOverlay =
        document.getElementById("sidebarOverlay");


    const notificationBtn =
        document.getElementById("notificationBtn");


    /* =====================================================
       MESSAGE DATA
    ===================================================== */

    /*
        IMPORTANT:

        No dummy messages are used.

        Later Django/PostgreSQL will provide:

        GET /api/hospital/messages/

        Example structure:

        {
            id: 1,
            sender_name: "Doctor Name",
            sender_type: "doctor",
            subject: "Patient consultation",
            content: "Message content",
            date: "2026-08-15T10:30:00",
            read: false
        }
    */

    let messages = [];

    let selectedMessageId = null;


    /* =====================================================
       INITIALIZE
    ===================================================== */

    initializePage();


    function initializePage() {

        renderMessages([]);

        updateStatistics([]);

    }


    /* =====================================================
       RENDER MESSAGES
    ===================================================== */

    function renderMessages(data) {


        if (!messageList) {
            return;
        }


        messageList.innerHTML = "";


        if (!data || data.length === 0) {

            messageList.style.display = "none";

            if (emptyState) {
                emptyState.style.display = "flex";
            }

            return;
        }


        if (emptyState) {
            emptyState.style.display = "none";
        }


        messageList.style.display = "flex";


        data.forEach(function (message) {


            const item =
                document.createElement("div");


            const senderType =
                String(
                    message.sender_type || "doctor"
                ).toLowerCase();


            const isUnread =
                message.read === false;


            item.className =
                "message-item" +
                (isUnread ? " unread" : "");


            item.dataset.id =
                message.id;


            /* =================================================
               AVATAR
            ================================================= */

            const avatar =
                document.createElement("div");


            avatar.className =
                "sender-avatar" +
                (
                    senderType === "patient"
                        ? " patient"
                        : ""
                );


            avatar.innerHTML =
                senderType === "patient"
                    ? '<i class="bi bi-person-fill"></i>'
                    : '<i class="bi bi-person-badge-fill"></i>';


            /* =================================================
               MAIN MESSAGE
            ================================================= */

            const main =
                document.createElement("div");


            main.className =
                "message-main";


            const senderName =
                escapeHTML(
                    message.sender_name ||
                    "Unknown User"
                );


            const subject =
                escapeHTML(
                    message.subject ||
                    "No Subject"
                );


            const preview =
                escapeHTML(
                    message.content ||
                    ""
                );


            const formattedDate =
                formatDate(
                    message.date
                );


            main.innerHTML = `

                <div class="message-top">

                    <span class="sender-name">
                        ${senderName}
                    </span>

                    <span class="message-time">
                        ${formattedDate}
                    </span>

                </div>


                <div class="message-subject">

                    ${subject}

                </div>


                <div class="message-preview">

                    ${preview}

                </div>

            `;


            /* =================================================
               TYPE
            ================================================= */

            const type =
                document.createElement("span");


            type.className =
                "message-type " +
                (
                    senderType === "patient"
                        ? "patient-type"
                        : "doctor-type"
                );


            type.textContent =
                senderType === "patient"
                    ? "Patient"
                    : "Doctor";


            /* =================================================
               UNREAD DOT
            ================================================= */

            if (isUnread) {

                const dot =
                    document.createElement("span");

                dot.className =
                    "message-unread-dot";

                item.appendChild(avatar);

                item.appendChild(main);

                item.appendChild(type);

                item.appendChild(dot);

            } else {

                item.appendChild(avatar);

                item.appendChild(main);

                item.appendChild(type);

            }


            messageList.appendChild(item);

        });

    }


    /* =====================================================
       STATISTICS
    ===================================================== */

    function updateStatistics(data) {


        if (!data) {
            data = [];
        }


        if (totalMessages) {

            totalMessages.textContent =
                data.length;

        }


        const unread =
            data.filter(function (message) {

                return message.read === false;

            }).length;


        if (unreadMessages) {

            unreadMessages.textContent =
                unread;

        }


        const doctors =
            data.filter(function (message) {

                return String(
                    message.sender_type || ""
                ).toLowerCase() === "doctor";

            }).length;


        if (doctorMessages) {

            doctorMessages.textContent =
                doctors;

        }


        const patients =
            data.filter(function (message) {

                return String(
                    message.sender_type || ""
                ).toLowerCase() === "patient";

            }).length;


        if (patientMessages) {

            patientMessages.textContent =
                patients;

        }

    }


    /* =====================================================
       SEARCH + FILTER
    ===================================================== */

    function filterMessages() {


        const searchText =
            (
                messageSearch?.value || ""
            )
            .toLowerCase()
            .trim();


        const selectedType =
            (
                messageTypeFilter?.value || "all"
            )
            .toLowerCase();


        const selectedStatus =
            (
                messageStatusFilter?.value || "all"
            )
            .toLowerCase();


        const filtered =
            messages.filter(function (message) {


                const sender =
                    String(
                        message.sender_name || ""
                    ).toLowerCase();


                const subject =
                    String(
                        message.subject || ""
                    ).toLowerCase();


                const content =
                    String(
                        message.content || ""
                    ).toLowerCase();


                const type =
                    String(
                        message.sender_type || ""
                    ).toLowerCase();


                const matchesSearch =

                    sender.includes(searchText) ||

                    subject.includes(searchText) ||

                    content.includes(searchText);


                const matchesType =

                    selectedType === "all" ||

                    type === selectedType;


                const isRead =
                    message.read === true;


                const matchesStatus =

                    selectedStatus === "all" ||

                    (
                        selectedStatus === "read" &&
                        isRead
                    ) ||

                    (
                        selectedStatus === "unread" &&
                        !isRead
                    );


                return (

                    matchesSearch &&

                    matchesType &&

                    matchesStatus

                );

            });


        renderMessages(filtered);

    }


    if (messageSearch) {

        messageSearch.addEventListener(
            "input",
            filterMessages
        );

    }


    if (messageTypeFilter) {

        messageTypeFilter.addEventListener(
            "change",
            filterMessages
        );

    }


    if (messageStatusFilter) {

        messageStatusFilter.addEventListener(
            "change",
            filterMessages
        );

    }


    /* =====================================================
       OPEN NEW MESSAGE MODAL
    ===================================================== */

    function openMessageModal() {

        if (!messageModal) {
            return;
        }


        messageModal.classList.add("active");

        document.body.style.overflow =
            "hidden";

    }


    if (newMessageBtn) {

        newMessageBtn.addEventListener(
            "click",
            openMessageModal
        );

    }


    if (emptyNewMessageBtn) {

        emptyNewMessageBtn.addEventListener(
            "click",
            openMessageModal
        );

    }


    /* =====================================================
       CLOSE NEW MESSAGE MODAL
    ===================================================== */

    function closeMessageForm() {

        if (!messageModal) {
            return;
        }


        messageModal.classList.remove(
            "active"
        );


        document.body.style.overflow =
            "";

    }


    if (closeMessageModal) {

        closeMessageModal.addEventListener(
            "click",
            closeMessageForm
        );

    }


    if (cancelMessageBtn) {

        cancelMessageBtn.addEventListener(
            "click",
            closeMessageForm
        );

    }


    /* =====================================================
       SEND MESSAGE
    ===================================================== */

    if (messageForm) {

        messageForm.addEventListener(
            "submit",
            function (event) {


                event.preventDefault();


                const recipientType =
                    document.getElementById(
                        "recipientType"
                    ).value;


                const recipientName =
                    document.getElementById(
                        "recipientName"
                    ).value.trim();


                const subject =
                    document.getElementById(
                        "messageSubject"
                    ).value.trim();


                const content =
                    document.getElementById(
                        "messageContent"
                    ).value.trim();


                if (
                    !recipientType ||
                    !recipientName ||
                    !subject ||
                    !content
                ) {

                    alert(
                        "Please fill all fields."
                    );

                    return;

                }


                /* =================================================
                   TEMPORARY MESSAGE OBJECT
                ================================================= */

                const newMessage = {

                    id:
                        Date.now(),

                    sender_name:
                        recipientName,

                    sender_type:
                        recipientType,

                    subject:
                        subject,

                    content:
                        content,

                    date:
                        new Date().toISOString(),

                    read:
                        true

                };


                /*
                    In the real application this will become:

                    POST /api/hospital/messages/

                    using Django REST API.
                */


                console.log(
                    "Message:",
                    newMessage
                );


                alert(
                    "Message sent successfully!"
                );


                messageForm.reset();

                closeMessageForm();


                /*
                    Since this is currently frontend-only,
                    we don't add the sent message to the inbox.

                    Later Django will save it to PostgreSQL.
                */

            }
        );

    }


    /* =====================================================
       VIEW MESSAGE
    ===================================================== */

    if (messageList) {

        messageList.addEventListener(
            "click",
            function (event) {


                const messageItem =
                    event.target.closest(
                        ".message-item"
                    );


                if (!messageItem) {
                    return;
                }


                const id =
                    messageItem.dataset.id;


                viewMessage(id);

            }
        );

    }


    function viewMessage(id) {


        selectedMessageId =
            id;


        const message =
            messages.find(function (item) {

                return String(item.id) ===
                    String(id);

            });


        if (!message) {
            return;
        }


        document.getElementById(
            "viewMessageSubject"
        ).textContent =
            message.subject || "No Subject";


        document.getElementById(
            "viewMessageSender"
        ).textContent =
            message.sender_name || "Unknown";


        document.getElementById(
            "messageFrom"
        ).textContent =
            message.sender_name || "--";


        document.getElementById(
            "messageFromType"
        ).textContent =
            message.sender_type || "--";


        document.getElementById(
            "messageDate"
        ).textContent =
            formatDate(message.date);


        document.getElementById(
            "viewMessageContent"
        ).textContent =
            message.content || "--";


        /* Mark as read */

        message.read = true;


        updateStatistics(messages);


        if (viewMessageModal) {

            viewMessageModal.classList.add(
                "active"
            );

            document.body.style.overflow =
                "hidden";

        }

    }


    /* =====================================================
       CLOSE VIEW MESSAGE
    ===================================================== */

    function closeViewMessage() {

        if (!viewMessageModal) {
            return;
        }


        viewMessageModal.classList.remove(
            "active"
        );


        document.body.style.overflow =
            "";


        selectedMessageId =
            null;

    }


    if (closeViewMessageModal) {

        closeViewMessageModal.addEventListener(
            "click",
            closeViewMessage
        );

    }


    if (closeViewMessageBtn) {

        closeViewMessageBtn.addEventListener(
            "click",
            closeViewMessage
        );

    }


    /* =====================================================
       CLOSE MODALS WHEN CLICKING OUTSIDE
    ===================================================== */

    if (messageModal) {

        messageModal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    messageModal
                ) {

                    closeMessageForm();

                }

            }
        );

    }


    if (viewMessageModal) {

        viewMessageModal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    viewMessageModal
                ) {

                    closeViewMessage();

                }

            }
        );

    }


    /* =====================================================
       NOTIFICATIONS
    ===================================================== */

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


    /* =====================================================
       MOBILE SIDEBAR
    ===================================================== */

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


    /* =====================================================
       ESC KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                closeMessageForm();

                closeViewMessage();

                closeMobileSidebar();

            }

        }
    );


    /* =====================================================
       DATE FORMATTER
    ===================================================== */

    function formatDate(dateValue) {


        if (!dateValue) {
            return "--";
        }


        const date =
            new Date(dateValue);


        if (isNaN(date.getTime())) {

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


    /* =====================================================
       HTML SECURITY
    ===================================================== */

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


    /* =====================================================
       FUTURE DJANGO API
    ===================================================== */

    /*
        Later, replace the empty initialization with:

        async function fetchMessagesFromBackend() {

            try {

                const response =
                    await fetch(
                        "/api/hospital/messages/"
                    );


                if (!response.ok) {

                    throw new Error(
                        "Failed to fetch messages"
                    );

                }


                const data =
                    await response.json();


                messages =
                    data.messages || [];


                renderMessages(messages);

                updateStatistics(messages);


            } catch (error) {

                console.error(
                    "Message API error:",
                    error
                );


                messages = [];

                renderMessages([]);

                updateStatistics([]);

            }

        }
    */

});