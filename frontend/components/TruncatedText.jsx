import React from 'react';

const TruncatedText = ({
  text,
  maxLength = 150,
  className = 'text-gray-600 text-sm mb-4',
}) => {
  if (text.length <= maxLength) {
    return <p className={className}>{text}</p>;
  }

  const truncatedText = text.substring(0, maxLength).trim() + '...';

  return <p className={className}>{truncatedText}</p>;
};

export default TruncatedText;
