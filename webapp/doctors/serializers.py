"""
MedVisionAI - Doctor Serializers
"""

from rest_framework import serializers

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


# =========================================================
# DOCTOR SERIALIZER
# =========================================================

class DoctorSerializer(serializers.ModelSerializer):
    """Full doctor profile serializer."""

    class Meta:
        model = Doctor

        fields = [
            "id",
            "name",
            "full_name",
            "doctor_id",
            "email",
            "phone",
            "specialization",
            "qualification",
            "registration_number",
            "experience",
            "hospital_name",
            "hospital_address",
            "bio",
            "profile_photo",
            "is_active",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "doctor_id",
            "created_at",
            "updated_at",
        ]


# =========================================================
# PUBLIC DOCTOR SERIALIZER
# =========================================================

class DoctorPublicSerializer(serializers.ModelSerializer):
    """Minimal doctor information."""

    class Meta:
        model = Doctor

        fields = [
            "id",
            "name",
            "full_name",
            "specialization",
            "email",
        ]


# =========================================================
# DOCTOR PATIENT SERIALIZER
# =========================================================

class DoctorPatientSerializer(serializers.ModelSerializer):
    """Serializer for patient assigned to a doctor."""

    patient_id = serializers.CharField(
        source="patient_code",
        read_only=True
    )

    class Meta:
        model = DoctorPatient

        fields = [
            "id",
            "doctor",
            "patient_id",
            "name",
            "gender",
            "age",
            "condition",
            "photo",
            "status",
            "assigned_at",
        ]

        read_only_fields = [
            "id",
            "doctor",
            "assigned_at",
        ]


# =========================================================
# CLINICAL TRIAL SERIALIZER
# =========================================================

class ClinicalTrialSerializer(serializers.ModelSerializer):
    """Serializer for clinical trials."""

    class Meta:
        model = ClinicalTrial

        fields = [
            "id",
            "doctor",
            "patient",
            "name",
            "description",
            "status",
            "start_date",
            "end_date",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "doctor",
            "created_at",
        ]


# =========================================================
# DOCTOR APPOINTMENT SERIALIZER
# =========================================================

class DoctorAppointmentSerializer(serializers.ModelSerializer):
    """Serializer for doctor appointments."""

    patient = serializers.SerializerMethodField()

    class Meta:
        model = DoctorAppointment

        fields = [
            "id",
            "doctor",
            "patient",
            "patient_id",
            "patient_name",
            "patient_phone",
            "patient_photo_url",
            "date",
            "time",
            "type",
            "trial",
            "created_by",
            "status",
            "reminder_enabled",
            "notes",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "doctor",
            "created_at",
            "updated_at",
        ]

    def get_patient(self, obj):

        return {
            "id": obj.patient_code,
            "name": obj.patient_name,
            "phone": obj.patient_phone,
            "photo_url": obj.patient_photo_url,
        }


# =========================================================
# PRESCRIPTION SERIALIZER
# =========================================================

class PrescriptionSerializer(serializers.ModelSerializer):
    """Serializer for prescribed medicines."""

    patient_name = serializers.SerializerMethodField()

    trial_name = serializers.SerializerMethodField()

    patient_id = serializers.SerializerMethodField()

    trial_id = serializers.SerializerMethodField()

    class Meta:
        model = Prescription

        fields = [
            "id",
            "doctor",
            "patient",
            "patient_id",
            "patient_name",
            "trial",
            "trial_id",
            "trial_name",
            "medicine_name",
            "medicine_type",
            "dosage",
            "frequency",
            "timings",
            "start_date",
            "end_date",
            "instructions",
            "sms_reminder",
            "status",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "doctor",
            "created_at",
            "updated_at",
        ]

    def get_patient_name(self, obj):

        return (
            obj.patient.name
            if obj.patient
            else obj.patient_name
        )

    def get_patient_id(self, obj):

        return (
            obj.patient.patient_code
            if obj.patient
            else ""
        )

    def get_trial_name(self, obj):

        return (
            obj.trial.name
            if obj.trial
            else obj.trial_name
        )

    def get_trial_id(self, obj):

        return (
            obj.trial.id
            if obj.trial
            else obj.trial_code
        )


