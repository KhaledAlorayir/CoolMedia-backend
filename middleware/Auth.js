import jwt from "jsonwebtoken";

const Auth = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		//check if singed with our auth or with google's
		const isCustomToken = token.length < 500;

		let decoded;

		if (token && isCustomToken) {
			decoded = jwt.verify(token, process.env.JWT_SECRET);
			req.Userid = decoded.id;
		} else {
			decoded = jwt.decode(token);
			req.Userid = decoded.sub;
		}

		next();
	} catch (err) {
		console.log(err);
	}
};

export default Auth;
