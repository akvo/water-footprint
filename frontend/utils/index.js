import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const fetchStrapiData = async (endpoint, options = {}) => {
  const { method = 'GET', params = {}, body, headers = {} } = options;

  const queryString = new URLSearchParams(params).toString();
  const url = `${env('NEXT_PUBLIC_BACKEND_URL')}/api${endpoint}${
    queryString ? `?${queryString}` : ''
  }`;

  try {
    const fetchOptions = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    };

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    return await response.json();
  } catch (error) {
    console.error('Strapi fetch error:', error);
    return null;
  }
};

/**
 * Checks if the code is running in the browser.
 */
function isBrowser() {
  // eslint-disable-next-line no-underscore-dangle
  return typeof window !== 'undefined' && window.__ENV;
}

/**
 * Reads a safe environment variable from the browser or any environment
 * variable from the server (process.env).
 */
export function env(key) {
  if (isBrowser()) {
    // eslint-disable-next-line no-underscore-dangle
    return window.__ENV[key];
  }

  return process.env[key];
}
