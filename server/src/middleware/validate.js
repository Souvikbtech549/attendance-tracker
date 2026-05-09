const { ApiError } = require("../utils/apiError");

function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const message = result.error.errors[0]?.message || "Invalid input";
      throw new ApiError(400, message);
    }

    req.body = result.data;
    next();
  };
}

module.exports = { validate };
