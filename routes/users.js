import express from "express";
const router = express.Router();

import { Signup, Signin } from "../controllers/UserController.js";

//routes
router.post("/signup", Signup);
router.post("/signin", Signin);

export default router;
