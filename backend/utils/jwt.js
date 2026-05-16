import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export const generateTokens = (payload) => {
  const access = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '15m',
  });

  const refresh = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.REFRESH_EXPIRE || '7d',
  });

  return {
    access_token: access,
    refresh_token: refresh,
  };
};
