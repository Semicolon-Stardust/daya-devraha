// src/apiClient.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:6000/api/v1',
  withCredentials: true, // ensures cookies are sent with each request
});

export default apiClient;
