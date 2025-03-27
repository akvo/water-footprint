import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const fetchStrapiData = async (endpoint, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `http://localhost:1337/api${endpoint}?${queryString}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    return await response.json();
  } catch (error) {
    console.error('Strapi fetch error:', error);
    return null;
  }
};
