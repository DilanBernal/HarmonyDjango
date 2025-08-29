# HarmonySocialDjango

Este proyecto es una aplicación web que integra un backend desarrollado en Django y un frontend en React, diseñada para gestionar usuarios y funcionalidades sociales.

## Funcionamiento General
La aplicación permite a los usuarios registrarse, iniciar sesión y acceder a funcionalidades sociales. El backend se encarga de la lógica de negocio, autenticación, gestión de usuarios y comunicación con la base de datos y el servidor SMTP para el envío de correos. El frontend proporciona la interfaz de usuario y consume la API REST expuesta por el backend.

## Arquitectura General
- **Frontend (React):** Ubicado en [`frontendHarmonySocialDjango`](./frontendHarmonySocialDjango). Se comunica con el backend mediante peticiones HTTP (API REST).
- **Backend (Django):** Ubicado en [`bachendHarmonySocialDjango`](./bachendHarmonySocialDjango). Expone endpoints REST y gestiona la lógica de negocio, usuarios, autenticación y envío de correos.
- **Base de Datos:** El backend se conecta a una base de datos relacional (por ejemplo, MySQL) para almacenar y recuperar información de usuarios y otros datos.
- **SMTP:** El backend utiliza un servidor SMTP para enviar correos electrónicos (por ejemplo, confirmación de registro o recuperación de contraseña).

El flujo general es:
1. El usuario interactúa con el frontend.
2. El frontend envía solicitudes al backend (API REST).
3. El backend procesa la solicitud, accede a la base de datos y/o envía correos vía SMTP según sea necesario.
4. El backend responde al frontend, que muestra la información al usuario.

## Documentación Específica
- [README del Backend](./bachendHarmonySocialDjango/README.md)
- [README del Frontend](./frontendHarmonySocialDjango/README.md)

---

Para más detalles sobre la configuración y uso de cada módulo, consulta los README específicos de cada carpeta.
