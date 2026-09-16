"""
MedVisionAI - Hospital URLs
"""

from django.urls import path
from . import views

urlpatterns = [
    # Auth
    path("signup/", views.hospital_signup, name="hospital-signup"),
    path("login/", views.hospital_login, name="hospital-login"),
    path("logout/", views.hospital_logout, name="hospital-logout"),

    # Dashboard
    path("dashboard/", views.hospital_dashboard, name="hospital-dashboard"),
    path("activity/", views.hospital_activity, name="hospital-activity"),

    # Profile
    path("profile/", views.hospital_profile, name="hospital-profile"),

    # Doctors
    path("doctors/", views.hospital_doctors, name="hospital-doctors"),
    path("doctors/<int:doctor_id>/", views.hospital_doctor_detail, name="hospital-doctor-detail"),

    # Patients
    path("patients/", views.hospital_patients, name="hospital-patients"),
    path("patients/<int:patient_id>/", views.hospital_patient_detail, name="hospital-patient-detail"),

    # Appointments
    path("appointments/", views.hospital_appointments, name="hospital-appointments"),
    path("appointments/recent/", views.hospital_appointments_recent, name="hospital-appointments-recent"),
    path("appointments/<int:appointment_id>/", views.hospital_appointment_detail, name="hospital-appointment-detail"),

    # Reports
    path("reports/", views.hospital_reports, name="hospital-reports"),
    path("reports/<int:report_id>/download/", views.hospital_report_download, name="hospital-report-download"),

    # Medicines
    path("medicines/", views.hospital_medicines, name="hospital-medicines"),
    path("medicines/<int:medicine_id>/", views.hospital_medicine_detail, name="hospital-medicine-detail"),

    # Messages
    path("messages/", views.hospital_messages, name="hospital-messages"),

    # Settings
    path("settings/account/", views.hospital_settings, name="hospital-settings"),
    path("settings/notifications/", views.hospital_settings, name="hospital-settings-notifications"),
    path("settings/preferences/", views.hospital_settings, name="hospital-settings-preferences"),
    path("change-password/", views.hospital_change_password, name="hospital-change-password"),

    # Public
    path("list/", views.hospital_list, name="hospital-list"),
]