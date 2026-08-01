export const notFound = (req, res) => {
  res.status(404).json({ status: 'error', error: `Route not found: ${req.method} ${req.originalUrl}` });
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ status: 'error', error: err.message || 'Internal server error' });
};

/** Wraps an async route handler so rejected promises reach errorHandler instead of hanging the request. */
export const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
