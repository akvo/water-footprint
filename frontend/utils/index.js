import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const fetchStrapiData = async (endpoint, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `${env('NEXT_PUBLIC_BACKEND_URL')}/api${endpoint}?${queryString}`;

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

export const convertRichTextToHTML = (content) => {
  if (!content || !Array.isArray(content)) return '';

  const renderChildren = (children) => {
    return children
      .map((child) => {
        let renderedText = child.text || '';

        if (child.bold) renderedText = `<strong>${renderedText}</strong>`;
        if (child.italic) renderedText = `<em>${renderedText}</em>`;
        if (child.underline) renderedText = `<u>${renderedText}</u>`;
        if (child.strikethrough) renderedText = `<del>${renderedText}</del>`;

        if (child.type === 'link') {
          renderedText = `<a href="${child.url}" ${
            child.newTab ? 'target="_blank" rel="noopener noreferrer"' : ''
          }>${renderedText}</a>`;
        }

        return renderedText;
      })
      .join('');
  };

  return content
    .map((block) => {
      switch (block.type) {
        case 'paragraph':
          return `<p>${renderChildren(block.children)}</p>`;

        case 'heading':
          const level = block.level || 2;
          return `<h${level}>${renderChildren(block.children)}</h${level}>`;

        case 'list':
          const listType = block.format === 'ordered' ? 'ol' : 'ul';
          const listItems = block.children
            .map((item) => `<li>${renderChildren(item.children)}</li>`)
            .join('');
          return `<${listType}>${listItems}</${listType}>`;

        case 'quote':
          return `<blockquote>${renderChildren(block.children)}</blockquote>`;

        case 'code':
          return `<pre><code>${renderChildren(block.children)}</code></pre>`;

        case 'image':
          return block.image.url
            ? `<img src="${block.image.url}" alt="${
                block.image.alternativeText || ''
              }" ${block.image.width ? `width="${block.image.width}"` : ''} ${
                block.image.height ? `height="${block.image.height}"` : ''
              } />`
            : '';

        case 'divider':
          return '<hr />';

        default:
          return '';
      }
    })
    .join('');
};
