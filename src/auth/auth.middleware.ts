// auth.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.cookies['Authentication'];
    console.log('Запрос!')
    console.log("process.env.NODE_ENV === 'production' ",process.env.NODE_ENV === 'production')

    if (!accessToken) {
      throw new Error('Access token is missing');
    }
    try {
      const payload = this.jwtService.verify(accessToken);
    //   req.user = payload; // Добавляем payload в объект запроса
      next();
    } catch (error) {
      throw new Error('Invalid access token');
    }
  }
}