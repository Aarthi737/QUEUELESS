import { User } from '../models/User.js';
import { generateToken } from '../middleware/auth.js';

// @desc    Register a new user
// @route   POST /api/auth/register or POST /api/users/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, preferredLocation, role } = req.body;

    // 1. Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    // 2. Check for duplicate email in MongoDB
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    // 3. Generate initials for avatar (e.g. "Aarthi Sharma" -> "AS")
    const initials = name
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();

    // 4. Create user in MongoDB (pre-save hook hashes password with bcrypt)
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: phone || '',
      preferredLocation: preferredLocation || 'Central City, Metro Region',
      role: role && ['customer', 'staff', 'admin'].includes(role) ? role : 'customer',
      avatar: initials,
    });

    // 5. Generate JWT token
    const token = generateToken(user._id);

    // 6. Return response (password is automatically excluded by User model toJSON)
    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login or POST /api/users/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Check for email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // 2. Find user in MongoDB by email
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // 3. Compare entered password with stored bcrypt hash
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // 4. Generate signed JWT token
    const token = generateToken(user._id);

    // 5. Return success response with user profile
    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get currently authenticated user
// @route   GET /api/auth/me or GET /api/users/me
// @access  Private (Requires Bearer Token)
export const getMe = async (req, res, next) => {
  try {
    // req.user was attached by auth protect middleware
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile or PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const { name, email, phone, preferredLocation } = req.body;

    // Update fields if provided
    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (preferredLocation !== undefined) user.preferredLocation = preferredLocation.trim();

    // Check if new email conflicts with another user
    if (email && email.toLowerCase().trim() !== user.email) {
      const emailExists = await User.findOne({ email: email.toLowerCase().trim() });
      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: 'Email address is already in use by another account',
        });
      }
      user.email = email.toLowerCase().trim();
    }

    // Update avatar initials if name changed
    if (name) {
      user.avatar = user.name
        .split(' ')
        .map((p) => p.charAt(0))
        .join('')
        .substring(0, 2)
        .toUpperCase();
    }

    // Save updated user in MongoDB
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    next(error);
  }
};
