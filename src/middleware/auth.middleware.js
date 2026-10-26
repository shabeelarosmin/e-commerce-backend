import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is required",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured");

      return res.status(500).json({
        success: false,
        message: "Server authentication configuration error",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    console.log("Authenticated user ID:", decoded.id || decoded._id);
    console.log("Authenticated user role:", decoded.role);

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login.",
      });
    }

    const userRole = String(req.user.role || "")
      .trim()
      .toLowerCase();

    const allowedRoles = roles.map((role) => String(role).trim().toLowerCase());

    // Debug: inspect role authorization
    console.log("ROLE CHECK:", {
      userRole,
      allowedRoles,
    });

    if (!allowedRoles.includes(userRole)) {
      console.log("Access denied:", {
        userRole,
        allowedRoles,
      });

      return res.status(403).json({
        success: false,
        message: "Access denied. Admin permission required.",
      });
    }

    next();
  };
};
export default authMiddleware;