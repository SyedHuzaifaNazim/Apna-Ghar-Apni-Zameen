import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { User } from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const SALT_ROUNDS = 10;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const signToken = user =>
  jwt.sign({ id: user._id.toString(), email: user.email, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });

const toPublicUser = user => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  const missingFields = ['name', 'email', 'password'].filter(field => !req.body[field]);
  if (missingFields.length > 0) {
    return res.status(400).json({ status: 'error', error: `Missing fields: ${missingFields.join(', ')}` });
  }
  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ status: 'error', error: 'Please provide a valid email address.' });
  }
  if (password.length < 8) {
    return res.status(400).json({ status: 'error', error: 'Password must be at least 8 characters.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    return res.status(409).json({ status: 'error', error: 'An account with this email already exists.' });
  }

  // 'admin' is never assignable through public signup — only 'buyer'/'agent'.
  const safeRole = role === 'agent' ? 'agent' : 'buyer';

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  await User.create({ name: name.trim(), email: normalizedEmail, password: hashedPassword, phone, role: safeRole });

  res.status(201).json({ status: 'ok', message: 'Account created successfully.' });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ status: 'error', error: 'Email and password are required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail }).select('+password');

  // Same generic message whether the email doesn't exist or the password is
  // wrong — never reveal which one it was.
  const invalidCredentials = () => res.status(401).json({ status: 'error', error: 'Invalid email or password.' });

  if (!user) return invalidCredentials();

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) return invalidCredentials();

  res.json({ status: 'ok', token: signToken(user), user: toPublicUser(user) });
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ status: 'error', error: 'User not found.' });
  res.json({ status: 'ok', user: toPublicUser(user) });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;

  const updates = {};
  if (name !== undefined) {
    if (!name.trim()) return res.status(400).json({ status: 'error', error: 'Name cannot be empty.' });
    updates.name = name.trim();
  }
  if (phone !== undefined) updates.phone = phone;

  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true });
  if (!user) return res.status(404).json({ status: 'error', error: 'User not found.' });

  res.json({ status: 'ok', user: toPublicUser(user) });
});
