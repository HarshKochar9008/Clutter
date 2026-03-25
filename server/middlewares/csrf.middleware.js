// Lightweight CSRF protection for cookie-based auth.
// For unsafe HTTP methods, require an `x-csrf-token` header to match the `csrfToken` cookie.
const csrfMiddleware = (req, res, next) => {
  const unsafeMethod = !["GET", "HEAD", "OPTIONS"].includes(req.method);
  if (!unsafeMethod) return next();

  const cookieToken = req.cookies?.csrfToken;
  const headerToken = req.headers["x-csrf-token"];

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return res.status(403).json({
      success: false,
      message: "Forbidden - CSRF token invalid or missing.",
    });
  }

  next();
};

module.exports = csrfMiddleware;

