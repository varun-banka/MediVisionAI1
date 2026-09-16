"""
MedVisionAI - Hospital Views
"""

import uuid
from datetime import date

from django.db.models import Count, Q
from django.http import FileResponse
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import (
    Hospital,
    HospitalDoctor,
    HospitalPatient,
    HospitalAppointment,
    Medicine,
    Message,
    MedicalReport,
    HospitalActivity,
    HospitalSettings,
)
from .serializers import (
    HospitalSerializer,
    HospitalPublicSerializer,
    HospitalDoctorSerializer,
    HospitalPatientSerializer,
    HospitalAppointmentSerializer,
    MedicineSerializer,
    MessageSerializer,
    MedicalReportSerializer,
    HospitalActivitySerializer,
    HospitalSettingsSerializer,
    HospitalSignupSerializer,
    HospitalLoginSerializer,
)
from doctors.models import Doctor, DoctorPatient


# =============================================================
# HELPER FUNCTIONS
# =============================================================

def get_hospital_from_request(request):
    """Get hospital from session or query param."""
    hospital_id = request.session.get("hospital_id")
    if not hospital_id:
        hospital_id = request.GET.get("hospital_id")
    if not hospital_id:
        hospital_id = request.data.get("hospital_id") if hasattr(request, "data") else None

    if not hospital_id:
        return None

    try:
        return Hospital.objects.get(id=hospital_id)
    except Hospital.DoesNotExist:
        return None


def generate_patient_id(hospital):
    """Generate unique patient ID."""
    count = HospitalPatient.objects.filter(hospital=hospital).count() + 1
    return f"PAT{count:03d}"


def generate_appointment_id(hospital):
    """Generate unique appointment ID."""
    count = HospitalAppointment.objects.filter(hospital=hospital).count() + 1
    return f"APT{count:03d}"


def generate_report_id(hospital):
    """Generate unique report ID."""
    count = MedicalReport.objects.filter(hospital=hospital).count() + 1
    return f"REP{count:03d}"


def sync_patient_to_doctor(patient, doctor_value):
    """Mirror a hospital assignment into the doctor's patient list."""

    doctor_value = (doctor_value or "").strip()

    if not doctor_value or doctor_value.lower() == "not assigned":
        return None

    doctor = Doctor.objects.filter(
        email__iexact=doctor_value
    ).first()

    if not doctor:
        doctor = Doctor.objects.filter(
            name__iexact=doctor_value
        ).first()

    if not doctor:
        doctor = Doctor.objects.filter(
            full_name__iexact=doctor_value
        ).first()

    if not doctor:
        return None

    doctor_patient, _ = DoctorPatient.objects.update_or_create(
        doctor=doctor,
        patient_code=patient.patient_id,
        defaults={
            "patient_ref": None,
            "name": patient.name,
            "gender": patient.gender,
            "age": patient.age,
            "condition": "",
            "status": "Active" if patient.status == "Active" else "Inactive",
        },
    )

    return doctor_patient


def log_activity(hospital, title, description="", activity_type=""):
    """Create an activity log entry."""
    HospitalActivity.objects.create(
        hospital=hospital,
        title=title,
        description=description,
        activity_type=activity_type,
    )


# =============================================================
# AUTH
# =============================================================

@api_view(["POST"])
def hospital_signup(request):
    """Register a new hospital."""
    serializer = HospitalSignupSerializer(data=request.data)
    if serializer.is_valid():
        hospital = serializer.save()
        request.session["hospital_id"] = hospital.id
        return Response(
            {
                "message": "Hospital registered successfully.",
                "hospital": HospitalSerializer(hospital).data,
                "redirect_url": "hospital_dashboard.html",
            },
            status=status.HTTP_201_CREATED,
        )
    return Response(
        {"message": serializer.errors},
        status=status.HTTP_400_BAD_REQUEST,
    )


