"""
MedVisionAI - Patient Models
"""

from django.db import models


class Patient(models.Model):
    """Patient registered on MedVisionAI."""

    GENDER_CHOICES = [
        ("Male", "Male"),
        ("Female", "Female"),
        ("Other", "Other"),
    ]

    name = models.CharField(max_length=255)
    patient_id = models.CharField(max_length=50, unique=True, blank=True)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    password = models.CharField(max_length=128, blank=True)
    dob = models.DateField(null=True, blank=True)
    age = models.IntegerField(default=0)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, default="Male")
    blood_group = models.CharField(max_length=5, blank=True)
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    pincode = models.CharField(max_length=10, blank=True)
    photo = models.URLField(blank=True)
    profile_photo = models.ImageField(upload_to="patient_photos/", null=True, blank=True)
    photo_url = models.URLField(blank=True)
    hospital = models.ForeignKey(
        "hospitals.Hospital",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="patients",
    )
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.patient_id} - {self.name}"

    def save(self, *args, **kwargs):
        if not self.patient_id:
            count = Patient.objects.count() + 1
            self.patient_id = f"PAT{count:03d}"
        if not self.photo_url and self.profile_photo:
            self.photo_url = self.profile_photo.url
        super().save(*args, **kwargs)


class PatientAppointment(models.Model):
    """Appointment visible to a patient."""

    STATUS_CHOICES = [
        ("scheduled", "Scheduled"),
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="appointments")
    doctor_name = models.CharField(max_length=255)
    department = models.CharField(max_length=100, blank=True)
    doctor = models.ForeignKey(
        "doctors.Doctor",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="patient_appointments",
    )
    appointment_date = models.DateField()
    appointment_time = models.CharField(max_length=10)
    appointment_type = models.CharField(max_length=100, default="General Checkup")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="scheduled")
    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-appointment_date", "appointment_time"]

    def __str__(self):
        return f"{self.patient.name} - {self.doctor_name} @ {self.appointment_date}"


class PatientReport(models.Model):
    """Medical report for a patient."""

    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Completed", "Completed"),
        ("Reviewed", "Reviewed"),
    ]

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="reports")
    report_name = models.CharField(max_length=255)
    report_type = models.CharField(max_length=100, default="Medical Report")
    description = models.TextField(blank=True)
    trial = models.CharField(max_length=255, blank=True)
    trial_name = models.CharField(max_length=255, blank=True)
    doctor_name = models.CharField(max_length=255, blank=True)
    hospital_name = models.CharField(max_length=255, blank=True)
    uploaded_by = models.CharField(max_length=255, blank=True)
    file = models.FileField(upload_to="patient_reports/", null=True, blank=True)
    file_url = models.URLField(blank=True)
    file_type = models.CharField(max_length=50, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Pending")

    uploaded_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-uploaded_at"]

    def __str__(self):
        return f"{self.report_name} for {self.patient.name}"


class PatientMedicine(models.Model):
    """Medicine prescribed to a patient."""

    STATUS_CHOICES = [
        ("Active", "Active"),
        ("Completed", "Completed"),
        ("Paused", "Paused"),
    ]

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="medicines")
    medicine_name = models.CharField(max_length=255)
    dosage = models.CharField(max_length=100, blank=True)
    frequency = models.CharField(max_length=50, blank=True)
    times = models.JSONField(default=list, blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    doctor_name = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Active")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.medicine_name} for {self.patient.name}"


class PatientMessage(models.Model):
    """Message for a patient."""

    SENDER_CHOICES = [
        ("doctor", "Doctor"),
        ("hospital", "Hospital"),
        ("system", "System"),
        ("patient", "Patient"),
    ]

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="messages")
    sender = models.CharField(max_length=20, choices=SENDER_CHOICES, default="doctor")
    sender_name = models.CharField(max_length=255, blank=True)
    message = models.TextField()
    is_read = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Message for {self.patient.name}: {self.message[:50]}"


class PatientSettings(models.Model):
    """Patient portal settings."""

    patient = models.OneToOneField(Patient, on_delete=models.CASCADE, related_name="settings")
    appointment_notifications = models.BooleanField(default=True)
    message_notifications = models.BooleanField(default=True)
    report_notifications = models.BooleanField(default=True)
    medicine_notifications = models.BooleanField(default=True)
    sms_notifications = models.BooleanField(default=False)
    email_notifications = models.BooleanField(default=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Settings for {self.patient.name}"


class PatientTimelineEntry(models.Model):
    """Health timeline entry visible to a patient."""

    ENTRY_TYPES = [
        ("appointment", "Appointment"),
        ("report", "Report"),
        ("medicine", "Medicine"),
        ("note", "Note"),
        ("lab", "Lab Result"),
        ("other", "Other"),
    ]

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="timeline_entries")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    entry_type = models.CharField(max_length=50, choices=ENTRY_TYPES, default="note")

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.patient.name}: {self.title}"