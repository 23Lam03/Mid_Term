import { Router } from 'express';
import { createPost, updatePost } from '../controllers/post.controller.js';
import { validateCreatePost, validateUpdatePost } from '../middlewares/validate.middleware.js';
import { checkAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/', checkAuth, validateCreatePost, createPost);
router.put('/:id', checkAuth, validateUpdatePost, updatePost);

export default router;