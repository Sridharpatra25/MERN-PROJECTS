import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { validationResult } from 'express-validator';
import { ApiResponse } from '../../../shared/types';

export class AuthController {
  /**
   * Register a new user
   * POST /auth/register
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        } as ApiResponse);
        return;
      }

      const { email, password, firstName, lastName, role } = req.body;

      const result = await authService.registerUser({
        email,
        password,
        firstName,
        lastName,
        role
      });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result
      } as ApiResponse);
    } catch (error: any) {
      console.error('Registration error:', error);
      
      if (error.message === 'User with this email already exists') {
        res.status(409).json({
          success: false,
          error: error.message
        } as ApiResponse);
        return;
      }

      res.status(500).json({
        success: false,
        error: 'Internal server error'
      } as ApiResponse);
    }
  }

  /**
   * Login user
   * POST /auth/login
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        } as ApiResponse);
        return;
      }

      const { email, password } = req.body;

      const result = await authService.loginUser({ email, password });

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      } as ApiResponse);
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.message === 'Invalid email or password') {
        res.status(401).json({
          success: false,
          error: error.message
        } as ApiResponse);
        return;
      }

      if (error.message === 'Account is temporarily locked due to multiple failed login attempts') {
        res.status(423).json({
          success: false,
          error: error.message
        } as ApiResponse);
        return;
      }

      if (error.message === 'Account is deactivated') {
        res.status(403).json({
          success: false,
          error: error.message
        } as ApiResponse);
        return;
      }

      res.status(500).json({
        success: false,
        error: 'Internal server error'
      } as ApiResponse);
    }
  }

  /**
   * Refresh access token
   * POST /auth/refresh
   */
  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        } as ApiResponse);
        return;
      }

      const { refreshToken } = req.body;

      const result = await authService.refreshToken({ refreshToken });

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: result
      } as ApiResponse);
    } catch (error: any) {
      console.error('Token refresh error:', error);
      
      if (error.message === 'Invalid refresh token') {
        res.status(401).json({
          success: false,
          error: error.message
        } as ApiResponse);
        return;
      }

      res.status(500).json({
        success: false,
        error: 'Internal server error'
      } as ApiResponse);
    }
  }

  /**
   * Logout user
   * POST /auth/logout
   */
  async logout(req: Request, res: Response): Promise<void> {
    try {
      // Get user ID from JWT token (set by auth middleware)
      const userId = (req as any).user?.userId;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized'
        } as ApiResponse);
        return;
      }

      await authService.logoutUser(userId);

      res.status(200).json({
        success: true,
        message: 'Logout successful'
      } as ApiResponse);
    } catch (error: any) {
      console.error('Logout error:', error);
      
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      } as ApiResponse);
    }
  }

  /**
   * Get user profile
   * GET /auth/profile
   */
  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      // Get user ID from JWT token (set by auth middleware)
      const userId = (req as any).user?.userId;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized'
        } as ApiResponse);
        return;
      }

      const user = await authService.getUserProfile(userId);

      res.status(200).json({
        success: true,
        data: user
      } as ApiResponse);
    } catch (error: any) {
      console.error('Get profile error:', error);
      
      if (error.message === 'User not found') {
        res.status(404).json({
          success: false,
          error: error.message
        } as ApiResponse);
        return;
      }

      res.status(500).json({
        success: false,
        error: 'Internal server error'
      } as ApiResponse);
    }
  }

  /**
   * Update user profile
   * PUT /auth/profile
   */
  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        } as ApiResponse);
        return;
      }

      // Get user ID from JWT token (set by auth middleware)
      const userId = (req as any).user?.userId;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized'
        } as ApiResponse);
        return;
      }

      const { firstName, lastName } = req.body;

      const user = await authService.updateUserProfile(userId, { firstName, lastName });

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: user
      } as ApiResponse);
    } catch (error: any) {
      console.error('Update profile error:', error);
      
      if (error.message === 'User not found') {
        res.status(404).json({
          success: false,
          error: error.message
        } as ApiResponse);
        return;
      }

      res.status(500).json({
        success: false,
        error: 'Internal server error'
      } as ApiResponse);
    }
  }

  /**
   * Change password
   * PUT /auth/change-password
   */
  async changePassword(req: Request, res: Response): Promise<void> {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        } as ApiResponse);
        return;
      }

      // Get user ID from JWT token (set by auth middleware)
      const userId = (req as any).user?.userId;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized'
        } as ApiResponse);
        return;
      }

      const { currentPassword, newPassword } = req.body;

      await authService.changePassword(userId, currentPassword, newPassword);

      res.status(200).json({
        success: true,
        message: 'Password changed successfully'
      } as ApiResponse);
    } catch (error: any) {
      console.error('Change password error:', error);
      
      if (error.message === 'User not found') {
        res.status(404).json({
          success: false,
          error: error.message
        } as ApiResponse);
        return;
      }

      if (error.message === 'Current password is incorrect') {
        res.status(400).json({
          success: false,
          error: error.message
        } as ApiResponse);
        return;
      }

      res.status(500).json({
        success: false,
        error: 'Internal server error'
      } as ApiResponse);
    }
  }

  /**
   * Request password reset
   * POST /auth/forgot-password
   */
  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        } as ApiResponse);
        return;
      }

      const { email } = req.body;

      await authService.requestPasswordReset(email);

      // Always return success to prevent email enumeration
      res.status(200).json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent'
      } as ApiResponse);
    } catch (error: any) {
      console.error('Forgot password error:', error);
      
      // Always return success to prevent email enumeration
      res.status(200).json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent'
      } as ApiResponse);
    }
  }

  /**
   * Reset password
   * POST /auth/reset-password
   */
  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        } as ApiResponse);
        return;
      }

      const { token, newPassword } = req.body;

      await authService.resetPassword(token, newPassword);

      res.status(200).json({
        success: true,
        message: 'Password reset successfully'
      } as ApiResponse);
    } catch (error: any) {
      console.error('Reset password error:', error);
      
      if (error.message === 'Invalid or expired reset token') {
        res.status(400).json({
          success: false,
          error: error.message
        } as ApiResponse);
        return;
      }

      res.status(500).json({
        success: false,
        error: 'Internal server error'
      } as ApiResponse);
    }
  }

  /**
   * Verify token (for internal use by other services)
   * POST /auth/verify
   */
  async verifyToken(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.body;

      if (!token) {
        res.status(400).json({
          success: false,
          error: 'Token is required'
        } as ApiResponse);
        return;
      }

      const decoded = await authService.verifyToken(token);

      res.status(200).json({
        success: true,
        data: decoded
      } as ApiResponse);
    } catch (error: any) {
      console.error('Token verification error:', error);
      
      res.status(401).json({
        success: false,
        error: 'Invalid token'
      } as ApiResponse);
    }
  }
}

export const authController = new AuthController();
