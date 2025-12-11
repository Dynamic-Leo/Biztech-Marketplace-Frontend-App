import { User, Listing, Lead, ValuationRequest } from '../types';

// Use the environment variable defined in .env, fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

// --- DATA ADAPTERS (CamelCase <-> Snake_Case) ---

// Prepare data for the Backend (snake_case)
const transformUserToBackend = (data: any) => {
  const payload: any = { ...data };
  
  // Map specific fields
  if (data.fullName) payload.name = data.fullName;
  if (data.phone) payload.mobile = data.phone;
  if (data.agreedToCommission !== undefined) payload.agreed_commission = data.agreedToCommission;
  if (data.financialMeans) payload.financial_means = data.financialMeans;
  
  // Cleanup frontend-only keys
  delete payload.fullName;
  delete payload.phone;
  delete payload.agreedToCommission;
  delete payload.financialMeans;
  delete payload.confirmPassword;
  delete payload.companyName; 
  
  return payload;
};

// Process data from the Backend (camelCase)
const transformUserFromBackend = (user: any): User => {
  if (!user) return user;
  return {
    ...user,
    // Ensure frontend types match backend response
    agreedToCommission: user.agreed_commission,
    financialMeans: user.financial_means,
  };
};

// --- CORE API CLIENT ---

async function apiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = localStorage.getItem('biztech_token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options?.headers,
  };

  if (token) {
    (headers as any)['Authorization'] = `Bearer ${token}`;
  }

  // Ensure endpoint starts with slash and combine with Base URL
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      // Global 401 Handler: Session Expired
      if (response.status === 401) {
        localStorage.removeItem('biztech_token');
        localStorage.removeItem('biztech_user');
      }
      throw new Error(data.message || `API Error: ${response.statusText}`);
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Network connection failed');
  }
}

// --- AUTHENTICATION API ---

export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await apiCall<{ success: boolean; user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    return {
      ...response,
      user: transformUserFromBackend(response.user)
    };
  },

  register: async (userData: any) => {
    const payload = transformUserToBackend(userData);
    
    // Returns { success: true, message: string, email: string } - No token yet
    return apiCall<{ success: boolean; message: string; email: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  verifyEmail: async (email: string, otp: string) => {
    const response = await apiCall<{ 
      success: boolean; 
      message: string; 
      token?: string; 
      user?: any;
      requireApproval?: boolean; 
    }>('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });

    if (response.user) {
      response.user = transformUserFromBackend(response.user);
    }
    return response;
  },

  logout: async () => {
    return Promise.resolve(); 
  },
};

// --- LISTINGS API ---
export const listingsAPI = {
  getAll: async (filters?: Record<string, any>) => {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await apiCall<{ success: boolean; count: number; data: Listing[] }>(`/listings?${queryParams}`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiCall<{ success: boolean; data: Listing }>(`/listings/${id}`);
    return response.data;
  },

  create: async (listingData: Partial<Listing>) => {
    return apiCall<{ success: boolean; data: Listing }>('/listings', {
      method: 'POST',
      body: JSON.stringify(listingData),
    }).then(res => res.data);
  },

  update: async (id: string, listingData: Partial<Listing>) => {
    return apiCall<{ success: boolean; data: Listing }>(`/listings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(listingData),
    }).then(res => res.data);
  },

  delete: async (id: string) => {
    return apiCall(`/listings/${id}`, { method: 'DELETE' });
  },
};

// --- LEADS API ---
export const leadsAPI = {
  create: async (leadData: Partial<Lead>) => {
    return apiCall<{ success: boolean; data: Lead }>('/leads', {
      method: 'POST',
      body: JSON.stringify(leadData),
    }).then(res => res.data);
  },

  getByAgent: async () => {
    const response = await apiCall<{ success: boolean; count: number; data: Lead[] }>(`/agent/leads`);
    return response.data;
  },

  updateStatus: async (leadId: string, status: string) => {
    return apiCall<{ success: boolean; data: Lead }>(`/agent/leads/${leadId}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }).then(res => res.data);
  },
};

// --- VALUATION API ---
export const valuationAPI = {
  submit: async (valuationData: Partial<ValuationRequest>) => {
    return apiCall<{ success: boolean; message: string; data: ValuationRequest }>('/valuation', {
      method: 'POST',
      body: JSON.stringify(valuationData),
    }).then(res => res.data);
  },
};

// --- ADMIN API ---
export const adminAPI = {
  assignListingToAgent: async (listingId: string, agentId: string) => {
    return apiCall('/admin/assign-agent', {
      method: 'POST',
      body: JSON.stringify({ listingId, agentId }),
    });
  },

  getPendingListings: async () => {
    return apiCall<{ success: boolean; count: number; data: Listing[] }>('/admin/pending-listings')
      .then(res => res.data);
  },

  createAgent: async (agentData: Partial<User>) => {
    return apiCall('/admin/create-agent', {
      method: 'POST',
      body: JSON.stringify(agentData),
    });
  },
};

// --- PAYMENT API ---
export const paymentAPI = {
  createSubscription: async (subscriptionData: { listingId: string; amount: number; }) => {
    return apiCall('/payments/subscribe', {
      method: 'POST',
      body: JSON.stringify(subscriptionData),
    });
  },
};