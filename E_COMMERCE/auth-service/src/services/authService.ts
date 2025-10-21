import { User, IUser } from '../models/User';
import { UserRole } from '../../../shared/types';
import { rabbitMQClient, QUEUES, EXCHANGES } from '../../../shared/utils/rabbitmq';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { createClient } from 'redis';

export interface RegisterUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<IUser, 'password' | 'refreshToken'>;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenData {
  refreshToken: string;
}

export class AuthService {
  private redisClient: ReturnType<typeof createClient>;

  constructor() {
    this.redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });
    this.redisClient.connect().catch(console.error);
  }

  /**
   * Register a new user
   */
  async registerUser(userData: RegisterUserData): Promise<AuthResponse> {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email.toLowerCase() });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Create new user
      const user = new User({
        ...userData,
        email: userData.email.toLowerCase(),
        role: userData.role || UserRole.CUSTOMER
      });

      await user.save();

      // Generate tokens
      const accessToken = user.generateAuthToken();
      const refreshToken = user.generateRefreshToken();

      // Store refresh token in Redis for better security
      await this.redisClient.setEx(
        `refresh_token:${user._id}`,
        7 * 24 * 60 * 60, // 7 days
        refreshToken
      );

      // Publish user created event to RabbitMQ
      await this.publishUserEvent('user.created', {
        userId: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      });

      return {
        user: user.toJSON(),
        accessToken,
        refreshToken
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Authenticate user login
   */
  async loginUser(loginData: LoginData): Promise<AuthResponse> {
    try {
      // Find user and include password for comparison
      const user = await User.findOne({ email: loginData.email.toLowerCase() }).select('+password');
      
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Check if account is locked
      if (user.isLocked()) {
        throw new Error('Account is temporarily locked due to multiple failed login attempts');
      }

      // Check if user is active
      if (!user.isActive) {
        throw new Error('Account is deactivated');
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(loginData.password);
      if (!isPasswordValid) {
        await user.incrementLoginAttempts();
        throw new Error('Invalid email or password');
      }

      // Reset login attempts on successful login
      await user.resetLoginAttempts();

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate tokens
      const accessToken = user.generateAuthToken();
      const refreshToken = user.generateRefreshToken();

      // Store refresh token in Redis
      await this.redisClient.setEx(
        `refresh_token:${user._id}`,
        7 * 24 * 60 * 60, // 7 days
        refreshToken
      );

      // Publish user login event
      await this.publishUserEvent('user.login', {
        userId: user._id.toString(),
        email: user.email,
        lastLogin: user.lastLogin
      });

      return {
        user: user.toJSON(),
        accessToken,
        refreshToken
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(refreshTokenData: RefreshTokenData): Promise<{ accessToken: string }> {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshTokenData.refreshToken, process.env.JWT_REFRESH_SECRET!) as any;
      
      // Check if refresh token exists in Redis
      const storedToken = await this.redisClient.get(`refresh_token:${decoded.userId}`);
      if (!storedToken || storedToken !== refreshTokenData.refreshToken) {
        throw new Error('Invalid refresh token');
      }

      // Get user
      const user = await User.findById(decoded.userId);
      if (!user || !user.isActive) {
        throw new Error('User not found or inactive');
      }

      // Generate new access token
      const accessToken = user.generateAuthToken();

      return { accessToken };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  /**
   * Logout user (invalidate refresh token)
   */
  async logoutUser(userId: string): Promise<void> {
    try {
      // Remove refresh token from Redis
      await this.redisClient.del(`refresh_token:${userId}`);
      
      // Publish logout event
      await this.publishUserEvent('user.logout', { userId });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user profile
   */
  async getUserProfile(userId: string): Promise<Omit<IUser, 'password' | 'refreshToken'>> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      return user.toJSON();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(userId: string, updateData: Partial<Pick<IUser, 'firstName' | 'lastName'>>): Promise<Omit<IUser, 'password' | 'refreshToken'>> {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true }
      );

      if (!user) {
        throw new Error('User not found');
      }

      // Publish user updated event
      await this.publishUserEvent('user.updated', {
        userId: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      });

      return user.toJSON();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Change user password
   */
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    try {
      const user = await User.findById(userId).select('+password');
      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      // Update password
      user.password = newPassword;
      await user.save();

      // Invalidate all refresh tokens
      await this.redisClient.del(`refresh_token:${userId}`);

      // Publish password change event
      await this.publishUserEvent('user.password_changed', { userId: user._id.toString() });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<void> {
    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        // Don't reveal if user exists or not
        return;
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      user.passwordResetToken = resetToken;
      user.passwordResetExpires = resetTokenExpiry;
      await user.save();

      // Publish password reset request event
      await this.publishUserEvent('user.password_reset_requested', {
        userId: user._id.toString(),
        email: user.email,
        resetToken
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Reset password using token
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const user = await User.findOne({
        passwordResetToken: token,
        passwordResetExpires: { $gt: new Date() }
      });

      if (!user) {
        throw new Error('Invalid or expired reset token');
      }

      // Update password and clear reset token
      user.password = newPassword;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      // Invalidate all refresh tokens
      await this.redisClient.del(`refresh_token:${user._id}`);

      // Publish password reset event
      await this.publishUserEvent('user.password_reset', {
        userId: user._id.toString(),
        email: user.email
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Verify JWT token
   */
  async verifyToken(token: string): Promise<any> {
    try {
      return jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  /**
   * Publish user events to RabbitMQ
   */
  private async publishUserEvent(eventType: string, data: any): Promise<void> {
    try {
      if (rabbitMQClient.isConnected()) {
        await rabbitMQClient.publishToExchange(
          EXCHANGES.USER_EVENTS,
          eventType,
          {
            type: eventType,
            data,
            timestamp: new Date(),
            correlationId: crypto.randomUUID()
          }
        );
      }
    } catch (error) {
      console.error('Failed to publish user event:', error);
      // Don't throw error as this is not critical for the main flow
    }
  }

  /**
   * Cleanup method
   */
  async cleanup(): Promise<void> {
    try {
      await this.redisClient.quit();
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }
}

export const authService = new AuthService();
