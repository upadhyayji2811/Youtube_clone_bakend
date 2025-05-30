import express from "express";
import {
  getComments,
  addComment,
  editComment,
  deleteComment,
} from "../Controller/commentController.js";
import authenticateUser from "../Middleware/authenticateUser.js";
const router = express.Router();

router.get("/:videoId", getComments);
router.post("/:id", authenticateUser, addComment);
router.put("/:id", editComment);
router.delete("/:id", deleteComment);

export default router;
