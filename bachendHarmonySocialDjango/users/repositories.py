"""Repositorio simple para acceder a la persistencia de usuarios.

En arquitectura limpia este archivo representa la implementación del repositorio
que usan los casos de uso (usecases). Aquí exponemos funciones básicas que
encapsulan consultas a Django ORM.
"""
from .models import User
from django.shortcuts import get_object_or_404


def get_user_by_id(user_id):
    """Retorna un usuario o lanza Http404 si no existe."""
    return get_object_or_404(User, id=user_id)


def get_user_by_email(email):
    try:
        return User.objects.get(email=email)
    except User.DoesNotExist:
        return None


def list_users():
    return User.objects.all()


def create_user(**kwargs):
    # kwargs expected: email, username, password, etc.
    password = kwargs.pop('password', None)
    user = User(**kwargs)
    if password:
        user.set_password(password)
    user.save()
    return user


def update_user(user: User, **kwargs):
    # Actualiza campos sencillos (no password). Para password usar set_password.
    for k, v in kwargs.items():
        if k == 'password':
            user.set_password(v)
        else:
            setattr(user, k, v)
    user.save()
    return user


def delete_user(user: User):
    user.delete()
