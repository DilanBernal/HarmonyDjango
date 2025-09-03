import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:666';

export default function RegisterViewModel() {
  async function register({ email, username, password, location }) {
    const payload = { email, username, password };

    if (location) {
      if (location.coordinates && Array.isArray(location.coordinates)) {
        payload.location = {
          lat: location.coordinates[1],
          lng: location.coordinates[0]
        };
      } else {
        payload.location = location;
      }
    }

    try {
      console.log(`${API_BASE}/api/users`, payload)
      const resp = await axios.post(`${API_BASE}/api/users`, payload);
      console.log('Response:', resp);

      // NO uses JSON.parse si resp.data ya es un objeto
      // axios ya parsea la respuesta JSON automáticamente
      if (resp.status !== 200 && resp.status !== 201) {
        throw new Error('Registration failed');
      }

      return resp.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  return { register };
}