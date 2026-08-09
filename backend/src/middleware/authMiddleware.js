const supabase = require("../config/supabase");
const pool = require("../config/db");

const protect = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication token is required" });
    }

    const token = authorization.split(" ")[1];

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const result = await pool.query(
      "SELECT id, name, role FROM profiles WHERE id = $1",
      [data.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User profile not found" });
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    return res.status(500).json({ message: "Authentication failed" });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You do not have permission" });
    }

    next();
  };
};
const optionalProtect = async (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  try {

    const token = authHeader.split(" ")[1];

    const { data, error } = await supabase.auth.getUser(token);

    if (!error && data.user) {
      req.user = data.user;
    }

  } catch (error) {
    console.log("Optional auth failed");
  }

  next();

};

module.exports = { protect, authorize, optionalProtect };