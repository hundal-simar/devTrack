const BASE_URL = import.meta.env.VITE_API_URI;

/**
 * Perform an HTTP request with automatic JWT authorization header injection.
 */
async function request(endpoint, options = {}) {
  

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    credentials: 'include',
  };

  const config = {
    ...options,
    headers,
    credentials: 'include', // Ensure cookies are sent with requests
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (response.status === 204) {
    return null;
  }

  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = { message: 'Failed to parse response JSON' };
  }

  if (!response.ok) {
    const errorMsg = data && data.message ? data.message : 'Something went wrong';
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  get: (endpoint, options) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) => request(endpoint, { ...options, method: 'POST', body }),
  put: (endpoint, body, options) => request(endpoint, { ...options, method: 'PUT', body }),
  patch: (endpoint, body, options) => request(endpoint, { ...options, method: 'PATCH', body }),
  delete: (endpoint, options) => request(endpoint, { ...options, method: 'DELETE' }),
};

export default api;
