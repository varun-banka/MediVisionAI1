"""
MedVisionAI - Hospital Serializers
"""

from rest_framework import serializers
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


class HospitalSerializer(serializers.ModelSerializer):
    """Full hospital profile serializer."""

    class Meta:
        model = Hospital
        fields = [
            "id",
            "name",
            "hospital_name",
            "type",
            "registration_number",
            "established_year",
            "total_beds",
            "emergency_service",
            "email",
            "phone",
            "emergency_phone",
            "website",
            "address",
            "city",
            "state",
            "pincode",
            "country",
            "administrator_name",
            "administrator_email",
            "departments",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class HospitalPublicSerializer(serializers.ModelSerializer):
    """Minimal hospital info for dropdowns."""

    class Meta:
        model = Hospital
        fields = ["id", "name", "hospital_name", "city", "state"]


class HospitalDoctorSerializer(serializers.ModelSerializer):
    """Serializer for doctors registered under a hospital."""

    class Meta:
        model = HospitalDoctor
        fields = [
            "id",
            "hospital",
            "name",
            "email",
            "phone",
            "specialization",
            "qualification",
            "experience",
            "license_number",
            "department",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "hospital", "created_at", "updated_at"]


class HospitalPatientSerializer(serializers.ModelSerializer):
    """Serializer for patients registered under a hospital."""

    class Meta:
        model = HospitalPatient
        fields = [
            "id",
            "hospital",
            "patient_id",
            "name",
            "email",
            "phone",
            "dob",
            "age",
            "gender",
            "blood_group",
            "address",
            "doctor",
            "last_visit",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "hospital", "created_at", "updated_at"]


class HospitalAppointmentSerializer(serializers.ModelSerializer):
    """Serializer for hospital appointments."""

    class Meta:
        model = HospitalAppointment
        fields = [
            "id",
            "hospital",
            "appointment_id",
            "patient",
            "doctor",
            "date",
            "time",
            "type",
            "status",
            "notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "hospital", "created_at", "updated_at"]


class MedicineSerializer(serializers.ModelSerializer):
    """Serializer for hospital medicine inventory."""

    class Meta:
        model = Medicine
        fields = [
            "id",
            "hospital",
            "name",
            "generic_name",
            "category",
            "manufacturer",
            "quantity",
            "price",
            "expiry_date",
            "batch_number",
            "description",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "hospital", "created_at", "updated_at"]


class MessageSerializer(serializers.ModelSerializer):
    """Serializer for hospital messages."""

    class Meta:
        model = Message
        fields = [
            "id",
            "hospital",
            "sender_type",
            "sender_name",
            "receiver_type",
            "receiver_name",
            "subject",
            "message",
            "is_read",
            "created_at",
        ]
        read_only_fields = ["id", "hospital", "created_at"]


class MedicalReportSerializer(serializers.ModelSerializer):
    """Serializer for hospital medical reports."""

    class Meta:
        model = MedicalReport
        fields = [
            "id",
            "hospital",
            "report_id",
            "patient_name",
            "patient_id",
            "doctor",
            "report_type",
            "report_name",
            "report_date",
            "status",
            "description",
            "uploaded_by",
            "file",
            "file_url",
            "file_type",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "hospital", "created_at", "updated_at"]


class HospitalActivitySerializer(serializers.ModelSerializer):
    """Serializer for hospital activities."""

    class Meta:
        model = HospitalActivity
        fields = [
            "id",
            "hospital",
            "title",
            "description",
            "activity_type",
            "created_at",
        ]
        read_only_fields = ["id", "hospital", "created_at"]


class HospitalSettingsSerializer(serializers.ModelSerializer):
    """Serializer for hospital settings."""

    class Meta:
        model = HospitalSettings
        fields = [
            "notification_enabled",
            "email_notifications",
            "sms_notifications",
            "appointment_reminders",
            "report_updates",
            "message_notifications",
            "updated_at",
        ]


class HospitalSignupSerializer(serializers.Serializer):
    """Hospital registration serializer."""

    hospital_name = serializers.CharField(max_length=255)
    registration_number = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=20)
    address = serializers.CharField()
    city = serializers.CharField(max_length=100)
    state = serializers.CharField(max_length=100)
    pincode = serializers.CharField(max_length=10)
    admin_name = serializers.CharField(max_length=255)
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(max_length=128, write_only=True)

    def validate_email(self, value):
        if Hospital.objects.filter(email=value).exists():
            raise serializers.ValidationError("A hospital with this email already exists.")
        return value

    def validate_username(self, value):
        if Hospital.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value

    def create(self, validated_data):
        data = validated_data.copy()
        password = data.pop("password")

        hospital = Hospital.objects.create(
            name=data["hospital_name"],
            hospital_name=data["hospital_name"],
            registration_number=data["registration_number"],
            email=data["email"],
            phone=data["phone"],
            address=data["address"],
            city=data["city"],
            state=data["state"],
            pincode=data["pincode"],
            administrator_name=data["admin_name"],
            administrator_email=data["email"],
            username=data["username"],
            password=password,
        )

        # Create default settings
        HospitalSettings.objects.create(hospital=hospital)

        # Create default activity
        HospitalActivity.objects.create(
            hospital=hospital,
            title="Hospital Registered",
            description=f"{hospital.hospital_name} registered on MedVisionAI.",
            activity_type="registration",
        )

        return hospital


class HospitalLoginSerializer(serializers.Serializer):
    """Hospital login serializer."""

    username = serializers.CharField()
    password = serializers.CharField()


class DashboardStatsSerializer(serializers.Serializer):
    """Hospital dashboard statistics."""

    total_doctors = serializers.IntegerField()
    total_patients = serializers.IntegerField()
    today_appointments = serializers.IntegerField()
    total_reports = serializers.IntegerField()