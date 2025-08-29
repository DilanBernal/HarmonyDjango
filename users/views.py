from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from django.contrib.auth import get_user_model

UserModel = get_user_model()

from .models import User
from .serializers import UserSerializer, UserCreateSerializer, UserLoginSerializer


class UserViewSet(viewsets.ModelViewSet):
    """CRUD de usuarios. Lista y detalle requieren autenticación.

    El endpoint para crear usuario permite registro público.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        # Permite crear usuarios sin autenticación
        if self.action in ['create']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        return UserSerializer


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    """Autentica usuario y devuelve tokens JWT (access + refresh)."""
    serializer = UserLoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    email = serializer.validated_data['email']
    password = serializer.validated_data['password']

    # Usamos check_password directamente para evitar dependencias del backend
    try:
        user = UserModel.objects.get(email=email)
    except UserModel.DoesNotExist:
        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    if not user.check_password(password):
        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    refresh = RefreshToken.for_user(user)
    return Response({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'user': UserSerializer(user).data,
    })
