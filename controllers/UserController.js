import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import {
	SigninValidation,
	SignupValidation,
} from "../validation/AuthValidation.js";

export const Signup = async (req, res) => {
	try {
		const { username, email, password, repassword } = req.body;

		//first data validation with joi
		const ValidationFail = SignupValidation({
			username,
			email,
			password,
			repassword,
		});

		if (ValidationFail)
			return res.json({
				message: ValidationFail,
			});

		//

		const EmailExists = await User.findOne({ email });
		const UnExists = await User.findOne({ username });

		if (EmailExists)
			return res.json({
				message: "there is already an account with this email",
			});

		if (UnExists)
			return res.json({
				message: "username is taken",
			});

		if (password !== repassword)
			return res.json({ message: "passwords don't match" });

		const HashedPassword = await bcrypt.hash(password, 12);

		const SavedUser = await User.create({
			username,
			email,
			password: HashedPassword,
		});

		const token = jwt.sign(
			{ email: SavedUser.email, id: SavedUser._id },
			process.env.JWT_SECRET,
			{ expiresIn: "1h" }
		);

		res.status(200).json({ user: SavedUser, token });
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

export const Signin = async (req, res) => {
	try {
		const { email, password } = req.body;

		//first data validation with joi
		const ValidationFail = SigninValidation({
			email,
			password,
		});

		if (ValidationFail)
			return res.json({
				message: ValidationFail,
			});

		//

		const UserResult = await User.findOne({ email });

		if (!UserResult) return res.json({ message: "user doesn't exists" });

		const Matches = await bcrypt.compare(password, UserResult.password);

		if (!Matches) return res.json({ message: "wrong e-mail or password" });

		const token = jwt.sign(
			{ email: UserResult.email, id: UserResult._id },
			process.env.JWT_SECRET,
			{ expiresIn: "1h" }
		);

		res.status(200).json({ user: UserResult, token });
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};
