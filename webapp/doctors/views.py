"""
MedVisionAI - Doctor Views
"""

from datetime import date

from django.contrib.auth.hashers import make_password, check_password
from django.db.models import Count
from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import (
    Doctor,
    DoctorPatient,
    ClinicalTrial,
    DoctorAppointment,
    Prescription,
    DoctorReport,
    DoctorSettings,
    DoctorSession,
    Conversation,
    ChatMessage,
    HealthTimelineEntry,
)

from .serializers import (
    DoctorSerializer,
    DoctorPublicSerializer,
    DoctorPatientSerializer,
    ClinicalTrialSerializer,
    DoctorAppointmentSerializer,
    PrescriptionSerializer,
    DoctorReportSerializer,
    DoctorSettingsSerializer,
    DoctorSessionSerializer,
    ConversationSerializer,
    ChatMessageSerializer,
    HealthTimelineEntrySerializer,
    DoctorSignupSerializer,
    DoctorLoginSerializer,
)


# =============================================================
# HELPER FUNCTIONS
# =============================================================

def get_doctor_from_request(request):
    """Get doctor from Django session."""

    doctor_id = request.session.get("doctor_id")

    if not doctor_id:
        return None

    try:
        return Doctor.objects.get(id=doctor_id)
    except Doctor.DoesNotExist:
        return None


# =============================================================
# AUTH
# =============================================================

