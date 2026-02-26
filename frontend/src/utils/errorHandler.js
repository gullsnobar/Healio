export const getErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return 'An unexpected error occurred';
};

export const handleApiError = (error) => {
  console.error('API Error:', error);
  return getErrorMessage(error);
};
