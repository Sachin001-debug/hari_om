const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Enhanced fetch wrapper:
 * - Automatically sends credentials (cookies)
 * - Sets required CSRF header: X-Requested-With: XMLHttpRequest
 * - Handles auto-refresh on 401 token expiration
 */
export async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers,
    credentials: 'include' // Mandatory to send and receive httpOnly cookies
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  let response;
  try {
    response = await fetch(url, config);
  } catch (networkError) {
    throw new Error('Unable to connect to the backend server. Please verify the API is running on port 5000.');
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

