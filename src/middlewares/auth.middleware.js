import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

const INVALID_KEY = { statusCode: 401, message: 'apiKey hoặc token không hợp lệ' };
const MISSING_AUTH = { statusCode: 400, message: 'Thiếu apiKey hoặc token' };

const extractBearer = (header) => {
  if (!header || typeof header !== 'string') return null;
  const [scheme, value] = header.split(' ');
  if (scheme !== 'Bearer' || !value) return null;
  return value.trim();
};

export const checkAuth = async (req, res, next) => {
  try {
    const apiKeyRaw =
      req.query.apiKey ||
      (req.body && req.body.apiKey) ||
      req.headers['apikey'];
    const apiKey = typeof apiKeyRaw === 'string' ? apiKeyRaw.trim() : null;

    const bearerToken = extractBearer(req.headers['authorization']);
    const headerTokenRaw = req.headers['token'];
    const headerToken = typeof headerTokenRaw === 'string' ? headerTokenRaw.trim() : null;

    const token = bearerToken || headerToken;

    if (!apiKey && !token) {
      return res.status(400).json(MISSING_AUTH);
    }

    let user = null;

    if (apiKey) {
      const parts = apiKey.split('-$');
      if (parts.length === 4 && parts[0] === 'mern') {
        const userId = parts[1].slice(0, -1);
        const email = parts[2].slice(0, -1);
        const randomString = parts[3].slice(0, -1);

        if (userId && email && randomString && /^[0-9a-fA-F]{24}$/.test(userId)) {
          const found = await User.findById(userId);
          if (
            found &&
            found.email === email &&
            found.apiKey &&
            found.apiKey === apiKey
          ) {
            user = found;
          }
        }
      }
    }

    if (!user && token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const found = await User.findById(decoded._id);
        if (found && found.token === token) {
          user = found;
        }
      } catch (err) {
        if (err && err.name === 'TokenExpiredError') {
          return res.status(401).json({ statusCode: 401, message: 'Token đã hết hạn' });
        }
      }
    }

    if (!user) {
      return res.status(401).json(INVALID_KEY);
    }

    req.user = user;
    return next();
  } catch (err) {
    return res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export const checkTokenOnly = async (req, res, next) => {
  try {
    const bearerToken = extractBearer(req.headers['authorization']);
    const headerTokenRaw = req.headers['token'];
    const token = bearerToken || (typeof headerTokenRaw === 'string' ? headerTokenRaw.trim() : null);

    if (!token) {
      return res.status(400).json({ statusCode: 400, message: 'Thiếu token' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err && err.name === 'TokenExpiredError') {
        return res.status(401).json({ statusCode: 401, message: 'Token đã hết hạn' });
      }
      return res.status(401).json({ statusCode: 401, message: 'Token không hợp lệ' });
    }

    const user = await User.findById(decoded._id);
    if (!user || user.token !== token) {
      return res.status(401).json({ statusCode: 401, message: 'Token không hợp lệ' });
    }

    req.user = user;
    return next();
  } catch (err) {
    return res.status(500).json({ statusCode: 500, message: err.message });
  }
};