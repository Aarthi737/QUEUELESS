import jwt from 'jsonwebtoken';

export const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'queueless_fallback_dev_secret_2026';
  return jwt.sign({ id: userId }, secret, {
    expiresIn: '30d',
  });
};
