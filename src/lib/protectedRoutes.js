import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
const protectedRoutes = async (req, res, next) => {
  try {
    console.log("req.headers:", req.headers);  
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided, access denied" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(401).json({ message: "Invalid token user" });

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Token is invalid or expired" });
  }
};


export default protectedRoutes;
