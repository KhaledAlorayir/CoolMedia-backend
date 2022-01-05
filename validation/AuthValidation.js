import joi from "joi";

export const SignupValidation = (data) => {
	const Conditions = joi.object({
		username: joi.string().min(4).max(30).required(),
		email: joi.string().email().required(),
		password: joi.string().min(8).required(),
		repassword: joi.string().min(8).required(),
	});

	const result = Conditions.validate(data);

	if (result.error) {
		return result.error.details[0].message;
	}

	return false;
};

export const SigninValidation = (data) => {
	const Conditions = joi.object({
		email: joi.string().email().required(),
		password: joi.string().min(8).required(),
	});

	const result = Conditions.validate(data);

	if (result.error) {
		return result.error.details[0].message;
	}

	return false;
};
