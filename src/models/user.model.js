import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true },
    apiKey: { type: String, default: null },
    token: { type: String, default: null },
    tokenExp: { type: Date, default: null },
  }
);

const User = mongoose.model('User', userSchema);

export default User;