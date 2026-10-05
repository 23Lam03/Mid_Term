import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const TOKEN_TTL = '7d';

export const register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    const exists = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (exists) {
      return res.status(400).json({ statusCode: 400, message: 'Email đã tồn tại' });
    }

    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      userName,
      email: String(email).toLowerCase().trim(),
      password: hash,
    });

    return res.status(201).json({
      statusCode: 201,
      message: 'Đăng ký thành công',
      data: {
        _id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ statusCode: 400, message: 'Email đã tồn tại' });
    }
    return res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ statusCode: 401, message: 'Email hoặc mật khẩu không đúng' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ statusCode: 401, message: 'Email hoặc mật khẩu không đúng' });
    }

    const randomString = crypto.randomUUID();
    const apiKey = `mern-$${user._id}$-$${user.email}$-$${randomString}$`;

    const token = jwt.sign(
      { _id: String(user._id), email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: TOKEN_TTL }
    );
    const decoded = jwt.decode(token);
    const tokenExp = decoded && decoded.exp ? new Date(decoded.exp * 1000) : null;

    user.apiKey = apiKey;
    user.token = token;
    user.tokenExp = tokenExp;
    await user.save();

    return res.status(200).json({
      statusCode: 200,
      message: 'Đăng nhập thành công',
      data: {
        _id: user._id,
        email: user.email,
        apiKey,
        token,
        tokenExp,
      },
    });
  } catch (err) {
    return res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export const profile = async (req, res) => {
  try {
    const user = req.user;
    return res.status(200).json({
      statusCode: 200,
      message: 'Lấy thông tin người dùng thành công',
      data: {
        _id: user._id,
        userName: user.userName,
        email: user.email,
      },
    });
  } catch (err) {
    return res.status(500).json({ statusCode: 500, message: err.message });
  }
};