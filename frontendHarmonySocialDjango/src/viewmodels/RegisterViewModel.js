import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';

export default function RegisterViewModel(){
  async function register({ email, username, password }){
    const resp = await axios.post(`${API_BASE}/api/users/`, { email, username, password });
    if(resp.status !== 201) throw new Error('Registration failed');
    return resp.data;
  }

  return { register };
}
