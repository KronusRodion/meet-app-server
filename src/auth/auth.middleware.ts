// auth.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private authService:AuthService

  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.cookies['Authentication'];
    const refreshToken = req.cookies['Refresh'];

    console.log('Запрос!')

    try {
      // Проверяем access token
      if (accessToken) {
        const payload = this.jwtService.verify(accessToken);
        // req.user = payload;
        return next();
      }
    } catch (error) {
      // Если access token невалиден - пробуем обновить
      if (!refreshToken) throw new Error('No refresh token');
    }

    // Если нет access token - обновляем через refresh
    try {
      const newTokens = await this.authService.refreshToken(refreshToken);
      res.cookie('Authentication', newTokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      });
      // req.user = this.jwtService.decode(newTokens.accessToken);
      next();
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
    
  }