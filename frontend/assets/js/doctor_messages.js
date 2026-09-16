/* =========================================================
   MEDVISIONAI
   DOCTOR MESSAGES
   ========================================================= */


/*
    Backend endpoints expected:

    GET
    /api/doctor/conversations

    GET
    /api/doctor/conversations/{conversation_id}/messages

    POST
    /api/doctor/conversations/{conversation_id}/messages

    POST
    /api/doctor/conversations/{conversation_id}/attachments

    PUT
    /api/doctor/messages/{message_id}/read

*/


const API = {

    conversations:
        "/api/doctor/conversations/",

    messages:
        "/api/doctor/conversations/",

    sendMessage:
        "/api/doctor/conversations/",

    attachment:
        "/api/doctor/conversations/"

};


/* =========================================================
   VARIABLES
   ========================================================= */

let conversations = [];

let selectedConversation = null;

let selectedAttachment = null;

let pollingTimer = null;


/* =========================================================
   DOM
   ========================================================= */

const conversationList =
    document.getElementById(
        "conversationList"
    );

const conversationLoading =
    document.getElementById(
        "conversationLoading"
    );

const conversationCount =
    document.getElementById(
        "conversationCount"
    );

const patientSearch =
    document.getElementById(
        "patientSearch"
    );

const noChat =
    document.getElementById(
        "noChat"
    );

const activeChat =
    document.getElementById(
        "activeChat"
    );

const messagesArea =
    document.getElementById(
        "messagesArea"
    );

const messagesLoading =
    document.getElementById(
        "messagesLoading"
    );

const messageForm =
    document.getElementById(
        "messageForm"
    );

const messageInput =
    document.getElementById(
        "messageInput"
    );

const sendButton =
    document.getElementById(
        "sendButton"
    );

const attachmentButton =
    document.getElementById(
        "attachmentButton"
    );

const attachmentInput =
    document.getElementById(
        "attachmentInput"
    );

const attachmentPreview =
    document.getElementById(
        "attachmentPreview"
    );

const attachmentName =
    document.getElementById(
        "attachmentName"
    );

const removeAttachment =
    document.getElementById(
        "removeAttachment"
    );

const refreshConversations =
    document.getElementById(
        "refreshConversations"
    );

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadDoctorInfo();

        loadConversations();

        setupMessageInput();

    }
);


/* =========================================================
   DOCTOR INFO
   ========================================================= */

function loadDoctorInfo() {

    const storedDoctor =
        localStorage.getItem(
            "doctor"
        );


    if (!storedDoctor) {

        return;

    }


    try {

        const doctor =
            JSON.parse(
                storedDoctor
            );


        const doctorName =
            document.getElementById(
                "doctorName"
            );


        if (doctor.name) {

            doctorName.textContent =
                doctor.name;

        }

    }

    catch (error) {

        console.error(
            "Doctor information error:",
            error
        );

    }

}


/* =========================================================
   LOAD CONVERSATIONS
   ========================================================= */

async function loadConversations() {

    conversationLoading.hidden =
        false;


    try {

        const response =
            await fetch(
                API.conversations,
                {
                    method: "GET",

                    headers: {
                        "Content-Type":
                            "application/json"
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load conversations"
            );

        }


        const data =
            await response.json();


        conversations =
            Array.isArray(data)
                ? data
                : data.conversations || [];


        renderConversations(
            conversations
        );


    }

    catch (error) {

        console.error(
            "Conversation error:",
            error
        );


        renderConversationError();

    }

}


/* =========================================================
   RENDER CONVERSATIONS
   ========================================================= */

function renderConversations(
    list
) {

    conversationLoading.hidden =
        true;


    conversationList.innerHTML =
        "";


    conversationCount.textContent =
        `${list.length} conversation${list.length === 1 ? "" : "s"}`;


    if (!list.length) {

        conversationList.innerHTML = `

            <div class="conversation-loading">

                <span>
                    No patient conversations yet.
                </span>

            </div>

        `;

        return;

    }


    list.forEach(
        function (conversation) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "conversation-item";


            item.dataset.id =
                conversation.id;


            const unread =
                Number(
                    conversation.unread_count || 0
                );


            const online =
                conversation.patient_online === true;


            item.innerHTML = `

                <div class="conversation-avatar">

                    <i class="bi bi-person"></i>

                    ${
                        online
                            ? `<span class="online-dot"></span>`
                            : ""
                    }

                </div>


                <div class="conversation-info">

                    <div class="conversation-top">

                        <span class="conversation-name">

                            ${escapeHtml(
                                conversation.patient_name ||
                                "Patient"
                            )}

                        </span>


                        <span class="conversation-time">

                            ${formatMessageTime(
                                conversation.last_message_time
                            )}

                        </span>

                    </div>


                    <div class="conversation-bottom">

                        <span class="last-message">

                            ${escapeHtml(
                                conversation.last_message ||
                                "No messages yet"
                            )}

                        </span>


                        ${
                            unread > 0
                                ? `
                                    <span class="unread-count">
                                        ${unread}
                                    </span>
                                  `
                                : ""
                        }

                    </div>

                </div>

            `;


            item.addEventListener(
                "click",
                function () {

                    selectConversation(
                        conversation
                    );

                }
            );


            conversationList.appendChild(
                item
            );

        }
    );

}


