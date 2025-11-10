/**
 * Extract JWT token from Authorization header
 * @param {Object} req - Express request object
 * @returns {string|null} - JWT token or null
 */
export const extractToken = (req) => {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
};

/**
 * Middleware to extract and attach token to request
 */
export const attachToken = (req, res, next) => {
  req.token = extractToken(req);
  next();
};


