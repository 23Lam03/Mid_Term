import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoute from './src/routes/user.route.js';
import postRoute from './src/routes/post.route.js';

dotenv.config();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'OK' });
});

app.use('/users', userRoute);
app.use('/posts', postRoute);

const PORT = process.env.PORT;

mongoose.connect(process.env.URI_MONGODB)
  .then(() => {
    console.log('Đã kết nối MongoDB');
    app.listen(PORT, () => {
      console.log(`Server chạy ở port ${PORT}`);
    });
  })
  .catch(err => {
    console.log('Lỗi kết nối:', err.message);
  });