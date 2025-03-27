import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const fetchStrapiData = async (endpoint, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${endpoint}?${queryString}`;

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
