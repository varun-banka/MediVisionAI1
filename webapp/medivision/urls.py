"""
MedVisionAI - Main URL Configuration
"""

from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve

urlpatterns = [
    path('admin/', admin.site.urls),

    # Frontend entry point
    path('', serve, {'document_root': settings.FRONTEND_DIR, 'path': 'index.html'}),

    # API endpoints
    path('api/hospital/', include('hospitals.urls')),
    path('api/doctor/', include('doctors.urls')),
    path('api/patient/', include('patients.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += [
        re_path(
            r'^(?P<path>(?:assets|auth|doctor|hospital|patient)/.*|style\.css|scrip\.js|index\.html)$',
            serve,
            {'document_root': settings.FRONTEND_DIR},
        ),
    ]