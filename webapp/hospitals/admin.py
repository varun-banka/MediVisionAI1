"""
MedVisionAI - Hospital Admin
"""

from django.contrib import admin
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


@admin.register(Hospital)
class HospitalAdmin(admin.ModelAdmin):
    list_display = ("hospital_name", "email", "phone", "city", "state", "is_active")
    search_fields = ("hospital_name", "email", "registration_number", "username")
    list_filter = ("is_active", "city", "state")


@admin.register(HospitalDoctor)
class HospitalDoctorAdmin(admin.ModelAdmin):
    list_display = ("name", "specialization", "hospital", "department", "status")
    search_fields = ("name", "email", "license_number")
    list_filter = ("status", "department")


@admin.register(HospitalPatient)
class HospitalPatientAdmin(admin.ModelAdmin):
    list_display = ("patient_id", "name", "gender", "hospital", "status")
    search_fields = ("patient_id", "name", "email", "phone")
    list_filter = ("status", "gender")


@admin.register(HospitalAppointment)
class HospitalAppointmentAdmin(admin.ModelAdmin):
    list_display = ("appointment_id", "patient", "doctor", "date", "time", "status")
    search_fields = ("appointment_id", "patient", "doctor")
    list_filter = ("status", "date")


@admin.register(Medicine)
class MedicineAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "quantity", "price", "expiry_date")
    search_fields = ("name", "generic_name", "batch_number")
    list_filter = ("category",)


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ("sender_name", "receiver_name", "subject", "is_read", "created_at")
    search_fields = ("sender_name", "receiver_name", "subject", "message")
    list_filter = ("is_read", "sender_type")


@admin.register(MedicalReport)
class MedicalReportAdmin(admin.ModelAdmin):
    list_display = ("report_id", "patient_name", "report_type", "doctor", "status")
    search_fields = ("report_id", "patient_name", "doctor")
    list_filter = ("status", "report_type")


@admin.register(HospitalActivity)
class HospitalActivityAdmin(admin.ModelAdmin):
    list_display = ("title", "hospital", "activity_type", "created_at")
    search_fields = ("title", "description")
    list_filter = ("activity_type",)


@admin.register(HospitalSettings)
class HospitalSettingsAdmin(admin.ModelAdmin):
    list_display = ("hospital", "notification_enabled", "email_notifications")