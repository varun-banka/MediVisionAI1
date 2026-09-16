"""
MedVisionAI - Patient Views
"""

from datetime import date
from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import (
    Patient,
    PatientAppointment,
    PatientReport,
    PatientMedicine,
    PatientMessage,
    PatientSettings,
    PatientTimelineEntry,
)
from .serializers import (
    PatientSerializer,
    PatientAppointmentSerializer,
    PatientReportSerializer,
    PatientMedicineSerializer,
    PatientMessageSerializer,
    PatientSettingsSerializer,
    PatientTimelineEntrySerializer,
    PatientSignupSerializer,
    PatientLoginSerializer,
)


# =============================================================
# HELPER FUNCTIONS
# =============================================================

def get_patient_from_request(request):
    """Get patient from session."""
    patient_id = request.session.get("patient_id")
    if not patient_id:
        return None

    try:
        return Patient.objects.get(id=patient_id)
    except Patient.DoesNotExist:
        return None


# =============================================================
# AUTH
# =============================================================

@api_view(["POST"])
def patient_signup(request):
    """Register a new patient."""
    serializer = PatientSignupSerializer(data=request.data)
    if serializer.is_valid():
        patient = serializer.save()
        request.session["patient_id"] = patient.id
        return Response(
            {
                "message": "Patient account created successfully.",
                "patient": PatientSerializer(patient).data,
                "redirect_url": "dashboard.html",
            },
            status=status.HTTP_201_CREATED,
        )
    return Response(
        {"message": serializer.errors},
        status=status.HTTP_400_BAD_REQUEST,
    )


@api_view(["POST"])
def patient_login(request):
    """Authenticate patient."""
    serializer = PatientLoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(
            {"message": "Invalid credentials."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    email = serializer.validated_data["email"]
    password = serializer.validated_data["password"]

    patient = Patient.objects.filter(email=email).first()

    if not patient or patient.password != password:
        return Response(
            {"message": "Invalid email or password."},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    if not patient.is_active:
        return Response(
            {"message": "Your account is inactive."},
            status=status.HTTP_403_FORBIDDEN,
        )

    request.session["patient_id"] = patient.id

    return Response(
        {
            "message": "Login successful.",
            "patient": PatientSerializer(patient).data,
            "redirect_url": "dashboard.html",
        }
    )


@api_view(["POST"])
def patient_logout(request):
    """Logout patient."""
    request.session.flush()
    return Response({"message": "Logged out successfully."})


# =============================================================
# PROFILE
# =============================================================

@api_view(["GET", "PUT"])
def patient_profile(request):
    """Get or update patient profile."""
    patient = get_patient_from_request(request)
    if not patient:
        return Response(
            {"message": "Patient not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    if request.method == "GET":
        return Response(PatientSerializer(patient).data)

    serializer = PatientSerializer(patient, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# =============================================================
# APPOINTMENTS
# =============================================================

@api_view(["GET"])
def patient_appointments(request):
    """List appointments for a patient."""
    patient = get_patient_from_request(request)
    if not patient:
        return Response(
            {"message": "Patient not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    appointments = PatientAppointment.objects.filter(patient=patient)
    serializer = PatientAppointmentSerializer(appointments, many=True)
    return Response({"appointments": serializer.data})


# =============================================================
# REPORTS
# =============================================================

@api_view(["GET"])
def patient_reports(request):
    """List reports for a patient."""
    patient = get_patient_from_request(request)
    if not patient:
        return Response(
            {"message": "Patient not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    reports = PatientReport.objects.filter(patient=patient)
    serializer = PatientReportSerializer(reports, many=True)
    return Response({"reports": serializer.data})


# =============================================================
# MEDICINES
# =============================================================

@api_view(["GET"])
def patient_medicines(request):
    """List medicines for a patient."""
    patient = get_patient_from_request(request)
    if not patient:
        return Response(
            {"message": "Patient not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    medicines = PatientMedicine.objects.filter(patient=patient)
    serializer = PatientMedicineSerializer(medicines, many=True)
    return Response({"medicines": serializer.data})


# =============================================================
# MESSAGES
# =============================================================

@api_view(["GET"])
def patient_messages(request):
    """List messages for a patient."""
    patient = get_patient_from_request(request)
    if not patient:
        return Response(
            {"message": "Patient not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    messages = PatientMessage.objects.filter(patient=patient)
    serializer = PatientMessageSerializer(messages, many=True)
    return Response({"messages": serializer.data})


# =============================================================
# TIMELINE
# =============================================================

@api_view(["GET"])
def patient_timeline(request):
    """Get health timeline for a patient."""
    patient = get_patient_from_request(request)
    if not patient:
        return Response(
            {"message": "Patient not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    entries = PatientTimelineEntry.objects.filter(patient=patient)
    serializer = PatientTimelineEntrySerializer(entries, many=True)
    return Response({"timeline": serializer.data})


# =============================================================
# SETTINGS
# =============================================================

@api_view(["GET", "PUT"])
def patient_settings(request):
    """Get or update patient settings."""
    patient = get_patient_from_request(request)
    if not patient:
        return Response(
            {"message": "Patient not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    settings, _ = PatientSettings.objects.get_or_create(patient=patient)

    if request.method == "GET":
        return Response(PatientSettingsSerializer(settings).data)

    serializer = PatientSettingsSerializer(settings, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def patient_change_password(request):
    """Change patient password."""
    patient = get_patient_from_request(request)
    if not patient:
        return Response(
            {"message": "Patient not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    current_password = request.data.get("current_password")
    new_password = request.data.get("new_password")

    if not current_password or not new_password:
        return Response(
            {"message": "Current and new password are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if patient.password != current_password:
        return Response(
            {"message": "Current password is incorrect."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    patient.password = new_password
    patient.save()

    return Response({"message": "Password updated successfully."})


# =============================================================
# DASHBOARD
# =============================================================

@api_view(["GET"])
def patient_dashboard(request):
    """Get patient dashboard data."""
    patient = get_patient_from_request(request)
    if not patient:
        return Response(
            {"message": "Patient not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    today = date.today()

    upcoming_appointments = PatientAppointment.objects.filter(
        patient=patient, appointment_date__gte=today, status__in=["scheduled", "confirmed"]
    ).count()

    total_reports = PatientReport.objects.filter(patient=patient).count()
    active_medicines = PatientMedicine.objects.filter(patient=patient, status="Active").count()
    unread_messages = PatientMessage.objects.filter(patient=patient, is_read=False).count()

    data = {
        "name": patient.name,
        "patient_id": patient.patient_id,
        "upcoming_appointments": upcoming_appointments,
        "total_reports": total_reports,
        "active_medicines": active_medicines,
        "unread_messages": unread_messages,
    }

    return Response(data)


@api_view(["GET"])
def patient_list(request):
    """List all patients (public)."""
    patients = Patient.objects.filter(is_active=True)
    serializer = PatientSerializer(patients, many=True)
    return Response(serializer.data)