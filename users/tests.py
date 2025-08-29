from django.test import TestCase, override_settings
from django.urls import reverse
from rest_framework.test import APIClient
from .models import User
from django.core import mail


class UserAuthTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(email='test@example.com', username='tester', password='strongpass')

    def test_login(self):
        resp = self.client.post(reverse('login'), {'email': 'test@example.com', 'password': 'strongpass'}, format='json')
        self.assertEqual(resp.status_code, 200)
        self.assertIn('access', resp.data)

    def test_register(self):
        resp = self.client.post('/api/users/', {'email': 'new@example.com', 'username': 'newuser', 'password': 'newpass123'}, format='json')
        # Registro público debe devolver 201 CREATED
        self.assertEqual(resp.status_code, 201)
        self.assertEqual(resp.data['email'], 'new@example.com')

    @override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
    def test_register_sends_email(self):
        # Usar locmem backend para capturar el correo en tests
        mail.outbox = []
        resp = self.client.post('/api/users/', {'email': 'mailtest@example.com', 'username': 'mailuser', 'password': 'newpass321'}, format='json')
        self.assertEqual(resp.status_code, 201)
        # Verificar que se envió exactamente un correo
        self.assertEqual(len(mail.outbox), 1)
        sent = mail.outbox[0]
        # Asunto esperado (según usecase)
        self.assertIn('Bienvenido', sent.subject)
        # Destinatario correcto
        self.assertEqual(sent.to, ['mailtest@example.com'])
        # El cuerpo debe contener el nombre de usuario
        self.assertIn('mailuser', sent.body)