# =========================================================
# DOCTOR REPORT SERIALIZER
# =========================================================

class DoctorReportSerializer(serializers.ModelSerializer):
    """Serializer for doctor medical reports."""

    patient_id = serializers.CharField(
        source="patient_code",
        read_only=True
    )

    class Meta:
        model = DoctorReport

        fields = [
            "id",
            "doctor",
            "patient_name",
            "patient_id",
            "patient_photo",
            "report_name",
            "report_type",
            "description",
            "trial",
            "uploaded_by",
            "file",
            "file_url",
            "file_type",
            "status",
            "uploaded_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "doctor",
            "uploaded_at",
            "updated_at",
        ]


# =========================================================
# DOCTOR SETTINGS SERIALIZER
# =========================================================

class DoctorSettingsSerializer(serializers.ModelSerializer):
    """Serializer for doctor settings."""

    class Meta:
        model = DoctorSettings

        fields = [
            "appointmentNotifications",
            "messageNotifications",
            "reportNotifications",
            "medicineNotifications",
            "patientChat",
            "smsNotifications",
            "activityTracking",
            "updated_at",
        ]


# =========================================================
# DOCTOR SESSION SERIALIZER
# =========================================================

class DoctorSessionSerializer(serializers.ModelSerializer):
    """Serializer for doctor sessions."""

    class Meta:
        model = DoctorSession

        fields = [
            "id",
            "doctor",
            "ip_address",
            "user_agent",
            "is_active",
            "last_activity",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "doctor",
            "created_at",
        ]


# =========================================================
# CONVERSATION SERIALIZER
# =========================================================

class ConversationSerializer(serializers.ModelSerializer):
    """Serializer for doctor-patient conversations."""

    patient_id = serializers.CharField(
        source="patient_code",
        read_only=True
    )

    class Meta:
        model = Conversation

        fields = [
            "id",
            "doctor",
            "patient_name",
            "patient_id",
            "patient_online",
            "last_message",
            "last_message_time",
            "unread_count",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "doctor",
            "created_at",
            "updated_at",
        ]


# =========================================================
# CHAT MESSAGE SERIALIZER
# =========================================================

class ChatMessageSerializer(serializers.ModelSerializer):
    """Serializer for chat messages."""

    class Meta:
        model = ChatMessage

        fields = [
            "id",
            "conversation",
            "sender",
            "message",
            "attachment",
            "read",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "conversation",
            "created_at",
        ]


# =========================================================
# HEALTH TIMELINE SERIALIZER
# =========================================================

class HealthTimelineEntrySerializer(serializers.ModelSerializer):
    """Serializer for health timeline entries."""

    patient_id = serializers.CharField(
        source="patient_code",
        read_only=True
    )

    class Meta:
        model = HealthTimelineEntry

        fields = [
            "id",
            "doctor",
            "patient_id",
            "patient_name",
            "title",
            "description",
            "entry_type",
            "entry_date",
        ]

        read_only_fields = [
            "id",
            "doctor",
            "entry_date",
        ]


# =========================================================
# DOCTOR SIGNUP SERIALIZER
# =========================================================

