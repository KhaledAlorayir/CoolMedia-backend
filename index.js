//imports
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import PostRoutes from "./routes/posts.js";
import UserRoutes from "./routes/users.js";
import helmet from "helmet";

//declares
const app = express();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server is running"));
dotenv.config();

//use
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "40mb" }));
app.use("/post", PostRoutes);
app.use("/user", UserRoutes);

//DB Connection
mongoose.connect(
	process.env.DB_CONNECT,
	{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
	() => console.log("Connected To DB")
);

//index
app.get("/", (req, res) => {
	res.status(200).send("Welcome to CoolMedia API");
});
