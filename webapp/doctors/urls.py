"""
MedVisionAI - Doctor URLs
"""

from django.urls import path
from . import views

urlpatterns = [
    # Auth
    path("signup/", views.doctor_signup, name="doctor-signup"),
    path("login/", views.doctor_login, name="doctor-login"),
    path("logout/", views.doctor_logout, name="doctor-logout"),
    path("forgot-password/", views.doctor_forgot_password, name="doctor-forgot-password"),

    # Profile
    path("profile/", views.doctor_profile, name="doctor-profile"),
    path("profile/photo/", views.doctor_profile_photo, name="doctor-profile-photo"),

    # Dashboard
    path("dashboard/", views.doctor_dashboard, name="doctor-dashboard"),

    # Appointments
    path("appointments/", views.doctor_appointments, name="doctor-appointments"),

    # Patients
    path("patients/", views.doctor_patients, name="doctor-patients"),
    path("patients/<int:patient_id>/", views.doctor_patient_detail, name="doctor-patient-detail"),
    path("patients/<int:patient_id>/trials/", views.doctor_patient_trials, name="doctor-patient-trials"),
    path("patients/<int:patient_id>/health-timeline/", views.doctor_patient_health_timeline, name="doctor-patient-health-timeline"),

    # Medicines
    path("medicines/", views.doctor_medicines, name="doctor-medicines"),
    path("medicines/<int:medicine_id>/", views.doctor_medicine_detail, name="doctor-medicine-detail"),

    # Reports
    path("reports/", views.doctor_reports, name="doctor-reports"),
    path("reports/upload/", views.doctor_report_upload, name="doctor-report-upload"),

    # Messages / Conversations
    path("conversations/", views.doctor_conversations, name="doctor-conversations"),
    path("conversations/<int:conversation_id>/messages/", views.doctor_conversation_messages, name="doctor-conversation-messages"),
    path("conversations/<int:conversation_id>/attachments/", views.doctor_conversation_attachment, name="doctor-conversation-attachment"),
    path("messages/<int:message_id>/read/", views.doctor_message_read, name="doctor-message-read"),

    # Settings
    path("settings/", views.doctor_settings, name="doctor-settings"),
    path("change-password/", views.doctor_change_password, name="doctor-change-password"),
    path("sessions/", views.doctor_sessions, name="doctor-sessions"),

    # Public
    path("list/", views.doctor_list, name="doctor-list"),
]