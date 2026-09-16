/* =========================================================
   MEDVISIONAI
   DOCTOR PROFILE
   ========================================================= */


/*
    Backend endpoints expected later:

    GET
    /api/doctor/profile

    PUT
    /api/doctor/profile

    POST
    /api/doctor/profile/photo

*/


const API = {

    profile:
        "/api/doctor/profile/",

    photo:
        "/api/doctor/profile/photo/"

};


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const doctorPhoto =
    document.getElementById(
        "doctorPhoto"
    );

const doctorPhotoIcon =
    document.getElementById(
        "doctorPhotoIcon"
    );

const topDoctorPhoto =
    document.getElementById(
        "topDoctorPhoto"
    );

const topDoctorIcon =
    document.getElementById(
        "topDoctorIcon"
    );

const profileDoctorName =
    document.getElementById(
        "profileDoctorName"
    );

const profileSpecialization =
    document.getElementById(
        "profileSpecialization"
    );

const topDoctorName =
    document.getElementById(
        "topDoctorName"
    );

const photoInput =
    document.getElementById(
        "photoInput"
    );

const logoutButton =
    document.getElementById(
        "logoutButton"
    );

const profileModalElement =
    document.getElementById(
        "profileModal"
    );

const profileModal =
    new bootstrap.Modal(
        profileModalElement
    );


/* =========================================================
   INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadDoctorProfile();

    }
);


/* =========================================================
   LOAD DOCTOR PROFILE
   ========================================================= */

async function loadDoctorProfile() {

    try {

        const response =
            await fetch(
                API.profile,
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
                "Unable to load doctor profile"
            );

        }


        const data =
            await response.json();


        const doctor =
            data.doctor ||
            data;


        displayDoctorProfile(
            doctor
        );

    }

    catch (error) {

        console.error(
            "Profile loading error:",
            error
        );


        /*
            If backend is not connected yet,
            do NOT insert dummy doctor data.

            We only try to use authenticated
            session/localStorage information.
        */

        loadStoredDoctor();

    }

}


/* =========================================================
   LOAD STORED DOCTOR
   ========================================================= */

function loadStoredDoctor() {

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


        displayDoctorProfile(
            doctor
        );

    }

    catch (error) {

        console.error(
            "Stored doctor data error:",
            error
        );

    }

}


/* =========================================================
   DISPLAY PROFILE
   ========================================================= */

function displayDoctorProfile(
    doctor
) {

    if (!doctor) {

        return;

    }


    const fullName =
        doctor.full_name ||
        doctor.name ||
        "";


    const specialization =
        doctor.specialization ||
        "";


    /* Header */

    profileDoctorName.textContent =
        fullName ||
        "Doctor";


    profileSpecialization.textContent =
        specialization ||
        "Specialization not available";


    topDoctorName.textContent =
        fullName ||
        "Doctor";


    /* Professional Information */

    setText(
        "doctorFullName",
        fullName
    );


    setText(
        "doctorId",
        doctor.doctor_id ||
        doctor.id ||
        ""
    );


    setText(
        "doctorSpecialization",
        specialization
    );


    setText(
        "registrationNumber",
        doctor.registration_number ||
        doctor.medical_registration_number ||
        ""
    );


    setText(
        "qualification",
        doctor.qualification ||
        ""
    );


    setText(
        "experience",
        doctor.experience ||
        ""
    );


    /* Contact */

    setText(
        "doctorEmail",
        doctor.email ||
        ""
    );


    setText(
        "doctorPhone",
        doctor.phone ||
        doctor.phone_number ||
        ""
    );


    setText(
        "hospitalName",
        doctor.hospital_name ||
        doctor.organization ||
        ""
    );


    setText(
        "hospitalAddress",
        doctor.hospital_address ||
        doctor.address ||
        ""
    );


    /* Bio */

    setText(
        "doctorBio",
        doctor.bio ||
        "No professional bio available."
    );


    /* Photo */

    if (
        doctor.profile_photo ||
        doctor.photo ||
        doctor.profile_image
    ) {

        const photo =
            doctor.profile_photo ||
            doctor.photo ||
            doctor.profile_image;


        setDoctorPhoto(
            photo
        );

    }

}


/* =========================================================
   SET TEXT
   ========================================================= */

function setText(
    elementId,
    value
) {

    const element =
        document.getElementById(
            elementId
        );


    if (!element) {

        return;

    }


    element.textContent =
        value ||
        "-";

}


/* =========================================================
   SET DOCTOR PHOTO
   ========================================================= */

function setDoctorPhoto(
    photoUrl
) {

    if (!photoUrl) {

        return;

    }


    doctorPhoto.src =
        photoUrl;

    doctorPhoto.hidden =
        false;

    doctorPhotoIcon.hidden =
        true;


    topDoctorPhoto.src =
        photoUrl;

    topDoctorPhoto.hidden =
        false;

    topDoctorIcon.hidden =
        true;

}


/* =========================================================
   PHOTO UPLOAD
   ========================================================= */

