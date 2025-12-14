const API_BASE_URL = 'http://localhost:8000';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

async function fetchApi<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return {
        success: false,
        error: error.message || 'An error occurred',
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

// Example API service functions
export const api = {
  // RFP Endpoints
  getRfps: () => fetchApi('/api/rfps'),
  getRfpById: (id: string) => fetchApi(`/api/rfps/${id}`),
  createRfp: (data: any) =>
    fetchApi('/api/rfps', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Technical Agent Endpoints
  getTechnicalSpecs: (rfpId: string) =>
    fetchApi(`/api/technical/specs/${rfpId}`),
  updateTechnicalSpecs: (rfpId: string, data: any) =>
    fetchApi(`/api/technical/specs/${rfpId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Pricing Agent Endpoints
  getPricing: (rfpId: string) => fetchApi(`/api/pricing/${rfpId}`),
  updatePricing: (rfpId: string, data: any) =>
    fetchApi(`/api/pricing/${rfpId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Sales Agent Endpoints
  getSalesInfo: (rfpId: string) => fetchApi(`/api/sales/${rfpId}`),
  updateSalesInfo: (rfpId: string, data: any) =>
    fetchApi(`/api/sales/${rfpId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Document Management
  uploadDocument: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return fetchApi('/api/documents/upload', {
      method: 'POST',
      body: formData,
    });
  },
};

export default api;
