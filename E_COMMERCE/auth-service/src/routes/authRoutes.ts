import { Router } from 'express';
import { authController } from '../controllers/authController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import {
  registerValidation,
  loginValidation,
  refreshTokenValidation,
  updateProfileValidation,
  changePasswordValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  verifyTokenValidation
} from '../middleware/validation';

const router = Router();

/**
 * Public routes (no authentication required)
 */

// User registration
router.post('/register', registerValidation, authController.register);

// User login
router.post('/login', loginValidation, authController.login);

// Refresh access token
router.post('/refresh', refreshTokenValidation, authController.refreshToken);

// Forgot password
router.post('/forgot-password', forgotPasswordValidation, authController.forgotPassword);

// Reset password
router.post('/reset-password', resetPasswordValidation, authController.resetPassword);

// Verify token (for internal service communication)
router.post('/verify', verifyTokenValidation, authController.verifyToken);

/**
 * Protected routes (authentication required)
 */

// User logout
router.post('/logout', authenticateToken, authController.logout);

// Get user profile
router.get('/profile', authenticateToken, authController.getProfile);

// Update user profile
router.put('/profile', authenticateToken, updateProfileValidation, authController.updateProfile);

// Change password
router.put('/change-password', authenticateToken, changePasswordValidation, authController.changePassword);

/**
 * Admin-only routes
 */

// Get all users (admin only)
router.get('/users', authenticateToken, requireAdmin, (req, res) => {
  // TODO: Implement admin user management
  res.status(501).json({
    success: false,
    error: 'Not implemented yet'
  });
});

// Get user by ID (admin only)
router.get('/users/:userId', authenticateToken, requireAdmin, (req, res) => {
  // TODO: Implement admin user management
  res.status(501).json({
    success: false,
    error: 'Not implemented yet'
  });
});

// Update user (admin only)
router.put('/users/:userId', authenticateToken, requireAdmin, (req, res) => {
  // TODO: Implement admin user management
  res.status(501).json({
    success: false,
    error: 'Not implemented yet'
  });
});

// Deactivate user (admin only)
router.delete('/users/:userId', authenticateToken, requireAdmin, (req, res) => {
  // TODO: Implement admin user management
  res.status(501).json({
    success: false,
    error: 'Not implemented yet'
  });
});

export default router;
