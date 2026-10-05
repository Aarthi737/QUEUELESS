// Frontend API client for QueueLess backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('queueless_token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.message || 'Something went wrong with the API request');
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
};

export const authAPI = {
  login: async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  register: async (userData) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse(res);
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  updateProfile: async (profileData) => {
    const res = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    });
    return handleResponse(res);
  },
};

export const queuesAPI = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${API_BASE_URL}/queues?${query}` : `${API_BASE_URL}/queues`;
    const res = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  getById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/queues/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  join: async (id, data = {}) => {
    const res = await fetch(`${API_BASE_URL}/queues/${id}/join`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  leave: async (id, data = {}) => {
    const res = await fetch(`${API_BASE_URL}/queues/${id}/leave`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  getMyActive: async () => {
    const res = await fetch(`${API_BASE_URL}/queues/my/active`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  getMyHistory: async () => {
    const res = await fetch(`${API_BASE_URL}/queues/my/history`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  getEntries: async (id) => {
    const res = await fetch(`${API_BASE_URL}/queues/${id}/entries`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  callNext: async (id) => {
    const res = await fetch(`${API_BASE_URL}/queues/${id}/call-next`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  complete: async (id) => {
    const res = await fetch(`${API_BASE_URL}/queues/${id}/complete`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  skip: async (id) => {
    const res = await fetch(`${API_BASE_URL}/queues/${id}/skip`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  togglePause: async (id) => {
    const res = await fetch(`${API_BASE_URL}/queues/${id}/toggle-pause`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },
};

export const adminAPI = {
  getOverview: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/overview`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  getUsers: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  resetDemo: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/reset-demo`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },
};
