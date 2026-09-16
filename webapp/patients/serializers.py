"""
MedVisionAI - Patient Serializers
"""

from rest_framework import serializers
from .models import (
    Patient,
    PatientAppointment,
    PatientReport,
    PatientMedicine,
    PatientMessage,
    PatientSettings,
    PatientTimelineEntry,
)


class PatientSerializer(serializers.ModelSerializer):
    """Full patient profile serializer."""

    class Meta:
        model = Patient
        fields = [
            "id",
            "name",
            "patient_id",
            "email",
            "phone",
            "dob",
            "age",
            "gender",
            "blood_group",
            "address",
            "city",
            "state",
            "pincode",
            "photo",
            "photo_url",
            "profile_photo",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "patient_id", "created_at", "updated_at"]


class PatientAppointmentSerializer(serializers.ModelSerializer):
    """Serializer for patient appointments."""

    class Meta:
        model = PatientAppointment
        fields = [
            "id",
            "patient",
            "doctor_name",
            "department",
            "appointment_date",
            "appointment_time",
            "appointment_type",
            "status",
            "notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "patient", "created_at", "updated_at"]


class PatientReportSerializer(serializers.ModelSerializer):
    """Serializer for patient medical reports."""

    class Meta:
        model = PatientReport
        fields = [
            "id",
            "patient",
            "report_name",
            "report_type",
            "description",
            "trial",
            "trial_name",
            "doctor_name",
            "hospital_name",
            "uploaded_by",
            "file",
            "file_url",
            "file_type",
            "status",
            "uploaded_at",
            "updated_at",
        ]
        read_only_fields = ["id", "patient", "uploaded_at", "updated_at"]


class PatientMedicineSerializer(serializers.ModelSerializer):
    """Serializer for patient medicines."""

    class Meta:
        model = PatientMedicine
        fields = [
            "id",
            "patient",
            "medicine_name",
            "dosage",
            "frequency",
            "times",
            "start_date",
            "end_date",
            "doctor_name",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "patient", "created_at", "updated_at"]


class PatientMessageSerializer(serializers.ModelSerializer):
    """Serializer for patient messages."""

    class Meta:
        model = PatientMessage
        fields = [
            "id",
            "patient",
            "sender",
            "sender_name",
            "message",
            "is_read",
            "created_at",
        ]
        read_only_fields = ["id", "patient", "created_at"]


class PatientSettingsSerializer(serializers.ModelSerializer):
    """Serializer for patient settings."""

    class Meta:
        model = PatientSettings
        fields = [
            "appointment_notifications",
            "message_notifications",
            "report_notifications",
            "medicine_notifications",
            "sms_notifications",
            "email_notifications",
            "updated_at",
        ]


class PatientTimelineEntrySerializer(serializers.ModelSerializer):
    """Serializer for patient health timeline."""

    class Meta:
        model = PatientTimelineEntry
        fields = [
            "id",
            "patient",
            "title",
            "description",
            "entry_type",
            "created_at",
        ]
        read_only_fields = ["id", "patient", "created_at"]


class PatientSignupSerializer(serializers.Serializer):
    """Patient registration serializer."""

    name = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=20)
    password = serializers.CharField(max_length=128, write_only=True)
    dob = serializers.DateField(required=False)
    gender = serializers.CharField(required=False)
    blood_group = serializers.CharField(required=False)

    def validate_email(self, value):
        if Patient.objects.filter(email=value).exists():
            raise serializers.ValidationError("A patient with this email already exists.")
        return value

    def create(self, validated_data):
        password = validated_data.pop("password", "")
        patient = Patient.objects.create(**validated_data)
        patient.password = password
        patient.save()
        PatientSettings.objects.create(patient=patient)
        return patient


class PatientLoginSerializer(serializers.Serializer):
    """Patient login serializer."""

    email = serializers.EmailField()
    password = serializers.CharField()