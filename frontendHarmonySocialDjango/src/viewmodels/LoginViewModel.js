import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';

export default function LoginViewModel(){
  async function login({ email, password }){
    // Contract: expects backend /api/auth/login/ to return access token
    const resp = await axios.post(`${API_BASE}/api/auth/login/`, { email, password });
    if(resp.status !== 200) throw new Error('Login failed');
    // store token (simple example, in memory/localStorage)
    const { access, refresh } = resp.data;
    if(access) localStorage.setItem('hs_access', access);
    if(refresh) localStorage.setItem('hs_refresh', refresh);
    return resp.data;
  }

  return { login };
}
