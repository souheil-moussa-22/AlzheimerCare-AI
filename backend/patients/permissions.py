from rest_framework.permissions import BasePermission

from accounts.models import UserRole
from patients.models import DoctorPatientAssignment, PatientProfile


class IsPatientSelf(BasePermission):
    def has_object_permission(self, request, view, obj: PatientProfile) -> bool:
        return bool(request.user.role == UserRole.PATIENT and obj.user_id == request.user.id)


class IsAssignedDoctor(BasePermission):
    def has_object_permission(self, request, view, obj: PatientProfile) -> bool:
        if request.user.role != UserRole.DOCTOR:
            return False
        return DoctorPatientAssignment.objects.filter(
            doctor__user_id=request.user.id,
            patient=obj,
        ).exists()


class IsPatientSelfOrAssignedDoctor(BasePermission):
    def has_object_permission(self, request, view, obj: PatientProfile) -> bool:
        if request.user.role == UserRole.ADMIN:
            return True
        return IsPatientSelf().has_object_permission(request, view, obj) or IsAssignedDoctor().has_object_permission(request, view, obj)
