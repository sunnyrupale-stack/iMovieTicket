const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "imovies_jwt_secret_token_college_project_key";

const fetchUser = (req, res, next) => {
  // Get token from auth-token header or standard Authorization header
  let token = req.header("auth-token") || req.header("authorization");

  if (!token) {
    return res.status(401).json({ success: false, error: "Access Denied: No authentication token provided" });
  }

  // Support 'Bearer <token>' format as well
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length).trimLeft();
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified.user || verified;
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: "Please authenticate using a valid token" });
  }
};

module.exports = fetchUser;
