const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegister = (req, res, next) => {
  const { userName, email, password } = req.body;

  if (!userName || !String(userName).trim()) {
    return res
      .status(400)
      .json({ statusCode: 400, message: "userName là bắt buộc" });
  }
  if (!email || !String(email).trim()) {
    return res
      .status(400)
      .json({ statusCode: 400, message: "email là bắt buộc" });
  }
  if (!EMAIL_REGEX.test(String(email).trim())) {
    return res
      .status(400)
      .json({ statusCode: 400, message: "email không hợp lệ" });
  }
  if (!password || String(password).length < 6) {
    return res
      .status(400)
      .json({
        statusCode: 400,
        message: "password là bắt buộc và tối thiểu 6 ký tự",
      });
  }

  return next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ statusCode: 400, message: "email và password là bắt buộc" });
  }

  return next();
};

export const validateCreatePost = (req, res, next) => {
  const { userId, content } = req.body;

  if (!userId) {
    return res
      .status(400)
      .json({ statusCode: 400, message: "userId là bắt buộc" });
  }
  if (!content || !String(content).trim()) {
    return res
      .status(400)
      .json({ statusCode: 400, message: "content là bắt buộc" });
  }

  return next();
};

export const validateUpdatePost = (req, res, next) => {
  const { content } = req.body;

  if (!content || !String(content).trim()) {
    return res
      .status(400)
      .json({ statusCode: 400, message: "content là bắt buộc" });
  }

  return next();
};