/* =========================================================
   SELECT CONVERSATION
   ========================================================= */

async function selectConversation(
    conversation
) {

    selectedConversation =
        conversation;


    document
        .querySelectorAll(
            ".conversation-item"
        )
        .forEach(
            function (item) {

                item.classList.remove(
                    "active"
                );

            }
        );


    const selectedItem =
        document.querySelector(
            `.conversation-item[data-id="${conversation.id}"]`
        );


    if (selectedItem) {

        selectedItem.classList.add(
            "active"
        );

    }


    noChat.hidden =
        true;


    activeChat.hidden =
        false;


    updateChatHeader(
        conversation
    );


    await loadMessages(
        conversation.id
    );


    startMessagePolling();

}


/* =========================================================
   CHAT HEADER
   ========================================================= */

function updateChatHeader(
    conversation
) {

    document.getElementById(
        "selectedPatientName"
    ).textContent =
        conversation.patient_name ||
        "Patient";


    const status =
        document.getElementById(
            "selectedPatientStatus"
        );


    if (
        conversation.patient_online
    ) {

        status.textContent =
            "Online";

        status.classList.remove(
            "offline"
        );

    }

    else {

        status.textContent =
            "Offline";

        status.classList.add(
            "offline"
        );

    }

}


/* =========================================================
   LOAD MESSAGES
   ========================================================= */

async function loadMessages(
    conversationId,
    keepPosition = false
) {

    messagesArea.innerHTML = `

        <div
            class="messages-loading"
            style="
                display:flex;
                justify-content:center;
                align-items:center;
                gap:8px;
                height:100%;
                color:#94a3b8;
                font-size:10px;
            "
        >

            <div
                class="spinner-border spinner-border-sm text-primary"
            ></div>

            <span>
                Loading messages...
            </span>

        </div>

    `;


    try {

        const response =
            await fetch(
                `${API.messages}/${conversationId}/messages`,
                {
                    method: "GET",

                    headers: {
                        "Content-Type":
                            "application/json"
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load messages"
            );

        }


        const data =
            await response.json();


        const messages =
            Array.isArray(data)
                ? data
                : data.messages || [];


        renderMessages(
            messages
        );


        /*
            Mark patient messages as read.
        */

        markMessagesRead(
            messages
        );


    }

    catch (error) {

        console.error(
            "Message loading error:",
            error
        );


        messagesArea.innerHTML = `

            <div class="no-messages">

                <i class="bi bi-exclamation-circle"></i>

                <p>
                    Unable to load messages.
                </p>

            </div>

        `;

    }

}


/* =========================================================
   RENDER MESSAGES
   ========================================================= */

function renderMessages(
    messages
) {

    messagesArea.innerHTML =
        "";


    if (!messages.length) {

        messagesArea.innerHTML = `

            <div class="no-messages">

                <i class="bi bi-chat-dots"></i>

                <p>
                    No messages yet.
                    Start the conversation.
                </p>

            </div>

        `;

        return;

    }


    let lastDate = null;


    messages.forEach(
        function (message) {

            const currentDate =
                getDateLabel(
                    message.created_at
                );


            if (
                currentDate !==
                lastDate
            ) {

                const dateElement =
                    document.createElement(
                        "div"
                    );


                dateElement.className =
                    "message-date";


                dateElement.textContent =
                    currentDate;


                messagesArea.appendChild(
                    dateElement
                );


                lastDate =
                    currentDate;

            }


            const row =
                document.createElement(
                    "div"
                );


            const sender =
                getSenderType(
                    message
                );


            row.className =
                `message-row ${sender}`;


            const bubble =
                document.createElement(
                    "div"
                );


            bubble.className =
                "message-bubble";


            let attachmentHTML =
                "";


            if (
                message.attachment
            ) {

                attachmentHTML = `

                    <div class="message-attachment">

                        <i class="bi bi-file-earmark"></i>

                        <span>

                            ${escapeHtml(
                                message.attachment.name ||
                                "Attachment"
                            )}

                        </span>

                    </div>

                `;

            }


            bubble.innerHTML = `

                ${attachmentHTML}

                <div>

                    ${formatMessageText(
                        message.message
                    )}

                </div>


                <span class="message-time">

                    ${formatTime(
                        message.created_at
                    )}

                    ${
                        sender === "doctor"
                            ? `
                                <span class="message-status">

                                    ${
                                        message.read
                                            ? "✓✓"
                                            : "✓"
                                    }

                                </span>
                              `
                            : ""
                    }

                </span>

            `;


            row.appendChild(
                bubble
            );


            messagesArea.appendChild(
                row
            );

        }
    );


    scrollToBottom();

}


/* =========================================================
   SEND MESSAGE
   ========================================================= */

messageForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        if (
            !selectedConversation
        ) {

            return;

        }


        const message =
            messageInput.value.trim();


        if (
            !message &&
            !selectedAttachment
        ) {

            return;

        }


        sendButton.disabled =
            true;


        try {

            /*
                If attachment exists,
                upload it first.
            */

            let attachmentId =
                null;


            if (
                selectedAttachment
            ) {

                attachmentId =
                    await uploadAttachment(
                        selectedAttachment
                    );

            }


            const payload = {

                message:
                    message,

                attachment_id:
                    attachmentId

            };


            const response =
                await fetch(
                    `${API.sendMessage}/${selectedConversation.id}/messages`,
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify(
                                payload
                            )

                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Unable to send message"
                );

            }


            messageInput.value =
                "";


            clearAttachment();


            await loadMessages(
                selectedConversation.id
            );


            /*
                Refresh conversation list
                so latest message appears.
            */

            await loadConversations();

        }

        catch (error) {

            console.error(
                "Send message error:",
                error
            );


            showMessage(
                "Unable to send message.",
                "danger"
            );

        }

        finally {

            sendButton.disabled =
                false;

        }

    }
);


