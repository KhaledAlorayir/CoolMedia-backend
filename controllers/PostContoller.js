import Posts from "../models/Post.js";
import { PostValidation } from "../validation/PostValidation.js";

export const getPosts = async (req, res) => {
	const { page } = req.query;

	try {
		const LIMIT = 4;
		const StartIndex = (Number(page) - 1) * LIMIT;

		const result = await Posts.find()
			.sort({ _id: -1 })
			.limit(LIMIT)
			.skip(StartIndex);

		const total = await Posts.countDocuments({});
		const NumofPages = Math.ceil(total / LIMIT);

		res.status(200).json({ Posts: result, NumofPages, currpage: Number(page) });
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
};

export const submitPost = async (req, res) => {
	if (!req.Userid) return res.json({ message: "you must sign in first" });

	try {
		const data = req.body;

		//first data validation with joi
		const ValidationFail = PostValidation({
			title: data.title,
			description: data.description,
		});

		if (ValidationFail)
			return res.json({
				message: ValidationFail,
			});

		//

		const post = new Posts({ ...data, creator: req.Userid });
		await post.save();
		res.status(200).json(post);
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
};

export const deletePost = async (req, res) => {
	const { id } = req.params;
	if (!req.Userid) return res.json({ message: "you must sign in first" });

	try {
		const post = await Posts.findById(id);

		//check if the person deleting the post is the same one who created it
		if (post.creator !== req.Userid)
			return res.json({ message: "not authorized to delete this post" });

		await Posts.findByIdAndDelete(id);
		res.status(200).json({ message: `item with id : ${id} has been deleted` });
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
};

export const likePost = async (req, res) => {
	const { id } = req.params;

	if (!req.Userid) return res.json({ message: "you must sign in first" });

	try {
		const post = await Posts.findById(id);

		if (!post)
			return res.status(404).json({ message: "no post found with this id" });

		const LikedBefore = post.Likes.findIndex((id) => id === req.Userid);

		if (LikedBefore === -1) {
			//didn't like it
			post.Likes.push(req.Userid);
		} else {
			//did like it
			post.Likes = post.Likes.filter((id) => id !== req.Userid);
		}

		const Updated = await Posts.findByIdAndUpdate(id, post, { new: true });

		res.status(200).json(Updated);
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
};

export const editPost = async (req, res) => {
	const { id } = req.params;
	const { title, description } = req.body;
	if (!req.Userid) return res.json({ message: "you must sign in first" });

	try {
		const post = await Posts.findById(id);

		if (!post)
			return res.status(404).json({ message: "no post found with this id" });

		//check if the person editing the post is the same one who created it
		if (post.creator !== req.Userid)
			return res.json({ message: "not authorized to update this post" });

		//data validation with joi
		const ValidationFail = PostValidation({
			title,
			description,
		});

		if (ValidationFail)
			return res.json({
				message: ValidationFail,
			});

		//

		const Updated = await Posts.findByIdAndUpdate(
			id,
			{ $set: { title, description } },
			{ new: true }
		);

		res.status(200).json(Updated);
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
};

export const getPostsBySearch = async (req, res) => {
	const { q } = req.query;

	try {
		//to make it case insansitve
		const title = new RegExp(q, "i");

		const result = await Posts.find({ title });
		res.json(result);
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
};

export const getPost = async (req, res) => {
	try {
		const { id } = req.params;

		const post = await Posts.findById(id);

		if (post) return res.json(post);

		res.json({ message: "no post found with this id" });
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
};

export const commentOnPost = async (req, res) => {
	const { id } = req.params;
	const { comment } = req.body;

	if (!req.Userid) return res.json({ message: "you must sign in first" });

	try {
		const post = await Posts.findById(id);

		if (!post)
			return res.status(404).json({ message: "no post found with this id" });

		post.comments.push(comment);

		const Updated = await Posts.findByIdAndUpdate(id, post, { new: true });

		res.json(Updated);
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
};
