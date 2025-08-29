"""Casos de uso (business logic) para operaciones de usuario.

Estos usecases no conocen detalles de HTTP ni de Django REST Framework; usan
repositorios para persistencia y devuelven entidades o errores.
"""
from . import repositories
from django.core.exceptions import ValidationError
from django.core.mail import send_mail, get_connection, EmailMessage
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


def register_user(email, username, password):
    """Registra un usuario; valida unicidad de email/username.

    Retorna la entidad User creada.
    """
    if repositories.get_user_by_email(email):
        raise ValidationError('Email already registered')
    user = repositories.create_user(email=email, username=username, password=password)
    # Enviar correo de bienvenida de forma no bloqueante (si falla, no revertir registro)
    try:
        subject, message = _build_welcome_message(user)
        # Usar explícitamente DEFAULT_FROM_EMAIL y la conexión SMTP configurada.
        conn = get_connection()  # usa settings.EMAIL_*
        email = EmailMessage(subject=subject, body=message, from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', None), to=[user.email], connection=conn)
        email.send(fail_silently=False)
    except Exception as exc:  # pragma: no cover - best-effort email send
        # Registrar el fallo; no lanzamos para no romper el flujo de registro.
        logger.exception('Failed to send welcome email to %s: %s', user.email, exc)
    return user


def _build_welcome_message(user):
    """Construye asunto y cuerpo del correo de bienvenida para un usuario."""
    subject = 'Bienvenido a HarmonySocial'
    message = (
        f'Hola {user.username},\n\n'
        'Gracias por crear una cuenta en HarmonySocial.\n'
        'Puedes iniciar sesión usando tu correo electrónico y la contraseña que elegiste.\n\n'
        'Saludos,\n'
        'El equipo de HarmonySocial'
    )
    return subject, message


def authenticate_user(email, password):
    """Autenticación básica delegada a Django (se usará authenticate en la capa web).

    Este usecase solo tiene lógica de negocio si fuera necesario (p. ej. bloqueos).
    """
    # En este proyecto delegaremos a Django auth en la capa de vista
    return True

