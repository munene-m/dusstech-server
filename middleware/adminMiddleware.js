import Auth from "../models/auth.js";
import jwt from "jsonwebtoken";

export const adminProtect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
  
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await Auth.findById(decoded.id).select("-password");
  
        if (user && user.isAdmin) {
          req.admin = user;
          next();
        } else {
          res.status(401).json({error: "Unauthorized admin access"})
        //   throw new Error("Unauthorized admin access");
        }
      } catch (error) {
        res.status(401).json({error: "Invalid token"})
        // throw new Error("Invalid token");
      }
    } else {
      res.status(401).json({error: "No authorization without token"})
    //   throw new Error();
    }
  };
  export default adminProtect