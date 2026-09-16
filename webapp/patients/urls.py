"""
MedVisionAI - Patient URLs
"""

from django.urls import path
from . import views

urlpatterns = [
    # Auth
    path("signup/", views.patient_signup, name="patient-signup"),
    path("login/", views.patient_login, name="patient-login"),
    path("logout/", views.patient_logout, name="patient-logout"),

    # Profile
    path("profile/", views.patient_profile, name="patient-profile"),

    # Dashboard
    path("dashboard/", views.patient_dashboard, name="patient-dashboard"),

    # Appointments
    path("appointments/", views.patient_appointments, name="patient-appointments"),

    # Reports
    path("reports/", views.patient_reports, name="patient-reports"),

    # Medicines
    path("medicines/", views.patient_medicines, name="patient-medicines"),

    # Messages
    path("messages/", views.patient_messages, name="patient-messages"),

    # Timeline
    path("timeline/", views.patient_timeline, name="patient-timeline"),

    # Settings
    path("settings/", views.patient_settings, name="patient-settings"),
    path("change-password/", views.patient_change_password, name="patient-change-password"),

    # Public
    path("list/", views.patient_list, name="patient-list"),
]