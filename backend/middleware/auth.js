import jwt from 'jsonwebtoken';

/** Verifies the Bearer token and attaches the decoded payload as req.user. */
export const protect = (req, res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ status: 'error', error: 'Not authenticated.' });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ status: 'error', error: 'Invalid or expired session. Please sign in again.' });
  }
};

/** Restricts a route to the given roles. Must run after `protect`. */
export const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ status: 'error', error: 'You do not have permission to do this.' });
    }
    next();
  };
