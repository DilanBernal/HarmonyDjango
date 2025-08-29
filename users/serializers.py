from rest_framework import serializers
from .models import User
from . import usecases


class UserSerializer(serializers.ModelSerializer):
    """Serializer para mostrar y actualizar usuarios (sin password en lectura)."""
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'profile_image', 'favorite_instrument', 'learning_points', 'is_artist']


class UserCreateSerializer(serializers.ModelSerializer):
    """Serializer para registrar usuario; maneja password de forma segura."""
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'password']

    def create(self, validated_data):
        """Crear usuario delegando al usecase para ejecutar la lógica (y envío de email)."""
        # Extraer password y delegar al usecase
        password = validated_data.pop('password')
        email = validated_data.get('email')
        username = validated_data.get('username')
        user = usecases.register_user(email=email, username=username, password=password)
        return user


class UserLoginSerializer(serializers.Serializer):
    """Serializer para login; retorna email y password como inputs."""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
