"""
MedVisionAI - Patient Admin
"""

from django.contrib import admin
from .models import (
    Patient,
    PatientAppointment,
    PatientReport,
    PatientMedicine,
    PatientMessage,
    PatientSettings,
    PatientTimelineEntry,
)


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ("patient_id", "name", "email", "phone", "is_active")
    search_fields = ("patient_id", "name", "email", "phone")
    list_filter = ("is_active", "gender")


@admin.register(PatientAppointment)
class PatientAppointmentAdmin(admin.ModelAdmin):
    list_display = ("patient", "doctor_name", "appointment_date", "appointment_time", "status")
    search_fields = ("patient__name", "doctor_name")
    list_filter = ("status", "appointment_date")


@admin.register(PatientReport)
class PatientReportAdmin(admin.ModelAdmin):
    list_display = ("report_name", "patient", "report_type", "status")
    search_fields = ("report_name", "patient__name")
    list_filter = ("status", "report_type")


@admin.register(PatientMedicine)
class PatientMedicineAdmin(admin.ModelAdmin):
    list_display = ("medicine_name", "patient", "status")
    search_fields = ("medicine_name", "patient__name")
    list_filter = ("status",)


@admin.register(PatientMessage)
class PatientMessageAdmin(admin.ModelAdmin):
    list_display = ("patient", "sender", "is_read", "created_at")
    list_filter = ("sender", "is_read")


@admin.register(PatientSettings)
class PatientSettingsAdmin(admin.ModelAdmin):
    list_display = ("patient", "appointment_notifications", "message_notifications")


@admin.register(PatientTimelineEntry)
class PatientTimelineEntryAdmin(admin.ModelAdmin):
    list_display = ("patient", "title", "entry_type", "created_at")
    list_filter = ("entry_type",)