import jwt from 'jsonwebtoken';
import Admin from '../../beckend/Models/adminModel.js';


export const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: "Access Denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(400).json({ message: "Invalid Token." });
  }
}   
export const verifyAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.user.id);
    if (!admin) {
      return res.status(403).json({ message: "Access Denied. Not an admin." });
    }
    next();
  } catch (err) {
    return res.status(500).json({ message: "Server Error." });
  }
};
