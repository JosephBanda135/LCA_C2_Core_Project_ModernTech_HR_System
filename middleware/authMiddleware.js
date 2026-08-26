const jwt = require("jsonwebtoken");

// Checks that a valid JWT token was sent before allowing the request through
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"]; // "Bearer <token>"
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  // Verify the token using our secret key
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token." });
    }

    req.user = user; // attach user info for later routes to use
    next(); // let the request continue
  });
}

module.exports = authenticateToken;
