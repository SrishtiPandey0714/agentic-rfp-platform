// e:/EY HACKATHON2/rfp-frontend/src/lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
});

// Add request interceptor for auth tokens if needed
api.interceptors.request.use((config) => {
  // Add auth token if exists
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// RFP endpoints
export const fetchRfps = async (): Promise<RFP[]> => {
  const { data } = await api.get('/rfps');
  return data;
};

export const fetchRfpDetails = async (id: string): Promise<RFP> => {
  const { data } = await api.get(`/rfp/${id}`);
  return data;
};

export const runTechnicalMatching = async (rfpId: string): Promise<any> => {
  const { data } = await api.post('/technical/match', { rfpId });
  return data;
};

// Types
export interface RFP {
  id: string;
  name: string;
  issuer: string;
  dueDate: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  scope?: string;
  requirements?: string[];
}