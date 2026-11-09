import User from '../models/User.js';
import { signToken } from '../utils/token.js';

const authResponse = (user) => ({ token: signToken(user._id), user });

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (await User.exists({ email })) {
    return res.status(400).json({ message: 'This email is already registered' });
  }
  const user = await User.create({ name, email, password });
  res.status(201).json(authResponse(user));
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  res.json(authResponse(user));
};

export const getMe = (req, res) => {
  res.json({ user: req.user });
};