/* =========================================================
   FILE ATTACHMENT
   ========================================================= */

attachmentButton.addEventListener(
    "click",
    function () {

        attachmentInput.click();

    }
);


attachmentInput.addEventListener(
    "change",
    function () {

        const file =
            this.files[0];


        if (!file) {

            return;

        }


        selectedAttachment =
            file;


        attachmentName.textContent =
            file.name;


        attachmentPreview.hidden =
            false;

    }
);


/* =========================================================
   REMOVE ATTACHMENT
   ========================================================= */

removeAttachment.addEventListener(
    "click",
    function () {

        clearAttachment();

    }
);


function clearAttachment() {

    selectedAttachment =
        null;


    attachmentInput.value =
        "";


    attachmentPreview.hidden =
        true;

}


/* =========================================================
   UPLOAD ATTACHMENT
   ========================================================= */

async function uploadAttachment(
    file
) {

    const formData =
        new FormData();


    formData.append(
        "file",
        file
    );


    const response =
        await fetch(
            `${API.attachment}/${selectedConversation.id}/attachments`,
            {

                method: "POST",

                body:
                    formData

            }
        );


    if (!response.ok) {

        throw new Error(
            "Attachment upload failed"
        );

    }


    const data =
        await response.json();


    return data.id;

}


/* =========================================================
   SEARCH PATIENTS
   ========================================================= */

patientSearch.addEventListener(
    "input",
    function () {

        const query =
            this.value
                .toLowerCase()
                .trim();


        const filtered =
            conversations.filter(
                function (conversation) {

                    return (
                        conversation.patient_name &&
                        conversation.patient_name
                            .toLowerCase()
                            .includes(query)
                    );

                }
            );


        renderConversations(
            filtered
        );

    }
);


/* =========================================================
   REFRESH
   ========================================================= */

refreshConversations.addEventListener(
    "click",
    async function () {

        await loadConversations();


        if (
            selectedConversation
        ) {

            await loadMessages(
                selectedConversation.id
            );

        }

    }
);


/* =========================================================
   POLLING
   ========================================================= */

function startMessagePolling() {

    stopMessagePolling();


    /*
        Temporary real-time approach.

        Later replace this with WebSocket.

        Poll every 5 seconds.
    */

    pollingTimer =
        setInterval(
            async function () {

                if (
                    selectedConversation
                ) {

                    await loadMessages(
                        selectedConversation.id,
                        true
                    );

                }

            },
            5000
        );

}


function stopMessagePolling() {

    if (
        pollingTimer
    ) {

        clearInterval(
            pollingTimer
        );

        pollingTimer =
            null;

    }

}


