const jwt = require('jsonwebtoken');

// Middleware to verify the token and role
const authenticateUser = (roles = []) => {
  return async (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];  // Get token from Authorization header
    
    if (!token) {
      return res.status(403).json({ message: 'You need to login to access this page' });
    }

    try {
      const decoded = jwt.verify(token, 'accessTokenSecret'); // Verify token
      console.log('Decoded token:', decoded);  // Log the decoded token

      // Check if the role of the user matches the allowed roles
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Access denied. You don\'t have permission to access this page' });
      }

      req.user = decoded;  // Attach user info to request
      next();  // Proceed to the next middleware
    } catch (err) {
      console.error('Error verifying token:', err);
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
  };
};

module.exports = authenticateUser;
