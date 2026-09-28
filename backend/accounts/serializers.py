from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import PasswordResetForm, SetPasswordForm
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["role"] = user.role
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data["role"] = self.user.role
        return data


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def save(self):
        form = PasswordResetForm(data={"email": self.validated_data["email"]})
        if form.is_valid():
            form.save(
                request=None,
                use_https=False,
                from_email=None,
                email_template_name="registration/password_reset_email.html",
                subject_template_name="registration/password_reset_subject.txt",
                token_generator=default_token_generator,
                domain_override="localhost:5173",
                extra_email_context={"frontend_reset_url": settings.FRONTEND_PASSWORD_RESET_URL},
            )


class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(min_length=8, write_only=True)

    def save(self):
        uid = force_str(urlsafe_base64_decode(self.validated_data["uid"]))
        user = User.objects.get(pk=uid)
        form = SetPasswordForm(
            user=user,
            data={
                "new_password1": self.validated_data["new_password"],
                "new_password2": self.validated_data["new_password"],
            },
        )
        if not form.is_valid():
            raise serializers.ValidationError(form.errors)
        if not default_token_generator.check_token(user, self.validated_data["token"]):
            raise serializers.ValidationError({"token": "Invalid token"})
        form.save()
