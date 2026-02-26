export const formatNumber = (n) => n?.toLocaleString() || '0';
export const formatPercentage = (value, total) => total > 0 ? Math.round((value / total) * 100) + '%' : '0%';
export const truncateText = (text, maxLength = 50) => text?.length > maxLength ? text.substring(0, maxLength) + '...' : text;
export const capitalizeFirst = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
