const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

/**
 * Enhanced fetch wrapper:
 * - Automatically sends credentials (cookies)
 * - Sets required CSRF header: X-Requested-With: XMLHttpRequest
 * - Handles auto-refresh on 401 token expiration
 */
export async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

  const headers = {
    'X-Requested-With': 'XMLHttpRequest',
    ...(options.headers || {})
  };

  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const config = {
    ...options,
    headers,
    credentials: 'include' // Mandatory to send and receive httpOnly cookies
  };

  if (config.body && typeof config.body === 'object' && !isFormData) {
    config.body = JSON.stringify(config.body);
  }

  let response;
  try {
    response = await fetch(url, config);
  } catch {
    throw new Error('Unable to connect to the API. Check the API URL and backend availability.');
  }

  let data = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  }

  // Handle 401 Token Expiration with Automatic Refresh (except for login/refresh calls)
  if (
    response.status === 401 &&
    !options._isRetry &&
    !endpoint.includes('/auth/login') &&
    !endpoint.includes('/auth/refresh')
  ) {
    try {
      const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'include'
      });

      if (refreshRes.ok) {
        // Retry the original request with the new session cookie
        return apiFetch(endpoint, { ...options, _isRetry: true });
      }
    } catch {
      // Refresh failed; proceed to throw original error
    }
  }

  if (!response.ok) {
    const error = new Error(data?.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// Authentication API methods
export const loginAdmin = async (credentials) => {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: credentials
  });
};

export const getMe = async () => {
  return apiFetch('/auth/me', {
    method: 'GET'
  });
};

export const refreshSession = async () => {
  return apiFetch('/auth/refresh', {
    method: 'POST'
  });
};

export const logoutAdmin = async () => {
  return apiFetch('/auth/logout', {
    method: 'POST'
  });
};

// Properties API methods
export const createProperty = async (formData) => {
  return apiFetch('/properties', {
    method: 'POST',
    body: formData
  });
};

export const fetchProperties = async (params = {}) => {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '' && value !== 'all') {
      searchParams.append(key, value);
    }
  }
  const query = searchParams.toString();
  return apiFetch(`/properties${query ? `?${query}` : ''}`, {
    method: 'GET'
  });
};

export const fetchAdminProperties = async (params = {}) => {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value);
    }
  }
  const query = searchParams.toString();
  return apiFetch(`/properties/admin${query ? `?${query}` : ''}`, {
    method: 'GET'
  });
};

export const deleteProperty = async (id) => {
  return apiFetch(`/properties/${encodeURIComponent(id)}`, {
    method: 'DELETE'
  });
};

export const fetchPropertyBySlug = async (slug) => {
  return apiFetch(`/properties/${encodeURIComponent(slug)}`, {
    method: 'GET'
  });
};

export const fetchFeaturedProperties = async (limit = 4) => {
  return apiFetch(`/properties/featured?limit=${limit}`, {
    method: 'GET'
  });
};

export const fetchPropertyStats = async () => {
  return apiFetch('/properties/stats', {
    method: 'GET'
  });
};