photoInput.addEventListener(
    "change",
    async function () {

        const file =
            this.files[0];


        if (!file) {

            return;

        }


        if (
            !file.type.startsWith(
                "image/"
            )
        ) {

            alert(
                "Please select an image file."
            );

            return;

        }


        /*
            Show preview immediately.
        */

        const localUrl =
            URL.createObjectURL(
                file
            );


        setDoctorPhoto(
            localUrl
        );


        /*
            Upload to backend.
        */

        await uploadProfilePhoto(
            file
        );

    }
);


/* =========================================================
   UPLOAD PHOTO
   ========================================================= */

async function uploadProfilePhoto(
    file
) {

    const formData =
        new FormData();


    formData.append(
        "profile_photo",
        file
    );


    try {

        const response =
            await fetch(
                API.photo,
                {

                    method: "POST",

                    body: formData

                }
            );


        if (!response.ok) {

            throw new Error(
                "Photo upload failed"
            );

        }


        const data =
            await response.json();


        if (
            data.photo_url
        ) {

            setDoctorPhoto(
                data.photo_url
            );

        }


    }

    catch (error) {

        console.error(
            "Photo upload error:",
            error
        );

        /*
            Don't remove the preview.
            Backend can be connected later.
        */

    }

}


/* =========================================================
   EDIT PROFESSIONAL INFORMATION
   ========================================================= */

document
    .getElementById(
        "editProfessional"
    )
    .addEventListener(
        "click",
        function () {

            openProfileModal();

        }
    );


/* =========================================================
   EDIT CONTACT
   ========================================================= */

document
    .getElementById(
        "editContact"
    )
    .addEventListener(
        "click",
        function () {

            openProfileModal();

        }
    );


/* =========================================================
   EDIT BIO
   ========================================================= */

document
    .getElementById(
        "editBio"
    )
    .addEventListener(
        "click",
        function () {

            openProfileModal();

        }
    );


/* =========================================================
   OPEN MODAL
   ========================================================= */

function openProfileModal() {

    document.getElementById(
        "editFullName"
    ).value =
        getValue(
            "doctorFullName"
        );


    document.getElementById(
        "editSpecialization"
    ).value =
        getValue(
            "doctorSpecialization"
        );


    document.getElementById(
        "editRegistration"
    ).value =
        getValue(
            "registrationNumber"
        );


    document.getElementById(
        "editQualification"
    ).value =
        getValue(
            "qualification"
        );


    document.getElementById(
        "editExperience"
    ).value =
        getValue(
            "experience"
        );


    document.getElementById(
        "editPhone"
    ).value =
        getValue(
            "doctorPhone"
        );


    document.getElementById(
        "editHospital"
    ).value =
        getValue(
            "hospitalName"
        );


    document.getElementById(
        "editAddress"
    ).value =
        getValue(
            "hospitalAddress"
        );


    const bio =
        document.getElementById(
            "doctorBio"
        );


    document.getElementById(
        "editBioText"
    ).value =
        bio.textContent ===
        "No professional bio available."
            ? ""
            : bio.textContent;


    profileModal.show();

}


/* =========================================================
   GET VALUE
   ========================================================= */

function getValue(
    elementId
) {

    const element =
        document.getElementById(
            elementId
        );


    if (!element) {

        return "";

    }


    const value =
        element.textContent.trim();


    return value === "-"
        ? ""
        : value;

}


/* =========================================================
   SAVE PROFILE
   ========================================================= */

document
    .getElementById(
        "modalSaveButton"
    )
    .addEventListener(
        "click",
        saveProfile
    );


async function saveProfile() {

    const profileData = {

        full_name:
            document.getElementById(
                "editFullName"
            ).value.trim(),

        specialization:
            document.getElementById(
                "editSpecialization"
            ).value.trim(),

        registration_number:
            document.getElementById(
                "editRegistration"
            ).value.trim(),

        qualification:
            document.getElementById(
                "editQualification"
            ).value.trim(),

        experience:
            document.getElementById(
                "editExperience"
            ).value.trim(),

        phone:
            document.getElementById(
                "editPhone"
            ).value.trim(),

        hospital_name:
            document.getElementById(
                "editHospital"
            ).value.trim(),

        hospital_address:
            document.getElementById(
                "editAddress"
            ).value.trim(),

        bio:
            document.getElementById(
                "editBioText"
            ).value.trim()

    };


    try {

        const response =
            await fetch(
                API.profile,
                {

                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            profileData
                        )

                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to save profile"
            );

        }


        const data =
            await response.json();


        const doctor =
            data.doctor ||
            data;


        displayDoctorProfile(
            doctor
        );


        profileModal.hide();


    }

    catch (error) {

        console.error(
            "Profile update error:",
            error
        );


        /*
            Backend is not connected yet.

            We can still update the frontend
            so the UI can be tested.
        */

        displayDoctorProfile(
            profileData
        );


        profileModal.hide();

    }

}


/* =========================================================
   LOGOUT
   ========================================================= */

logoutButton.addEventListener(
    "click",
    function () {

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