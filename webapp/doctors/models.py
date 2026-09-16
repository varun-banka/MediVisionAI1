"""
MedVisionAI - Doctor Models
"""

from django.db import models


class Doctor(models.Model):
    """Doctor registered on MedVisionAI."""

    SPECIALIZATIONS = [
        ("Cardiology", "Cardiology"),
        ("Dermatology", "Dermatology"),
        ("Neurology", "Neurology"),
        ("Orthopedics", "Orthopedics"),
        ("Pediatrics", "Pediatrics"),
        ("Radiology", "Radiology"),
        ("General Medicine", "General Medicine"),
        ("Oncology", "Oncology"),
        ("Gynecology", "Gynecology"),
        ("ENT", "ENT"),
        ("Ophthalmology", "Ophthalmology"),
        ("Psychiatry", "Psychiatry"),
        ("Urology", "Urology"),
        ("Other", "Other"),
    ]

    name = models.CharField(max_length=255)
    full_name = models.CharField(max_length=255, blank=True)
    doctor_id = models.CharField(max_length=50, unique=True, blank=True)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    specialization = models.CharField(max_length=100, choices=SPECIALIZATIONS, default="General Medicine")
    qualification = models.CharField(max_length=255, blank=True)
    registration_number = models.CharField(max_length=100, unique=True)
    experience = models.IntegerField(default=0)
    hospital_name = models.CharField(max_length=255, blank=True)
    hospital_address = models.CharField(max_length=500, blank=True)
    hospital = models.ForeignKey(
        "hospitals.Hospital",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="doctors",
    )
    bio = models.TextField(blank=True)
    password = models.CharField(max_length=128, blank=True)
    profile_photo = models.ImageField(upload_to="doctor_photos/", null=True, blank=True)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} - {self.specialization}"

    def save(self, *args, **kwargs):
        if not self.full_name:
            self.full_name = self.name
        if not self.doctor_id:
            count = Doctor.objects.count() + 1
            self.doctor_id = f"DOC{count:03d}"
        super().save(*args, **kwargs)


class DoctorPatient(models.Model):
    """Patient assigned to a doctor."""

    STATUS_CHOICES = [
        ("Active", "Active"),
        ("Inactive", "Inactive"),
        ("Completed", "Completed"),
    ]

    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name="assigned_patients")
    patient_ref = models.ForeignKey(
        "patients.Patient",
        on_delete=models.CASCADE,
        related_name="doctor_patient_refs",
        null=True,
        blank=True,
    )
    name = models.CharField(max_length=255)
    patient_code = models.CharField(max_length=50)
    gender = models.CharField(max_length=10, default="--")
    age = models.IntegerField(default=0)
    condition = models.CharField(max_length=255, blank=True)
    photo = models.URLField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Active")
    assigned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-assigned_at"]

    def __str__(self):
        return f"{self.doctor.name} -> {self.name}"


class ClinicalTrial(models.Model):
    """Clinical trial associated with a patient under a doctor."""

    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name="trials")
    patient = models.ForeignKey(DoctorPatient, on_delete=models.CASCADE, related_name="trials")
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=50, default="Active")
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} - {self.patient.name}"


class DoctorAppointment(models.Model):
    """Appointment assigned to a doctor."""

    STATUS_CHOICES = [
        ("scheduled", "Scheduled"),
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]

    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name="appointments")
    patient_code = models.CharField(max_length=50, blank=True)
    patient_name = models.CharField(max_length=255)
    patient_phone = models.CharField(max_length=20, blank=True)
    patient_photo_url = models.URLField(blank=True)
    date = models.DateField()
    time = models.CharField(max_length=10)
    type = models.CharField(max_length=100, default="General Checkup")
    trial = models.CharField(max_length=255, blank=True)
    created_by = models.CharField(max_length=255, default="Hospital Management")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="scheduled")
    reminder_enabled = models.BooleanField(default=False)
    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["date", "time"]

    def __str__(self):
        return f"{self.patient_name} @ {self.date} {self.time}"


