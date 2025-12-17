import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface RFP {
    id: string;
    name: string;
    issuer: string;
    dueDate: string;
    status: 'Not Started' | 'In Progress' | 'Completed';
    scope?: string;
    requirements?: string[];
    created_at?: string;
    updated_at?: string;
}

export interface TechnicalMatchingResult {
    rfp_id: string;
    matches: any[];
    score: number;
}

/**
 * Fetch all RFPs
 */
export async function fetchRfps(): Promise<RFP[]> {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/rfps`);
        return response.data;
    } catch (error) {
        console.error('Error fetching RFPs:', error);
        throw error;
    }
}

/**
 * Fetch details for a specific RFP
 */
export async function fetchRfpDetails(id: string): Promise<RFP> {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/rfps/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching RFP details for ID ${id}:`, error);
        throw error;
    }
}

/**
 * Run technical matching for an RFP
 */
export async function runTechnicalMatching(rfpId: string): Promise<TechnicalMatchingResult> {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/technical-matching/${rfpId}`);
        return response.data;
    } catch (error) {
        console.error(`Error running technical matching for RFP ${rfpId}:`, error);
        throw error;
    }
}

/**
 * Scan RFP URLs
 */
export async function scanRfpUrls(urls: string[]): Promise<any> {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/scan-rfps`, { urls });
        return response.data;
    } catch (error) {
        console.error('Error scanning RFP URLs:', error);
        throw error;
    }
}

/**
 * Run the full RFP processing pipeline
 */
export async function runFullRfpPipeline(): Promise<any> {
    try {
        console.log('[API] Calling', `${API_BASE_URL}/api/rfp/run-pipeline`);
        const response = await axios.post(`${API_BASE_URL}/api/rfp/run-pipeline`);
        console.log('[API] Response received:', response);
        return response.data;
    } catch (error) {
        console.error('[API] Error running full RFP pipeline:', error);
        throw error;
    }
}

/**
 * Fetch dashboard statistics (aggregated from all RFPs)
 */
export async function fetchDashboardStats(): Promise<any> {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/dashboard/stats`);
        return response.data;
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        throw error;
    }
}
