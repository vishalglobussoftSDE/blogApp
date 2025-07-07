import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';
console.log(`this is jwt ${JWT_SECRET}` )

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  // console.log(authHeader)
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1]; // gets the token part only
  // console.log(token)
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // add decoded token (user info) to request
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};
