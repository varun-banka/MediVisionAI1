"""
MedVisionAI - Hospital Models
"""

from django.db import models


class Hospital(models.Model):
    """Registered hospital entity."""

    HOSPITAL_TYPES = [
        ("multispeciality", "Multi-Speciality"),
        ("general", "General Hospital"),
        ("clinic", "Clinic"),
        ("nursing_home", "Nursing Home"),
        ("specialty", "Specialty Hospital"),
    ]

    EMERGENCY_CHOICES = [
        ("yes", "Yes"),
        ("no", "No"),
        ("24x7", "24x7"),
    ]

    name = models.CharField(max_length=255)
    hospital_name = models.CharField(max_length=255, blank=True)
    type = models.CharField(max_length=50, choices=HOSPITAL_TYPES, default="general")
    registration_number = models.CharField(max_length=100, unique=True)
    established_year = models.CharField(max_length=4, blank=True)
    total_beds = models.IntegerField(default=0)
    emergency_service = models.CharField(max_length=10, choices=EMERGENCY_CHOICES, default="no")

    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    emergency_phone = models.CharField(max_length=20, blank=True)
    website = models.URLField(blank=True)

    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10, blank=True)
    country = models.CharField(max_length=100, default="India")

    administrator_name = models.CharField(max_length=255)
    administrator_email = models.EmailField()

    username = models.CharField(max_length=150, unique=True, blank=True)
    password = models.CharField(max_length=255, blank=True)

    departments = models.JSONField(default=list, blank=True)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.name or self.hospital_name

    def save(self, *args, **kwargs):
        if not self.hospital_name:
            self.hospital_name = self.name
        super().save(*args, **kwargs)


class Department(models.Model):
    """Hospital department."""

    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name="department_set")
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]
        unique_together = ("hospital", "name")

    def __str__(self):
        return f"{self.hospital.name} - {self.name}"


class HospitalDoctor(models.Model):
    """Doctor assigned to a hospital."""

    STATUS_CHOICES = [
        ("Active", "Active"),
        ("Inactive", "Inactive"),
        ("On Leave", "On Leave"),
        ("Suspended", "Suspended"),
    ]

    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name="hospital_doctors")
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    specialization = models.CharField(max_length=150)
    qualification = models.CharField(max_length=255, blank=True)
    experience = models.IntegerField(default=0)
    license_number = models.CharField(max_length=100, unique=True)
    department = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Active")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return f"{self.name} - {self.specialization}"


class HospitalPatient(models.Model):
    """Patient registered at a hospital."""

    GENDER_CHOICES = [
        ("Male", "Male"),
        ("Female", "Female"),
        ("Other", "Other"),
    ]

    STATUS_CHOICES = [
        ("Active", "Active"),
        ("Inactive", "Inactive"),
    ]

    BLOOD_GROUPS = [
        ("A+", "A+"), ("A-", "A-"),
        ("B+", "B+"), ("B-", "B-"),
        ("AB+", "AB+"), ("AB-", "AB-"),
        ("O+", "O+"), ("O-", "O-"),
    ]

    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name="hospital_patients")
    patient_id = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    dob = models.DateField(null=True, blank=True)
    age = models.IntegerField(default=0)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, default="Male")
    blood_group = models.CharField(max_length=5, choices=BLOOD_GROUPS, blank=True)
    address = models.TextField(blank=True)
    doctor = models.CharField(max_length=255, default="Not Assigned")
    last_visit = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Active")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.patient_id} - {self.name}"


class HospitalAppointment(models.Model):
    """Appointment scheduled by hospital management."""

    TYPE_CHOICES = [
        ("General Checkup", "General Checkup"),
        ("Follow-up", "Follow-up"),
        ("Consultation", "Consultation"),
        ("Emergency", "Emergency"),
        ("Surgery", "Surgery"),
        ("Lab Test", "Lab Test"),
        ("Other", "Other"),
    ]

    STATUS_CHOICES = [
        ("Scheduled", "Scheduled"),
        ("Completed", "Completed"),
        ("Cancelled", "Cancelled"),
    ]

    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name="hospital_appointments")
    appointment_id = models.CharField(max_length=50, unique=True)
    patient = models.CharField(max_length=255)
    doctor = models.CharField(max_length=255)
    date = models.DateField()
    time = models.CharField(max_length=10)
    type = models.CharField(max_length=50, choices=TYPE_CHOICES, default="General Checkup")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Scheduled")
    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-date", "time"]

    def __str__(self):
        return f"{self.appointment_id} - {self.patient} @ {self.date}"


class Medicine(models.Model):
    """Hospital medicine inventory."""

    CATEGORY_CHOICES = [
        ("Tablet", "Tablet"),
        ("Capsule", "Capsule"),
        ("Syrup", "Syrup"),
        ("Injection", "Injection"),
        ("Ointment", "Ointment"),
        ("Drops", "Drops"),
        ("Inhaler", "Inhaler"),
        ("Other", "Other"),
    ]

    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name="medicines")
    name = models.CharField(max_length=255)
    generic_name = models.CharField(max_length=255, blank=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default="Tablet")
    manufacturer = models.CharField(max_length=255, blank=True)
    quantity = models.IntegerField(default=0)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    expiry_date = models.DateField(null=True, blank=True)
    batch_number = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Message(models.Model):
    """Internal messaging between hospital, doctors, and patients."""

    SENDER_TYPE_CHOICES = [
        ("hospital", "Hospital"),
        ("doctor", "Doctor"),
        ("patient", "Patient"),
        ("system", "System"),
    ]

    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name="messages")
    sender_type = models.CharField(max_length=20, choices=SENDER_TYPE_CHOICES, default="hospital")
    sender_name = models.CharField(max_length=255, blank=True)
    receiver_type = models.CharField(max_length=20, choices=SENDER_TYPE_CHOICES, default="doctor")
    receiver_name = models.CharField(max_length=255, blank=True)
    subject = models.CharField(max_length=255, blank=True)
    message = models.TextField()
    is_read = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Message from {self.sender_name or self.sender_type}: {self.subject or self.message[:50]}"


class MedicalReport(models.Model):
    """Medical report stored at hospital level."""

    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Completed", "Completed"),
        ("Reviewed", "Reviewed"),
    ]

    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name="reports")
    report_id = models.CharField(max_length=50, unique=True)
    patient_name = models.CharField(max_length=255)
    patient_id = models.CharField(max_length=50, blank=True)
    doctor = models.CharField(max_length=255, blank=True)
    report_type = models.CharField(max_length=100, default="Medical Report")
    report_name = models.CharField(max_length=255, blank=True)
    report_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Pending")
    description = models.TextField(blank=True)
    uploaded_by = models.CharField(max_length=255, default="Hospital")
    file = models.FileField(upload_to="reports/", null=True, blank=True)
    file_url = models.URLField(blank=True)
    file_type = models.CharField(max_length=50, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.report_id} - {self.patient_name}"


class HospitalActivity(models.Model):
    """Audit log for hospital activities."""

    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name="activities")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    activity_type = models.CharField(max_length=50, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.hospital.name}: {self.title}"


class HospitalSettings(models.Model):
    """Hospital portal settings."""

    hospital = models.OneToOneField(Hospital, on_delete=models.CASCADE, related_name="settings")
    notification_enabled = models.BooleanField(default=True)
    email_notifications = models.BooleanField(default=True)
    sms_notifications = models.BooleanField(default=False)
    appointment_reminders = models.BooleanField(default=True)
    report_updates = models.BooleanField(default=True)
    message_notifications = models.BooleanField(default=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Settings for {self.hospital.name}"