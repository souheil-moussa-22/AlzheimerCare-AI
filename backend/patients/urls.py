from django.urls import path

from patients.views import PatientProfileDetailView

urlpatterns = [
    path("<int:pk>/", PatientProfileDetailView.as_view(), name="patient-detail"),
]
