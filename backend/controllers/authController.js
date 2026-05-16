import { User } from '../models/index.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { generateToken, verifyToken, generateTokens } from '../utils/jwt.js';

export const signup = async (req, res) => {
  try {
    const { email, username, full_name, password, role } = req.body;

    // Check if user exists by email or username
    const existingByEmail = await User.findOne({ email });
    const existingByUsername = await User.findOne({ username });
    if (existingByEmail) {
      return res.status(400).json({ detail: 'Email already registered' });
    }
    if (existingByUsername) {
      return res.status(400).json({ detail: 'Username already taken' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Split full name into first/last if possible
    let firstName = '';
    let lastName = '';
    if (full_name) {
      const parts = full_name.trim().split(/\s+/);
      firstName = parts.shift() || '';
      lastName = parts.join(' ') || '';
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      fullName: full_name || `${firstName} ${lastName}`.trim(),
      username,
      email,
      password: hashedPassword,
      role: role || 'member',
    });

    const tokens = generateTokens({ id: user._id, email: user.email, role: user.role });

    res.status(201).json({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      user: {
        id: user._id,
        username: user.username,
        full_name: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ detail: 'Signup error', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ detail: 'Invalid email or password' });
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ detail: 'Invalid email or password' });
    }

    // Generate tokens
    const tokens = generateTokens({ id: user._id, email: user.email, role: user.role });

    res.json({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      user: {
        id: user._id,
        username: user.username,
        full_name: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ detail: 'Login error', error: error.message });
  }
};

export const refresh = async (req, res) => {
  try {
    const { refresh_token } = req.body;
    if (!refresh_token) return res.status(400).json({ detail: 'Refresh token required' });

    const decoded = verifyToken(refresh_token);
    if (!decoded) return res.status(401).json({ detail: 'Invalid or expired refresh token' });

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ detail: 'User not found' });

    const tokens = generateTokens({ id: user._id, email: user.email, role: user.role });

    res.json({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ detail: 'Refresh error' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    res.json({
      user: {
        id: user._id,
        username: user.username,
        full_name: user.fullName,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving profile' });
  }
};
