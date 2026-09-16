"""
MedVisionAI - Doctor Admin
"""

from django.contrib import admin
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


@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ("name", "specialization", "email", "phone", "is_active")
    search_fields = ("name", "email", "registration_number", "doctor_id")
    list_filter = ("specialization", "is_active")


@admin.register(DoctorPatient)
class DoctorPatientAdmin(admin.ModelAdmin):
    list_display = ("name", "patient_code", "doctor", "status")
    search_fields = ("name", "patient_code")
    list_filter = ("status",)


@admin.register(ClinicalTrial)
class ClinicalTrialAdmin(admin.ModelAdmin):
    list_display = ("name", "patient", "doctor", "status")
    search_fields = ("name", "patient__name")
    list_filter = ("status",)


@admin.register(DoctorAppointment)
class DoctorAppointmentAdmin(admin.ModelAdmin):
    list_display = ("patient_name", "doctor", "date", "time", "status")
    search_fields = ("patient_name", "doctor__name")
    list_filter = ("status", "date")


@admin.register(Prescription)
class PrescriptionAdmin(admin.ModelAdmin):
    list_display = ("medicine_name", "patient", "doctor", "status")
    search_fields = ("medicine_name", "patient__name")
    list_filter = ("status",)


@admin.register(DoctorReport)
class DoctorReportAdmin(admin.ModelAdmin):
    list_display = ("report_name", "patient_name", "doctor", "status")
    search_fields = ("report_name", "patient_name")
    list_filter = ("status",)


@admin.register(DoctorSettings)
class DoctorSettingsAdmin(admin.ModelAdmin):
    list_display = ("doctor", "appointmentNotifications", "messageNotifications")


@admin.register(DoctorSession)
class DoctorSessionAdmin(admin.ModelAdmin):
    list_display = ("doctor", "ip_address", "is_active", "last_activity")
    list_filter = ("is_active",)


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ("doctor", "patient_name", "unread_count", "updated_at")
    search_fields = ("patient_name",)


@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ("conversation", "sender", "read", "created_at")
    list_filter = ("sender", "read")


@admin.register(HealthTimelineEntry)
class HealthTimelineEntryAdmin(admin.ModelAdmin):
    list_display = ("patient_name", "title", "entry_type", "entry_date")
    list_filter = ("entry_type",)