@api_view(["POST"])
def doctor_signup(request):
    """
    Register a new doctor.

    Flow:
    Frontend
        ↓
    POST /doctor/signup/
        ↓
    Serializer validation
        ↓
    Password hashing
        ↓
    Doctor saved to PostgreSQL
        ↓
    Django session created
    """

    serializer = DoctorSignupSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(
            {
                "message": "Signup failed.",
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        doctor = serializer.save()

        # -----------------------------------------------------
        # IMPORTANT
        # Password should be stored as a HASH.
        # -----------------------------------------------------

        # If serializer created the doctor with a plain password,
        # hash it before saving.
        #
        # We check whether it already looks like a Django hash.
        # This prevents accidentally hashing an already-hashed value.
        if doctor.password and not doctor.password.startswith(
            ("pbkdf2_", "argon2$", "bcrypt", "scrypt")
        ):
            doctor.password = make_password(doctor.password)
            doctor.save(update_fields=["password"])

        # -----------------------------------------------------
        # Create doctor settings if they don't already exist
        # -----------------------------------------------------

        DoctorSettings.objects.get_or_create(
            doctor=doctor
        )

        # -----------------------------------------------------
        # Create Django session
        # -----------------------------------------------------

        request.session["doctor_id"] = doctor.id
        request.session["doctor_email"] = doctor.email

        request.session.save()

        return Response(
            {
                "message": "Doctor account created successfully.",
                "doctor": DoctorSerializer(doctor).data,
                "redirect_url": "doctor_login.html",
            },
            status=status.HTTP_201_CREATED,
        )

    except Exception as e:
        return Response(
            {
                "message": "Unable to create doctor account.",
                "error": str(e),
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["POST"])
def doctor_login(request):
    """
    Authenticate doctor.

    Flow:
    Frontend
        ↓
    POST /doctor/login/
        ↓
    Find doctor using email
        ↓
    Check hashed password
        ↓
    Create Django session
        ↓
    Login successful
    """

    serializer = DoctorLoginSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(
            {
                "message": "Invalid login data.",
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    email = serializer.validated_data["email"].strip().lower()
    password = serializer.validated_data["password"]

    remember_me = serializer.validated_data.get(
        "remember_me",
        False
    )

    # ---------------------------------------------------------
    # Find doctor in PostgreSQL
    # ---------------------------------------------------------

    doctor = Doctor.objects.filter(
        email__iexact=email
    ).first()

    if not doctor:
        return Response(
            {
                "message": "Invalid email or password."
            },
            status=status.HTTP_401_UNAUTHORIZED,
        )

    # ---------------------------------------------------------
    # Check account status
    # ---------------------------------------------------------

    if not doctor.is_active:
        return Response(
            {
                "message": (
                    "Your account is inactive. "
                    "Please contact the hospital."
                )
            },
            status=status.HTTP_403_FORBIDDEN,
        )

    # ---------------------------------------------------------
    # Check password
    #
    # IMPORTANT:
    # check_password() compares:
    #
    # entered password
    #       ↓
    # hashed password stored in PostgreSQL
    # ---------------------------------------------------------

    password_valid = check_password(
        password,
        doctor.password
    )

    if not password_valid:
        return Response(
            {
                "message": "Invalid email or password."
            },
            status=status.HTTP_401_UNAUTHORIZED,
        )

    # ---------------------------------------------------------
    # Create Django session
    # ---------------------------------------------------------

    request.session["doctor_id"] = doctor.id
    request.session["doctor_email"] = doctor.email

    # Remember me
    if remember_me:
        # Session lasts until browser/session is explicitly
        # cleared or Django session expiry configuration applies.
        request.session.set_expiry(60 * 60 * 24 * 30)
    else:
        # Browser-session cookie
        request.session.set_expiry(0)

    request.session.save()

    # ---------------------------------------------------------
    # Create DoctorSession database record
    # ---------------------------------------------------------

    doctor_session = DoctorSession.objects.create(
        doctor=doctor,
        session_key=request.session.session_key or "",
        ip_address=request.META.get("REMOTE_ADDR"),
        user_agent=request.META.get(
            "HTTP_USER_AGENT",
            ""
        )[:500],
        is_active=True,
    )

    return Response(
        {
            "message": "Login successful. Redirecting...",
            "doctor": DoctorSerializer(doctor).data,
            "session_id": doctor_session.id,
            "redirect_url": "doctor_dashboard.html",
        },
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
def doctor_logout(request):
    """Logout doctor."""

    doctor_id = request.session.get("doctor_id")

    if doctor_id:

        DoctorSession.objects.filter(
            doctor_id=doctor_id,
            is_active=True
        ).update(
            is_active=False
        )

    request.session.flush()

    return Response(
        {
            "message": "Logged out successfully.",
            "redirect_url": "doctor_login.html",
        },
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
def doctor_forgot_password(request):
    """Doctor forgot password endpoint."""

    email = request.data.get("email")

    if not email:
        return Response(
            {
                "message": "Email is required."
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    email = email.strip().lower()

    doctor = Doctor.objects.filter(
        email__iexact=email
    ).first()

    if not doctor:
        return Response(
            {
                "message": "No account found with this email."
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    return Response(
        {
            "message": (
                "Password reset instructions sent "
                "to your email."
            )
        },
        status=status.HTTP_200_OK,
    )


# =============================================================
# PROFILE
# =============================================================

@api_view(["GET", "PUT"])
def doctor_profile(request):
    """Get or update doctor profile."""

    doctor = get_doctor_from_request(request)

    if not doctor:
        return Response(
            {
                "message": "Doctor not found."
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    if request.method == "GET":
        return Response(
            DoctorSerializer(doctor).data
        )

    serializer = DoctorSerializer(
        doctor,
        data=request.data,
        partial=True
    )

    if serializer.is_valid():

        serializer.save()

        return Response(
            {
                "doctor": serializer.data
            }
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST,
    )


@api_view(["POST"])
def doctor_profile_photo(request):
    """Upload doctor profile photo."""

    doctor = get_doctor_from_request(request)

    if not doctor:
        return Response(
            {
                "message": "Doctor not found."
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    photo = request.FILES.get(
        "profile_photo"
    )

    if not photo:
        return Response(
            {
                "message": "No photo provided."
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    doctor.profile_photo = photo
    doctor.save()

    return Response(
        {
            "photo_url": (
                doctor.profile_photo.url
                if doctor.profile_photo
                else ""
            ),
            "message": "Photo uploaded successfully.",
        }
    )


# =============================================================
# DASHBOARD
# =============================================================

@api_view(["GET"])
def doctor_dashboard(request):
    """Get doctor dashboard data."""

    doctor = get_doctor_from_request(request)

    if not doctor:
        return Response(
            {
                "message": "Doctor not found."
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    today = date.today()

    total_patients = DoctorPatient.objects.filter(
        doctor=doctor
    ).count()

    today_appointments = DoctorAppointment.objects.filter(
        doctor=doctor,
        date=today
    ).count()

    pending_reports = DoctorReport.objects.filter(
        doctor=doctor,
        status="Pending"
    ).count()

    unread_messages = (
        Conversation.objects.filter(
            doctor=doctor,
            unread_count__gt=0
        )
        .aggregate(
            total=Count("id")
        )["total"]
        or 0
    )

    appointments = DoctorAppointment.objects.filter(
        doctor=doctor,
        date__gte=today
    )[:5]

    recent_patients = DoctorPatient.objects.filter(
        doctor=doctor
    )[:5]

    recent_reports = DoctorReport.objects.filter(
        doctor=doctor
    )[:10]

    data = {
        "total_patients": total_patients,
        "today_appointments": today_appointments,
        "pending_reports": pending_reports,
        "unread_messages": unread_messages,

        "appointments": DoctorAppointmentSerializer(
            appointments,
            many=True
        ).data,

        "recent_patients": DoctorPatientSerializer(
            recent_patients,
            many=True
        ).data,

        "recent_reports": DoctorReportSerializer(
            recent_reports,
            many=True
        ).data,
    }

    return Response(data)


# =============================================================
# APPOINTMENTS
# =============================================================

@api_view(["GET"])
def doctor_appointments(request):
    """List doctor appointments."""

    doctor = get_doctor_from_request(request)

    if not doctor:
        return Response(
            {
                "message": "Doctor not found."
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    appointment_date = request.GET.get("date")
    status_filter = request.GET.get("status")

    appointments = DoctorAppointment.objects.filter(
        doctor=doctor
    )

    if appointment_date:
        appointments = appointments.filter(
            date=appointment_date
        )

    if status_filter:
        appointments = appointments.filter(
            status=status_filter
        )

    serializer = DoctorAppointmentSerializer(
        appointments,
        many=True
    )

    return Response(
        {
            "appointments": serializer.data
        }
    )


# =============================================================
# PATIENTS
# =============================================================

@api_view(["GET"])
def doctor_patients(request):
    """List patients assigned to a doctor."""

    doctor = get_doctor_from_request(request)

    if not doctor:
        return Response(
            {
                "message": "Doctor not found."
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    patients = DoctorPatient.objects.filter(
        doctor=doctor
    )

    total = patients.count()

    active = patients.filter(
        status="Active"
    ).count()

    upcoming = DoctorAppointment.objects.filter(
        doctor=doctor,
        date__gte=date.today(),
        status__in=[
            "scheduled",
            "confirmed"
        ]
    ).count()

    reports_to_review = DoctorReport.objects.filter(
        doctor=doctor,
        status="Pending"
    ).count()

    data = {
        "patients": DoctorPatientSerializer(
            patients,
            many=True
        ).data,

        "total_patients": total,

        "active_patients": active,

        "upcoming_appointments": upcoming,

        "reports_to_review": reports_to_review,
    }

    return Response(data)


@api_view(["GET"])
def doctor_patient_detail(request, patient_id):
    """Get patient details for a doctor."""

    doctor = get_doctor_from_request(request)

    if not doctor:
        return Response(
            {
                "message": "Doctor not found."
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    patient = get_object_or_404(
        DoctorPatient,
        id=patient_id,
        doctor=doctor
    )

    return Response(
        DoctorPatientSerializer(patient).data
    )


@api_view(["GET"])
def doctor_patient_trials(request, patient_id):
    """Get clinical trials for a patient."""

    doctor = get_doctor_from_request(request)

    if not doctor:
        return Response(
            {
                "message": "Doctor not found."
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    patient = get_object_or_404(
        DoctorPatient,
        id=patient_id,
        doctor=doctor
    )

    trials = ClinicalTrial.objects.filter(
        patient=patient
    )

    return Response(
        {
            "trials": ClinicalTrialSerializer(
                trials,
                many=True
            ).data
        }
    )


@api_view(["GET"])
def doctor_patient_health_timeline(request, patient_id):
    """Get health timeline for a patient."""

    doctor = get_doctor_from_request(request)

    if not doctor:
        return Response(
            {
                "message": "Doctor not found."
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    patient = get_object_or_404(
        DoctorPatient,
        id=patient_id,
        doctor=doctor
    )

    entries = HealthTimelineEntry.objects.filter(
        patient_id=patient.patient_id
    )

    return Response(
        HealthTimelineEntrySerializer(
            entries,
            many=True
        ).data
    )


# =============================================================
# MEDICINES / PRESCRIPTIONS
# =============================================================

@api_view(["GET", "POST"])
def doctor_medicines(request):
    """List or create prescriptions."""

    doctor = get_doctor_from_request(request)

    if not doctor:
        return Response(
            {
                "message": "Doctor not found."
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    if request.method == "GET":

        prescriptions = Prescription.objects.filter(
            doctor=doctor
        )

        return Response(
            PrescriptionSerializer(
                prescriptions,
                many=True
            ).data
        )

    data = request.data.copy()

    data["doctor"] = doctor.id

    patient_id = data.get("patient_id")

    if patient_id:

        patient = DoctorPatient.objects.filter(
            id=patient_id,
            doctor=doctor
        ).first()

        if patient:

            data["patient"] = patient.id
            data["patient_name"] = patient.name

        else:

            return Response(
                {
                    "message": (
                        "Patient not found for "
                        "this doctor."
                    )
                },
                status=status.HTTP_404_NOT_FOUND,
            )

    trial_id = data.get("trial_id")

    if trial_id:

        trial = ClinicalTrial.objects.filter(
            id=trial_id,
            doctor=doctor
        ).first()

        if trial:

            data["trial"] = trial.id
            data["trial_id"] = trial.id
            data["trial_name"] = trial.name

    serializer = PrescriptionSerializer(
        data=data
    )

    if serializer.is_valid():

        serializer.save()

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST,
    )


@api_view(["DELETE"])
def doctor_medicine_detail(request, medicine_id):
    """Delete a prescription."""

    doctor = get_doctor_from_request(request)

    if not doctor:
        return Response(
            {
                "message": "Doctor not found."
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    prescription = get_object_or_404(
        Prescription,
        id=medicine_id,
        doctor=doctor
    )

    prescription.delete()

    return Response(
        status=status.HTTP_204_NO_CONTENT
    )


# =============================================================
# REPORTS
# =============================================================

@api_view(["GET"])
def doctor_reports(request):
    """List reports for a doctor."""

    doctor = get_doctor_from_request(request)

    if not doctor:
        return Response(
            {
                "message": "Doctor not found."
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    reports = DoctorReport.objects.filter(
        doctor=doctor
    )

    serializer = DoctorReportSerializer(
        reports,
        many=True
    )

    today = date.today()

    data = {
        "reports": serializer.data,

        "total_reports": reports.count(),

        "pending_reports": reports.filter(
            status="Pending"
        ).count(),

        "reviewed_reports": reports.filter(
            status="Reviewed"
        ).count(),

        "today_reports": reports.filter(
            uploaded_at__date=today
        ).count(),
    }

    return Response(data)


@api_view(["POST"])
def doctor_report_upload(request):
    """Upload a medical report."""

    doctor = get_doctor_from_request(request)

    if not doctor:
        return Response(
            {
                "message": "Doctor not found."
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    patient_id = request.data.get(
        "patient_id"
    )

    trial_id = request.data.get(
        "trial_id"
    )

    report_type = request.data.get(
        "report_type",
        "Medical Report"
    )

    report_name = request.data.get(
        "report_name",
        ""
    )

    doctor_notes = request.data.get(
        "doctor_notes",
        ""
    )

    report_file = request.FILES.get(
        "report_file"
    )

    if not patient_id:
        return Response(
            {
                "message": "Patient ID is required."
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    patient = DoctorPatient.objects.filter(
        id=patient_id,
        doctor=doctor
    ).first()

    if not patient:
        return Response(
            {
                "message": "Patient not found."
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    trial_name = ""

    if trial_id:

        trial = ClinicalTrial.objects.filter(
            id=trial_id,
            doctor=doctor
        ).first()

        if trial:
            trial_name = trial.name

    report = DoctorReport.objects.create(
        doctor=doctor,
        patient_name=patient.name,
        patient_id=patient.patient_id,
        report_name=report_name,
        report_type=report_type,
        trial=trial_name,
        uploaded_by=doctor.name,
        file=report_file,
        file_url=(
            report_file.url
            if report_file
            else ""
        ),
        file_type=(
            report_file.content_type
            if report_file
            else ""
        ),
    )

    if doctor_notes:
        report.description = doctor_notes
        report.save()

    return Response(
        {
            "message": (
                "Medical report uploaded "
                "successfully."
            ),
            "report": DoctorReportSerializer(
                report
            ).data,
        },
        status=status.HTTP_201_CREATED,
    )


# =============================================================
# MESSAGES / CONVERSATIONS
# =============================================================

@api_view(["GET"])
def doctor_conversations(request):
    """List conversations for a doctor."""

    doctor = get_doctor_from_request(request)

    if not doctor:
        return Response(
            {
                "message": "Doctor not found."
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    conversations = Conversation.objects.filter(
        doctor=doctor
    )

    return Response(
        ConversationSerializer(
            conversations,
            many=True
        ).data
    )


@api_view(["GET", "POST"])
def doctor_conversation_messages(
    request,
    conversation_id
):
    """Get or send messages in a conversation."""

    doctor = get_doctor_from_request(request)

    if not doctor:
        return Response(
            {
                "message": "Doctor not found."
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    conversation = get_object_or_404(
        Conversation,
        id=conversation_id,
        doctor=doctor
    )

    if request.method == "GET":

        messages = ChatMessage.objects.filter(
            conversation=conversation
        )

        messages.filter(
            sender="patient",
            read=False
        ).update(
            read=True
        )

        conversation.unread_count = 0
        conversation.save()

        return Response(
            ChatMessageSerializer(
                messages,
                many=True
            ).data
        )

    data = request.data.copy()

    data["conversation"] = conversation.id
    data["sender"] = "doctor"

    serializer = ChatMessageSerializer(
        data=data
    )

    if serializer.is_valid():

        message = serializer.save()

        conversation.last_message = message.message
        conversation.last_message_time = (
            message.created_at
        )

        conversation.save()

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST,
    )


@api_view(["POST"])
def doctor_conversation_attachment(
    request,
    conversation_id
):
    """Upload attachment to conversation."""

    doctor = get_doctor_from_request(request)

    if not doctor:
        return Response(
            {
                "message": "Doctor not found."
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    conversation = get_object_or_404(
        Conversation,
        id=conversation_id,
        doctor=doctor
    )

    file = request.FILES.get(
        "attachment"
    )

    if not file:
        return Response(
            {
                "message": "No attachment provided."
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    attachment = {
        "name": file.name,
        "size": file.size,
        "content_type": file.content_type,
    }

    return Response(
        {
            "attachment_id": str(
                conversation.id
            ),
            "attachment": attachment,
            "message": (
                "Attachment uploaded "
                "successfully."
            ),
        }
    )


@api_view(["PUT"])
def doctor_message_read(
    request,
    message_id
):
    """Mark a message as read."""

    message = ChatMessage.objects.filter(
        id=message_id
    ).first()

    if not message:
        return Response(
            {
                "message": "Message not found."
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    message.read = True
    message.save()

    if message.conversation:

        message.conversation.unread_count = 0

        message.conversation.save()

    return Response(
        {
            "message": "Message marked as read."
        }
    )


# =============================================================
# SETTINGS
# =============================================================

@api_view(["GET", "PUT"])
def doctor_settings(request):
    """Get or update doctor settings."""

    doctor = get_doctor_from_request(request)

    if not doctor:
        return Response(
            {
                "message": "Doctor not found."
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    settings, _ = DoctorSettings.objects.get_or_create(
        doctor=doctor
    )

    if request.method == "GET":

        return Response(
            {
                "settings": DoctorSettingsSerializer(
                    settings
                ).data
            }
        )

    serializer = DoctorSettingsSerializer(
        settings,
        data=request.data,
        partial=True
    )

    if serializer.is_valid():

        serializer.save()

        return Response(
            {
                "settings": serializer.data
            }
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST,
    )


# =============================================================
# SESSIONS
# =============================================================

@api_view(["GET"])
def doctor_sessions(request):
    """List active and inactive sessions for the logged-in doctor."""

    doctor = get_doctor_from_request(request)

    if not doctor:
        return Response(
            {
                "message": "Doctor not found."
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    sessions = DoctorSession.objects.filter(
        doctor=doctor
    )

    return Response(
        {
            "sessions": DoctorSessionSerializer(
                sessions,
                many=True
            ).data
        }
    )


# =============================================================
# PUBLIC
# =============================================================

@api_view(["GET"])
def doctor_list(request):
    """List active doctors for public directory use."""

    doctors = Doctor.objects.filter(
        is_active=True
    )

    return Response(
        DoctorPublicSerializer(
            doctors,
            many=True
        ).data
    )


# =============================================================
# CHANGE PASSWORD
# =============================================================

@api_view(["POST"])
def doctor_change_password(request):
    """Change doctor password."""

    doctor = get_doctor_from_request(request)

    if not doctor:
        return Response(
            {
                "message": "Doctor not found."
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    current_password = request.data.get(
        "current_password"
    )

    new_password = request.data.get(
        "new_password"
    )

    if not current_password or not new_password:
        return Response(
            {
                "message": (
                    "Current and new password "
                    "are required."
                )
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Check current hashed password
    if not check_password(
        current_password,
        doctor.password
    ):
        return Response(
            {
                "message": (
                    "Current password is incorrect."
                )
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Hash new password
    doctor.password = make_password(
        new_password
    )

    doctor.save(
        update_fields=["password"]
    )

    return Response(
        {
            "message": (
                "Password changed successfully."
            )
        },
        status=status.HTTP_200_OK,
    )