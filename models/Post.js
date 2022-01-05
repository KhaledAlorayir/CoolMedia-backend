import mongoose from "mongoose";

const PostSchema = mongoose.Schema({
	creator: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	item: {
		type: String,
		required: true,
	},
	Likes: {
		type: [String],
		default: [],
	},
	comments: {
		type: [String],
		default: [],
	},
	date: {
		type: Date,
		default: new Date(),
	},
});

const PostModel = mongoose.model("Posts", PostSchema);
export default PostModel;
