// src/lib/api.ts
import axios from 'axios';

/* -----------------------------------
   AXIOS INSTANCE
----------------------------------- */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/* -----------------------------------
   MAIN AGENT – FULL PIPELINE
----------------------------------- */
export const runFullRfpPipeline = async () => {
  const response = await api.post('/run-rfp');
  return response.data;
};

/* -----------------------------------
   RFP FETCHING
----------------------------------- */
export const fetchRfps = async () => {
  const response = await api.get('/rfps');
  return response.data;
};

export const fetchRfpDetails = async (rfpId: string) => {
  const response = await api.get(`/rfp/${rfpId}`);
  return response.data;
};

/* -----------------------------------
   TECHNICAL AGENT
----------------------------------- */
export const runTechnicalMatching = async (rfpId: string) => {
  const response = await api.post('/technical/match', { rfpId });
  return response.data;
};

/* -----------------------------------
   TYPES
----------------------------------- */
export interface RFP {
  id: string;
  title: string;
  issuer: string;
  due_date: string;
  status?: 'Not Started' | 'In Progress' | 'Completed';
}
