const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res
      .status(401)
      .json({ error: "Acesso negado. Token não fornecido." });

  try {
    const verified = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret",
    );
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ error: "Token inválido ou expirado." });
  }
}

function authorizeRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res
        .status(403)
        .json({ error: "Acesso negado. Permissão insuficiente." });
    }
    next();
  };
}

module.exports = { authMiddleware, authorizeRole };
