import axios from 'axios';

// Point frontend to the Node backend running on port 666
const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:666';

export default function LoginViewModel(){
  async function login({ email, username, password, location }){
    // Contract: backend /api/auth/login expects email, username (optional), password and location
    const body = { email, password };
    if (username) body.username = username;
    if (location) body.location = location;
    const resp = await axios.post(`${API_BASE}/api/auth/login`, body);
    if(resp.status !== 200) throw new Error('Login failed');
    // store token (simple example, in memory/localStorage)
    const { access, refresh } = resp.data;
    if(access) localStorage.setItem('hs_access', access);
    if(refresh) localStorage.setItem('hs_refresh', refresh);
    return resp.data;
  }

  return { login };
}
