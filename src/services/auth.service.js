const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { prisma } = require('../utils/prisma');
const { UnauthorizedError, BadRequestError } = require('../utils/errors');

class AuthService {
  async register(userData) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    });

    if (existingUser) {
      throw new BadRequestError('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true
      }
    });

    const { accessToken, refreshToken } = await this.generateTokens(user.id);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + parseInt(process.env.JWT_REFRESH_EXPIRATION))
      }
    });

    return {
      user,
      accessToken,
      refreshToken
    };
  }

  async login(email, password) {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const { accessToken, refreshToken } = await this.generateTokens(user.id);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + parseInt(process.env.JWT_REFRESH_EXPIRATION))
      }
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      accessToken,
      refreshToken
    };
  }

  async refreshToken(token) {
    const refreshTokenData = await prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!refreshTokenData || refreshTokenData.expiresAt < new Date()) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    const { accessToken, refreshToken: newRefreshToken } = await this.generateTokens(refreshTokenData.user.id);

    // Delete old refresh token and create new one
    await prisma.$transaction([
      prisma.refreshToken.delete({ where: { token } }),
      prisma.refreshToken.create({
        data: {
          token: newRefreshToken,
          userId: refreshTokenData.user.id,
          expiresAt: new Date(Date.now() + parseInt(process.env.JWT_REFRESH_EXPIRATION))
        }
      })
    ]);

    return {
      accessToken,
      refreshToken: newRefreshToken
    };
  }

  async logout(token) {
    await prisma.refreshToken.delete({
      where: { token }
    });
  }

  async generateTokens(userId) {
    const accessToken = jwt.sign(
      { userId },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRATION }
    );

    const refreshToken = jwt.sign(
      { userId },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRATION }
    );

    return { accessToken, refreshToken };
  }
}

module.exports = new AuthService(); 