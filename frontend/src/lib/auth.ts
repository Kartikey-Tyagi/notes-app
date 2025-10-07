import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function signup(name: string, email: string, password: string, role: string) {
  return axios.post(`${API_URL}/auth/signup`, { name, email, password, role });
}

export async function login(email: string, password: string) {
  const formData = new FormData();
  formData.append('username', email);
  formData.append('password', password);
  const response = await axios.post(`${API_URL}/auth/login`, formData);
  localStorage.setItem('token', response.data.access_token);
  return response.data;
}

export function getToken() {
  return localStorage.getItem('token');
}