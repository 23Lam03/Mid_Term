import mongoose from "mongoose";
import Post from "../models/post.model.js";

export const createPost = async (req, res) => {
  try {
    const { userId, content } = req.body;

    if (String(req.user._id) !== String(userId)) {
      return res
        .status(403)
        .json({
          statusCode: 403,
          message: "userId không khớp với tài khoản đã đăng nhập",
        });
    }

    const post = await Post.create({ userId, content });

    return res.status(201).json({
      statusCode: 201,
      message: "Tạo bài post thành công",
      data: post,
    });
  } catch (err) {
    return res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res
        .status(404)
        .json({ statusCode: 404, message: "Không tìm thấy bài post" });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res
        .status(404)
        .json({ statusCode: 404, message: "Không tìm thấy bài post" });
    }

    if (String(post.userId) !== String(req.user._id)) {
      return res
        .status(403)
        .json({
          statusCode: 403,
          message: "Bạn không có quyền cập nhật bài post này",
        });
    }

    post.content = content;
    await post.save();

    return res.status(200).json({
      statusCode: 200,
      message: "Cập nhật bài post thành công",
      data: post,
    });
  } catch (err) {
    return res.status(500).json({ statusCode: 500, message: err.message });
  }
};
