import { Router } from 'express';
import { register, login, profile } from '../controllers/user.controller.js';
import { validateRegister, validateLogin } from '../middlewares/validate.middleware.js';
import { checkTokenOnly } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/profile', checkTokenOnly, profile);

export default router;