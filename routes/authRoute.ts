import express from "express";
const router = express.Router();
import {
  createUser,
  loginUser,
  registerAdmin,
  loginAdmin,
} from "../controllers/authController";
router.route("/register").post(createUser);
router.route("/login").post(loginUser);
router.route("/register-admin").post(registerAdmin);
router.route("/login-admin").post(loginAdmin);

export default router;
