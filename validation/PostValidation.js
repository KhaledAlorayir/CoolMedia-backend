import joi from "joi";

export const PostValidation = (data) => {
	const Conditions = joi.object({
		title: joi.string().min(3).max(25).required(),
		description: joi.string().min(3).max(255).required(),
	});

	const result = Conditions.validate(data);

	if (result.error) {
		return result.error.details[0].message;
	}

	return false;
};
