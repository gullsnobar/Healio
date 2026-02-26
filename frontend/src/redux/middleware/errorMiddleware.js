export const errorMiddleware = (store) => (next) => (action) => {
  if (action.type?.endsWith('/rejected')) {
    console.error('Redux Error:', action.type, action.payload || action.error?.message);
  }
  return next(action);
};
