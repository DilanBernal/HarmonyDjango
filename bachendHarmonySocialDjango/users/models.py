from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager


class UserManager(BaseUserManager):
    """Manager personalizado para crear usuarios y superusuarios.

    Se encarga de normalizar el email y guardar la contraseña correctamente usando
    set_password para que quede hasheada.
    """
    def create_user(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        # set_password hace hashing seguro
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        return self.create_user(email, username, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """Modelo de usuario para HarmonySocial.

    Nota sobre diseño (arquitectura limpia): este modelo actúa como la entidad principal
    de la capa de dominio. Las operaciones (usecases) se implementan fuera de este
    archivo y usan repositorios para interactuar con la persistencia.

    Campos:
    - email: identificador único para autenticación
    - username: nombre público del usuario
    - profile_image: URL/ruta de imagen
    - favorite_instrument: instrumento favorito
    - learning_points: puntos de aprendizaje del usuario
    - is_artist: marca si el usuario es artista
    - is_staff / is_active: flags usados por Django admin y control de acceso
    """
    email = models.EmailField(max_length=255, unique=True)
    username = models.CharField(max_length=50, unique=True)
    profile_image = models.CharField(max_length=255, blank=True, null=True)
    favorite_instrument = models.CharField(max_length=50, blank=True, null=True)
    learning_points = models.IntegerField(default=0)
    is_artist = models.BooleanField(default=False)

    # Flags de Django
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    objects = UserManager()

    # Usamos el email como campo de autenticación principal
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.username
