import express from "express";
import {
  registerUser,
  loginUser,
  authenticate,
} from "../Controller/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authenticate);

export default router;