class DoctorSignupSerializer(serializers.Serializer):
    """Doctor registration serializer."""

    name = serializers.CharField(
        max_length=255
    )

    doctor_name = serializers.CharField(
        max_length=255,
        required=False,
        allow_blank=True
    )

    email = serializers.EmailField()

    phone = serializers.CharField(
        max_length=20
    )

    specialization = serializers.CharField(
        max_length=100
    )

    qualification = serializers.CharField(
        max_length=255,
        required=False,
        allow_blank=True
    )

    registration_number = serializers.CharField(
        max_length=100
    )

    experience = serializers.IntegerField(
        default=0,
        min_value=0
    )

    hospital_name = serializers.CharField(
        max_length=255,
        required=False,
        allow_blank=True
    )

    password = serializers.CharField(
        max_length=128,
        min_length=8,
        write_only=True
    )

    profile_photo = serializers.ImageField(
        required=False,
        allow_null=True
    )


    # =====================================================
    # EMAIL VALIDATION
    # =====================================================

    def validate_email(self, value):

        value = value.lower().strip()

        if Doctor.objects.filter(
            email__iexact=value
        ).exists():

            raise serializers.ValidationError(
                "A doctor with this email already exists."
            )

        return value


    # =====================================================
    # REGISTRATION NUMBER VALIDATION
    # =====================================================

    def validate_registration_number(self, value):

        value = value.strip()

        if Doctor.objects.filter(
            registration_number__iexact=value
        ).exists():

            raise serializers.ValidationError(
                "This registration number is already in use."
            )

        return value


    # =====================================================
    # PHONE VALIDATION
    # =====================================================

    def validate_phone(self, value):

        value = value.strip()

        if not value:

            raise serializers.ValidationError(
                "Phone number is required."
            )

        return value


    # =====================================================
    # PASSWORD VALIDATION
    # =====================================================

    def validate_password(self, value):

        if len(value) < 8:

            raise serializers.ValidationError(
                "Password must contain at least 8 characters."
            )

        return value


    # =====================================================
    # CREATE DOCTOR
    # =====================================================

    def create(self, validated_data):

        from django.contrib.auth.hashers import make_password


        # -------------------------------------------------
        # HANDLE DOCTOR NAME
        # -------------------------------------------------

        doctor_name = validated_data.pop(
            "doctor_name",
            None
        )

        if doctor_name:

            validated_data["name"] = (
                doctor_name.strip()
            )


        # -------------------------------------------------
        # GET PASSWORD
        # -------------------------------------------------

        password = validated_data.pop(
            "password"
        )


        # -------------------------------------------------
        # HASH PASSWORD
        # -------------------------------------------------

        validated_data["password"] = (
            make_password(password)
        )


        # -------------------------------------------------
        # CREATE DOCTOR
        # -------------------------------------------------

        doctor = Doctor.objects.create(
            **validated_data
        )


        # -------------------------------------------------
        # CREATE DEFAULT SETTINGS
        # -------------------------------------------------

        DoctorSettings.objects.create(
            doctor=doctor
        )


        return doctor


# =========================================================
# DOCTOR LOGIN SERIALIZER
# =========================================================

class DoctorLoginSerializer(serializers.Serializer):
    """Doctor login serializer."""

    email = serializers.EmailField()

    password = serializers.CharField(
        write_only=True
    )

    remember_me = serializers.BooleanField(
        required=False,
        default=False
    )


    # =====================================================
    # LOGIN VALIDATION
    # =====================================================

    def validate(self, attrs):

        from django.contrib.auth.hashers import check_password


        email = attrs.get("email")

        password = attrs.get("password")


        # -------------------------------------------------
        # FIND DOCTOR
        # -------------------------------------------------

        try:

            doctor = Doctor.objects.get(
                email__iexact=email
            )

        except Doctor.DoesNotExist:

            raise serializers.ValidationError(
                "Invalid email or password."
            )


        # -------------------------------------------------
        # CHECK ACCOUNT STATUS
        # -------------------------------------------------

        if not doctor.is_active:

            raise serializers.ValidationError(
                "This doctor account is inactive."
            )


        # -------------------------------------------------
        # CHECK PASSWORD
        # -------------------------------------------------

        if not check_password(
            password,
            doctor.password
        ):

            raise serializers.ValidationError(
                "Invalid email or password."
            )


        # -------------------------------------------------
        # STORE DOCTOR OBJECT
        # -------------------------------------------------

        attrs["doctor"] = doctor


        return attrs