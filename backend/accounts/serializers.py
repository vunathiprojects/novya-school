# accounts/serializers.py
from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User

class AdminLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")

        user = authenticate(email=email, password=password)

        if not user:
            raise serializers.ValidationError("Invalid email or password")
        if not user.is_admin:
            raise serializers.ValidationError("You are not authorized")

        data["user"] = user
        return data