class Prescription(models.Model):
    """Medicine prescribed by a doctor to a patient."""

    MEDICINE_TYPES = [
        ("Tablet", "Tablet"),
        ("Capsule", "Capsule"),
        ("Syrup", "Syrup"),
        ("Injection", "Injection"),
        ("Ointment", "Ointment"),
        ("Drops", "Drops"),
        ("Inhaler", "Inhaler"),
        ("Other", "Other"),
    ]

    FREQUENCY_CHOICES = [
        ("Once daily", "Once daily"),
        ("Twice daily", "Twice daily"),
        ("Three times daily", "Three times daily"),
        ("Four times daily", "Four times daily"),
        ("Every other day", "Every other day"),
        ("Weekly", "Weekly"),
        ("As needed", "As needed"),
    ]

    STATUS_CHOICES = [
        ("Active", "Active"),
        ("Completed", "Completed"),
        ("Paused", "Paused"),
    ]

    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name="prescriptions")
    patient = models.ForeignKey(DoctorPatient, on_delete=models.CASCADE, related_name="prescriptions")
    patient_name = models.CharField(max_length=255, blank=True)
    trial = models.ForeignKey(ClinicalTrial, on_delete=models.SET_NULL, null=True, blank=True)
    trial_code = models.IntegerField(null=True, blank=True)
    trial_name = models.CharField(max_length=255, blank=True)
    medicine_name = models.CharField(max_length=255)
    medicine_type = models.CharField(max_length=50, choices=MEDICINE_TYPES, default="Tablet")
    dosage = models.CharField(max_length=100, blank=True)
    frequency = models.CharField(max_length=50, choices=FREQUENCY_CHOICES, default="Once daily")
    timings = models.JSONField(default=list, blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    instructions = models.TextField(blank=True)
    sms_reminder = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Active")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.medicine_name} for {self.patient}"


class DoctorReport(models.Model):
    """Medical report uploaded/accessed by a doctor."""

    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Reviewed", "Reviewed"),
        ("Completed", "Completed"),
    ]

    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name="reports")
    patient_name = models.CharField(max_length=255)
    patient_code = models.CharField(max_length=50, blank=True)
    patient_photo = models.URLField(blank=True)
    report_name = models.CharField(max_length=255)
    report_type = models.CharField(max_length=100, default="Medical Report")
    description = models.TextField(blank=True)
    trial = models.CharField(max_length=255, blank=True)
    uploaded_by = models.CharField(max_length=255, blank=True)
    file = models.FileField(upload_to="doctor_reports/", null=True, blank=True)
    file_url = models.URLField(blank=True)
    file_type = models.CharField(max_length=50, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Pending")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-uploaded_at"]

    def __str__(self):
        return f"{self.report_name} for {self.patient_name}"


class DoctorSettings(models.Model):
    """Doctor portal settings."""

    doctor = models.OneToOneField(Doctor, on_delete=models.CASCADE, related_name="settings")
    appointmentNotifications = models.BooleanField(default=True)
    messageNotifications = models.BooleanField(default=True)
    reportNotifications = models.BooleanField(default=True)
    medicineNotifications = models.BooleanField(default=True)
    patientChat = models.BooleanField(default=True)
    smsNotifications = models.BooleanField(default=False)
    activityTracking = models.BooleanField(default=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Settings for {self.doctor.name}"


class DoctorSession(models.Model):
    """Doctor session tracking."""

    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name="sessions")
    session_key = models.CharField(max_length=255)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    last_activity = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-last_activity"]

    def __str__(self):
        return f"Session for {self.doctor.name}"


class Conversation(models.Model):
    """Doctor-patient conversation thread."""

    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name="conversations")
    patient_name = models.CharField(max_length=255)
    patient_code = models.CharField(max_length=50, blank=True)
    patient_online = models.BooleanField(default=False)
    last_message = models.TextField(blank=True)
    last_message_time = models.DateTimeField(null=True, blank=True)
    unread_count = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at"]

    def __str__(self):
        return f"{self.doctor.name} <-> {self.patient_name}"


class ChatMessage(models.Model):
    """Individual message within a conversation."""

    SENDER_CHOICES = [
        ("doctor", "Doctor"),
        ("patient", "Patient"),
    ]

    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name="messages")
    sender = models.CharField(max_length=20, choices=SENDER_CHOICES, default="doctor")
    message = models.TextField(blank=True)
    attachment = models.JSONField(null=True, blank=True)
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.sender}: {self.message[:50]}"


class HealthTimelineEntry(models.Model):
    """Health timeline entry for a patient, created by a doctor."""

    ENTRY_TYPES = [
        ("appointment", "Appointment"),
        ("report", "Report"),
        ("medicine", "Medicine"),
        ("note", "Note"),
        ("lab", "Lab Result"),
        ("surgery", "Surgery"),
        ("other", "Other"),
    ]

    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name="timeline_entries")
    patient_code = models.CharField(max_length=50)
    patient_name = models.CharField(max_length=255, blank=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    entry_type = models.CharField(max_length=50, choices=ENTRY_TYPES, default="note")
    entry_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-entry_date"]

    def __str__(self):
        return f"{self.patient_name}: {self.title}"