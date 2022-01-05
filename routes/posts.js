import express from "express";
import Auth from "../middleware/Auth.js";

import {
	getPosts,
	submitPost,
	deletePost,
	likePost,
	editPost,
	getPostsBySearch,
	getPost,
	commentOnPost,
} from "../controllers/PostContoller.js";

const router = express.Router();

//Routes
router.get("/", getPosts);
router.post("/submit", Auth, submitPost);
router.delete("/:id/delete", Auth, deletePost);
router.patch("/:id/like", Auth, likePost);
router.patch("/:id/edit", Auth, editPost);
router.get("/search", getPostsBySearch);
router.get("/:id", getPost);
router.patch("/:id/comment", Auth, commentOnPost);

export default router;
