export const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No authorization provided' });
    // Add real auth logic here (e.g., JWT verification)
    next();
  };