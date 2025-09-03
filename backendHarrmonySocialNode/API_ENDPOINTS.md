# HarmonySocial Node API Endpoints

Base URL: http://localhost:666/api

Authentication: Bearer <access_token> header for protected endpoints.

Endpoints

- POST /api/users
  - Description: Register a new user (public).
  - Body JSON:
    - email (string, required)
    - username (string, required)
    - password (string, required, min 8)
    - location (object, optional) { lat: Number, lng: Number }
  - Response: 201 Created with user object (password not returned).

- POST /api/auth/login
  - Description: Authenticate user and return access + refresh tokens.
  - Body JSON:
    - email
    - password
  - Response: { access: <token>, refresh: <token>, user: <user> }

- GET /api/users
  - Description: List users. Protected.
  - Header: Authorization: Bearer <access>

- GET /api/users/:id
  - Description: Get user by id. Protected.
  - Header: Authorization: Bearer <access>

- PUT /api/users/:id
  - Description: Update user fields (including location). Protected.
  - Header: Authorization: Bearer <access>

- DELETE /api/users/:id
  - Description: Delete user. Protected.
  - Header: Authorization: Bearer <access>

Notes
- The `location` field is expected as { lat, lng } and is stored on the user document.
- Configure environment variables via `.env`:
  - MONGO_URI
  - PORT
  - JWT_SECRET

Examples
See `tests.http` for ready-to-run HTTP requests to try the API.