@api_view(["POST"])
def hospital_login(request):
    """Authenticate hospital."""
    serializer = HospitalLoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(
            {"message": "Invalid credentials."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    username = serializer.validated_data["username"]
    password = serializer.validated_data["password"]

    hospital = Hospital.objects.filter(
        Q(username=username) | Q(email=username)
    ).first()

    if not hospital or hospital.password != password:
        return Response(
            {"message": "Invalid username or password."},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    request.session["hospital_id"] = hospital.id

    log_activity(hospital, "Hospital Login", f"{hospital.hospital_name} logged in.", "auth")

    return Response(
        {
            "message": "Login successful.",
            "hospital": HospitalSerializer(hospital).data,
            "redirect_url": "hospital_dashboard.html",
        }
    )


@api_view(["POST"])
def hospital_logout(request):
    """Logout hospital."""
    request.session.flush()
    return Response({"message": "Logged out successfully."})


# =============================================================
# DASHBOARD
# =============================================================

@api_view(["GET"])
def hospital_dashboard(request):
    """Get hospital dashboard statistics."""
    hospital = get_hospital_from_request(request)
    if not hospital:
        return Response(
            {"message": "Hospital not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    today = date.today()

    data = {
        "total_doctors": HospitalDoctor.objects.filter(hospital=hospital).count(),
        "total_patients": HospitalPatient.objects.filter(hospital=hospital).count(),
        "today_appointments": HospitalAppointment.objects.filter(
            hospital=hospital, date=today
        ).count(),
        "total_reports": MedicalReport.objects.filter(hospital=hospital).count(),
        "hospital_name": hospital.hospital_name,
    }

    return Response(data)


@api_view(["GET"])
def hospital_activity(request):
    """Get recent hospital activities."""
    hospital = get_hospital_from_request(request)
    if not hospital:
        return Response({"activities": []})

    activities = HospitalActivity.objects.filter(hospital=hospital)[:10]
    serializer = HospitalActivitySerializer(activities, many=True)
    return Response({"activities": serializer.data})


# =============================================================
# PROFILE
# =============================================================

@api_view(["GET", "PUT"])
def hospital_profile(request):
    """Get or update hospital profile."""
    hospital = get_hospital_from_request(request)
    if not hospital:
        return Response(
            {"message": "Hospital not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    if request.method == "GET":
        return Response(HospitalSerializer(hospital).data)

    serializer = HospitalSerializer(hospital, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        log_activity(hospital, "Profile Updated", "Hospital profile was updated.", "profile")
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# =============================================================
# DOCTORS
# =============================================================

@api_view(["GET", "POST"])
def hospital_doctors(request):
    """List or create doctors for a hospital."""
    hospital = get_hospital_from_request(request)
    if not hospital:
        return Response(
            {"message": "Hospital not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    if request.method == "GET":
        doctors = HospitalDoctor.objects.filter(hospital=hospital)
        serializer = HospitalDoctorSerializer(doctors, many=True)
        return Response(serializer.data)

    data = request.data.copy()
    data["hospital"] = hospital.id
    serializer = HospitalDoctorSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        log_activity(
            hospital,
            "Doctor Added",
            f"Doctor {serializer.data['name']} was added.",
            "doctor",
        )
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
def hospital_doctor_detail(request, doctor_id):
    """Get, update, or delete a specific doctor."""
    hospital = get_hospital_from_request(request)
    if not hospital:
        return Response(
            {"message": "Hospital not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    doctor = get_object_or_404(HospitalDoctor, id=doctor_id, hospital=hospital)

    if request.method == "GET":
        return Response(HospitalDoctorSerializer(doctor).data)

    if request.method == "PUT":
        serializer = HospitalDoctorSerializer(doctor, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            log_activity(hospital, "Doctor Updated", f"Doctor {doctor.name} was updated.", "doctor")
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    doctor.delete()
    log_activity(hospital, "Doctor Removed", f"Doctor {doctor.name} was removed.", "doctor")
    return Response(status=status.HTTP_204_NO_CONTENT)


# =============================================================
# PATIENTS
# =============================================================

@api_view(["GET", "POST"])
def hospital_patients(request):
    """List or create patients for a hospital."""
    hospital = get_hospital_from_request(request)
    if not hospital:
        return Response(
            {"message": "Hospital not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    if request.method == "GET":
        patients = HospitalPatient.objects.filter(hospital=hospital)
        serializer = HospitalPatientSerializer(patients, many=True)
        return Response(serializer.data)

    data = request.data.copy()
    data["hospital"] = hospital.id
    if not data.get("patient_id"):
        data["patient_id"] = generate_patient_id(hospital)

    serializer = HospitalPatientSerializer(data=data)
    if serializer.is_valid():
        patient = serializer.save()
        sync_patient_to_doctor(patient, patient.doctor)
        log_activity(
            hospital,
            "Patient Registered",
            f"Patient {serializer.data['name']} was registered.",
            "patient",
        )
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
def hospital_patient_detail(request, patient_id):
    """Get, update, or delete a specific patient."""
    hospital = get_hospital_from_request(request)
    if not hospital:
        return Response(
            {"message": "Hospital not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    patient = get_object_or_404(HospitalPatient, id=patient_id, hospital=hospital)

    if request.method == "GET":
        return Response(HospitalPatientSerializer(patient).data)

    if request.method == "PUT":
        serializer = HospitalPatientSerializer(patient, data=request.data, partial=True)
        if serializer.is_valid():
            patient = serializer.save()
            sync_patient_to_doctor(patient, patient.doctor)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    patient.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


# =============================================================
# APPOINTMENTS
# =============================================================

@api_view(["GET", "POST"])
def hospital_appointments(request):
    """List or create appointments for a hospital."""
    hospital = get_hospital_from_request(request)
    if not hospital:
        return Response(
            {"message": "Hospital not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    if request.method == "GET":
        appointments = HospitalAppointment.objects.filter(hospital=hospital)
        serializer = HospitalAppointmentSerializer(appointments, many=True)
        return Response(serializer.data)

    data = request.data.copy()
    data["hospital"] = hospital.id
    if not data.get("appointment_id"):
        data["appointment_id"] = generate_appointment_id(hospital)

    serializer = HospitalAppointmentSerializer(data=data)
    if serializer.is_valid():
        appointment = serializer.save()
        patient = HospitalPatient.objects.filter(
            hospital=hospital
        ).filter(
            Q(patient_id=appointment.patient)
            | Q(name__iexact=appointment.patient)
        ).first()

        if patient:
            patient.doctor = appointment.doctor
            patient.save(update_fields=["doctor", "updated_at"])
            sync_patient_to_doctor(patient, appointment.doctor)

        log_activity(
            hospital,
            "Appointment Created",
            f"Appointment for {serializer.data['patient']} was created.",
            "appointment",
        )
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
def hospital_appointment_detail(request, appointment_id):
    """Get, update, or delete a specific appointment."""
    hospital = get_hospital_from_request(request)
    if not hospital:
        return Response(
            {"message": "Hospital not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    appointment = get_object_or_404(HospitalAppointment, id=appointment_id, hospital=hospital)

    if request.method == "GET":
        return Response(HospitalAppointmentSerializer(appointment).data)

    if request.method == "PUT":
        serializer = HospitalAppointmentSerializer(appointment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    appointment.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET"])
def hospital_appointments_recent(request):
    """Get recent appointments for dashboard."""
    hospital = get_hospital_from_request(request)
    if not hospital:
        return Response({"appointments": []})

    appointments = HospitalAppointment.objects.filter(hospital=hospital)[:5]
    serializer = HospitalAppointmentSerializer(appointments, many=True)
    return Response({"appointments": serializer.data})


# =============================================================
# REPORTS
# =============================================================

@api_view(["GET"])
def hospital_reports(request):
    """List reports for a hospital."""
    hospital = get_hospital_from_request(request)
    if not hospital:
        return Response({"reports": []})

    reports = MedicalReport.objects.filter(hospital=hospital)
    serializer = MedicalReportSerializer(reports, many=True)
    return Response({"reports": serializer.data})


@api_view(["GET"])
def hospital_report_download(request, report_id):
    """Download a specific report file."""
    hospital = get_hospital_from_request(request)
    if not hospital:
        return Response(
            {"message": "Hospital not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    report = get_object_or_404(MedicalReport, id=report_id, hospital=hospital)

    if report.file:
        return FileResponse(report.file.open("rb"), as_attachment=True)

    return Response(
        {"message": "Report file not available."},
        status=status.HTTP_404_NOT_FOUND,
    )


# =============================================================
# MEDICINES
# =============================================================

@api_view(["GET", "POST"])
def hospital_medicines(request):
    """List or create medicines for a hospital."""
    hospital = get_hospital_from_request(request)
    if not hospital:
        return Response(
            {"message": "Hospital not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    if request.method == "GET":
        medicines = Medicine.objects.filter(hospital=hospital)
        serializer = MedicineSerializer(medicines, many=True)
        return Response(serializer.data)

    data = request.data.copy()
    data["hospital"] = hospital.id
    serializer = MedicineSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
def hospital_medicine_detail(request, medicine_id):
    """Get, update, or delete a specific medicine."""
    hospital = get_hospital_from_request(request)
    if not hospital:
        return Response(
            {"message": "Hospital not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    medicine = get_object_or_404(Medicine, id=medicine_id, hospital=hospital)

    if request.method == "GET":
        return Response(MedicineSerializer(medicine).data)

    if request.method == "PUT":
        serializer = MedicineSerializer(medicine, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    medicine.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


# =============================================================
# MESSAGES
# =============================================================

@api_view(["GET", "POST"])
def hospital_messages(request):
    """List or send messages for a hospital."""
    hospital = get_hospital_from_request(request)
    if not hospital:
        return Response(
            {"message": "Hospital not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    if request.method == "GET":
        messages = Message.objects.filter(hospital=hospital)
        serializer = MessageSerializer(messages, many=True)
        return Response({"messages": serializer.data})

    data = request.data.copy()
    data["hospital"] = hospital.id
    if not data.get("sender_name"):
        data["sender_name"] = hospital.hospital_name

    serializer = MessageSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# =============================================================
# SETTINGS
# =============================================================

@api_view(["GET", "PUT"])
def hospital_settings(request):
    """Get or update hospital settings."""
    hospital = get_hospital_from_request(request)
    if not hospital:
        return Response(
            {"message": "Hospital not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    settings, _ = HospitalSettings.objects.get_or_create(hospital=hospital)

    if request.method == "GET":
        return Response(HospitalSettingsSerializer(settings).data)

    serializer = HospitalSettingsSerializer(settings, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def hospital_change_password(request):
    """Change hospital password."""
    hospital = get_hospital_from_request(request)
    if not hospital:
        return Response(
            {"message": "Hospital not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    current_password = request.data.get("current_password")
    new_password = request.data.get("new_password")

    if not current_password or not new_password:
        return Response(
            {"message": "Current and new password are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if hospital.password != current_password:
        return Response(
            {"message": "Current password is incorrect."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    hospital.password = new_password
    hospital.save()

    return Response({"message": "Password updated successfully."})


@api_view(["GET"])
def hospital_list(request):
    """List all hospitals (public)."""
    hospitals = Hospital.objects.filter(is_active=True)
    serializer = HospitalPublicSerializer(hospitals, many=True)
    return Response(serializer.data)