/* =========================================================
   MARK READ
   ========================================================= */

async function markMessagesRead(
    messages
) {

    const unreadMessages =
        messages.filter(
            function (message) {

                return (
                    message.sender_type ===
                    "patient" &&
                    !message.read
                );

            }
        );


    for (
        const message
        of unreadMessages
    ) {

        try {

            await fetch(
                `/api/doctor/messages/${message.id}/read/`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    }
                }
            );

        }

        catch (error) {

            console.error(
                "Read status error:",
                error
            );

        }

    }

}


/* =========================================================
   MESSAGE INPUT
   ========================================================= */

function setupMessageInput() {

    messageInput.addEventListener(
        "input",
        function () {

            this.style.height =
                "auto";


            this.style.height =
                Math.min(
                    this.scrollHeight,
                    110
                ) + "px";

        }
    );


    /*
        Enter = send

        Shift + Enter = new line
    */

    messageInput.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                messageForm.requestSubmit();

            }

        }
    );

}


/* =========================================================
   SCROLL
   ========================================================= */

function scrollToBottom() {

    messagesArea.scrollTop =
        messagesArea.scrollHeight;

}


/* =========================================================
   SENDER TYPE
   ========================================================= */

function getSenderType(
    message
) {

    /*
        Backend should send:

        sender_type:
        "doctor"

        OR

        sender_type:
        "patient"
    */

    if (
        message.sender_type ===
        "doctor"
    ) {

        return "doctor";

    }


    return "patient";

}


/* =========================================================
   FORMAT TIME
   ========================================================= */

function formatTime(
    date
) {

    if (!date) {

        return "";

    }


    const parsed =
        new Date(date);


    if (
        Number.isNaN(
            parsed.getTime()
        )
    ) {

        return "";

    }


    return parsed.toLocaleTimeString(
        "en-IN",
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


/* =========================================================
   FORMAT MESSAGE TIME
   ========================================================= */

function formatMessageTime(
    date
) {

    if (!date) {

        return "";

    }


    const parsed =
        new Date(date);


    if (
        Number.isNaN(
            parsed.getTime()
        )
    ) {

        return "";

    }


    return parsed.toLocaleTimeString(
        "en-IN",
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


/* =========================================================
   DATE LABEL
   ========================================================= */

function getDateLabel(
    date
) {

    if (!date) {

        return "";

    }


    const parsed =
        new Date(date);


    if (
        Number.isNaN(
            parsed.getTime()
        )
    ) {

        return "";

    }


    const today =
        new Date();


    const yesterday =
        new Date();


    yesterday.setDate(
        today.getDate() - 1
    );


    if (
        parsed.toDateString() ===
        today.toDateString()
    ) {

        return "Today";

    }


    if (
        parsed.toDateString() ===
        yesterday.toDateString()
    ) {

        return "Yesterday";

    }


    return parsed.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );

}


/* =========================================================
   MESSAGE TEXT
   ========================================================= */

function formatMessageText(
    text
) {

    if (!text) {

        return "";

    }


    return escapeHtml(
        text
    ).replace(
        /\n/g,
        "<br>"
    );

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHtml(
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


/* =========================================================
   ERROR MESSAGE
   ========================================================= */

function renderConversationError() {

    conversationLoading.hidden =
        true;


    conversationList.innerHTML = `

        <div class="conversation-loading">

            <span>
                Unable to load conversations.
            </span>

        </div>

    `;

}


/* =========================================================
   ALERT
   ========================================================= */

function showMessage(
    message,
    type
) {

    const oldAlert =
        document.querySelector(
            ".message-alert"
        );


    if (oldAlert) {

        oldAlert.remove();

    }


    const alert =
        document.createElement(
            "div"
        );


    alert.className =
        `alert alert-${type} message-alert`;


    alert.style.position =
        "fixed";

    alert.style.top =
        "25px";

    alert.style.right =
        "25px";

    alert.style.zIndex =
        "9999";

    alert.style.fontSize =
        "12px";

    alert.textContent =
        message;


    document.body.appendChild(
        alert
    );


    setTimeout(
        function () {

            alert.remove();

        },
        3000
    );

}


/* =========================================================
   LOGOUT
   ========================================================= */

logoutButton.addEventListener(
    "click",
    function () {

        stopMessagePolling();


        localStorage.removeItem(
            "doctor"
        );


        localStorage.removeItem(
            "doctorToken"
        );


        window.location.href =
            "doctor_login.html";

    }
);


/* =========================================================
   CLEANUP
   ========================================================= */

window.addEventListener(
    "beforeunload",
    function () {

        stopMessagePolling();

    }
);