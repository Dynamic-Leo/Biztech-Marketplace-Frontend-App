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

// NEW: Transform Database flat object into Frontend Nested Type
const transformListingFromBackend = (l: any): Listing => {
    return {
        id: l.id.toString(),
        sellerId: l.sellerId?.toString(),
        assignedAgentId: l.assignedAgentId?.toString(),
        tier: l.tier,
        status: l.status,
        expiryDate: l.expiryDate,
        createdAt: l.createdAt,
        updatedAt: l.updatedAt,
        views: l.views || 0,
        // Nested public data as expected by Listing type
        publicData: {
            title: l.title,
            industry: l.industry,
            region: l.region,
            price: parseFloat(l.price),
            netProfit: l.net_profit ? parseFloat(l.net_profit) : 0,
            turnover: l.turnover ? parseFloat(l.turnover) : 0,
        },
        // Private data mapping
        privateData: {
            legalBusinessName: l.legal_business_name,
            fullAddress: l.full_address,
            ownerName: l.owner_name,
        },
        // Attach leads for dashboard stats
        Leads: l.Leads || []
    } as any;
};

const transformListingToBackend = (data: any) => {
    return {
        title: data.title,
        industry: data.industry,
        region: data.region,
        price: parseFloat(data.price),
        net_profit: parseFloat(data.netProfit),
        turnover: parseFloat(data.turnover),
        legal_business_name: data.legalBusinessName,
        full_address: data.fullAddress,
        owner_name: data.ownerName,
        tier: data.tier,
        description: data.description 
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

  const cleanEndpoint = endpoint.startsWith('/')
    ? endpoint
    : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('biztech_token');
      localStorage.removeItem('biztech_user');
    }

    // 🔑 This enables Verify Email redirect
    throw {
      status: response.status,
      message: data.message || response.statusText,
    };
  }

  return data;
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
    const response = await apiCall<{ success: boolean; count: number; data: any[] }>(`/listings?${queryParams}`);
    return response.data.map(transformListingFromBackend);
  },
  // FIXED: Now transforms specific database rows into UI-ready Listing objects
  getSellerListings: async () => {
    const response = await apiCall<{ success: boolean; data: any[] }>('/listings/my-listings');
    return response.data.map(transformListingFromBackend);
  },
  getById: async (id: string) => {
    const response = await apiCall<{ success: boolean; data: any }>(`/listings/${id}`);
    return transformListingFromBackend(response.data);
  },
  create: async (listingData: any) => {
    const payload = transformListingToBackend(listingData);
    const response = await apiCall<{ success: boolean; data: any }>('/listings', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return transformListingFromBackend(response.data);
  },
  update: async (id: string, listingData: Partial<Listing>) => {
    const response = await apiCall<{ success: boolean; data: any }>(`/listings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(listingData),
    });
    return transformListingFromBackend(response.data);
  },
  delete: async (id: string) => {
    return apiCall(`/listings/${id}`, { method: 'DELETE' });
  },
};

// --- LEADS API ---
export const agentAPI = {
  // Fetch listings assigned to the logged-in agent
  getAssignedListings: async () => {
    const response = await apiCall<{ success: boolean; data: any[] }>('/listings/agent/assigned');
    return response.data.map(transformListingFromBackend);
  },

  // Update deliverable status for Premium listings (Sale Pack, Financials, etc.)
  updateDeliverable: async (listingId: string, deliverable: string, status: boolean) => {
    return apiCall(`/listings/${listingId}/deliverables`, {
      method: 'PATCH',
      body: JSON.stringify({ [deliverable]: status }),
    });
  }
};

export const leadsAPI = {
  create: async (leadData: { listingId: string; message: string }) => {
    return apiCall<{ success: boolean; data: Lead }>('/leads', {
      method: 'POST',
      body: JSON.stringify(leadData),
    });
  },

  getBuyerEnquiries: async () => {
    const response = await apiCall<{ success: boolean; data: Lead[] }>('/leads/my-enquiries');
    return response.data;
  },

  // Agent: Fetch leads for assigned listings
  getByAgent: async () => {
    const response = await apiCall<{ success: boolean; count: number; data: any[] }>(`/agent/leads`);
    return response.data;
  },

  // Agent: Update status (New -> Contacted -> Negotiating -> Closed)
  updateStatus: async (leadId: string, status: string) => {
    return apiCall<{ success: boolean; data: Lead }>(`/agent/leads/${leadId}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
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
  // NEW: Get real-time stats
  getStats: async () => {
    const response = await apiCall<{ success: boolean; data: any }>('/admin/stats');
    return response.data;
  },

  // NEW: Get users (e.g. pending sellers)
  // getUsers: async (filters?: { role?: string; is_verified?: string }) => {
  //   const queryParams = new URLSearchParams(filters).toString();
  //   const response = await apiCall<{ success: boolean; data: User[] }>(`/admin/users?${queryParams}`);
  //   return response.data;
  // },
  // NEW: Get users (with filters)
getUsers: async (filters?: {
  role?: string;
  status?: string;
  is_verified?: boolean;
}) => {
  const queryParams = new URLSearchParams();

  if (filters?.role) queryParams.append('role', filters.role);
  if (filters?.status) queryParams.append('status', filters.status);
  if (filters?.is_verified !== undefined)
    queryParams.append('is_verified', String(filters.is_verified));

  const response = await apiCall<{ success: boolean; data: User[] }>(
    `/admin/users?${queryParams.toString()}`
  );

  return response.data;
},


  // NEW: Update user account status (Approve/Reject)
  updateUserStatus: async (userId: string, status: 'active' | 'rejected') => {
    return apiCall(`/admin/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  assignListingToAgent: async (listingId: string, agentId: string) => {
    return apiCall('/admin/assign-agent', {
      method: 'POST',
      body: JSON.stringify({ listingId, agentId }),
    });
  },

  getPendingListings: async () => {
    const response = await apiCall<{ success: boolean; count: number; data: Listing[] }>('/admin/pending-listings');
    return response.data;
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