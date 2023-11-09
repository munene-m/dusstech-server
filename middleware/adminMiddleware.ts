import { Request, Response, NextFunction } from "express";
import Auth from "../models/auth";
import jwt, { JwtPayload } from "jsonwebtoken";
interface DecodedToken extends JwtPayload {
  userId: string; // Adjust the structure as needed based on your token
}
export const adminProtect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as DecodedToken;
      const user = await Auth.findById(decoded.id).select("-password");

      if (user && user.isAdmin) {
        req.admin = user;
        next();
      } else {
        res.status(401).json({ error: "Unauthorized admin access" });
        //   throw new Error("Unauthorized admin access");
      }
    } catch (error) {
      res.status(401).json({ error: "Invalid token" });
      // throw new Error("Invalid token");
    }
  } else {
    res.status(401).json({ error: "No authorization without token" });
    //   throw new Error();
  }
};
export default adminProtect;
