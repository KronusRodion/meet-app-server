import { Controller, Post, Body, Res, Req, Get } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('validate-token')
  async validateToken(@Req() req: Request) {
    // Токен уже проверен middleware, просто подтверждаем валидность
    return { status: 200, message:'Пользователь успешно авторизован!' };
  }

  @Post('login')
  async login(
    @Body() body: any,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(body);
    console.log('TOKENS: ', accessToken, refreshToken)
    response.cookie('Authentication', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000,
      sameSite: 'lax',
      path: '/',
      // domain: 'localhost',
    });

    response.cookie('Refresh', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      // domain: 'localhost',
    });
    
    return {status:200, message: 'Login successful' };
  }

  @Post('register')
  async register(
    @Body() body: any,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.register(body);

    response.cookie('Authentication', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000,
          // domain: 'localhost',
    });

    response.cookie('Refresh', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/auth/refresh-token',
      maxAge: 7 * 24 * 60 * 60 * 1000,
          // domain: 'localhost',
    });

    return {status:200, message: 'Registration successful' };
  }

  @Post('refresh-token')
  async refreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies['Refresh'];
    if(!refreshToken)return {status:401, message: 'Refresh token is missing!' };
    const { accessToken } = await this.authService.refreshToken(refreshToken);
    
    response.cookie('Authentication', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
          // domain: 'localhost',
    });

    return {status:200, message: 'Token refreshed' };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('Authentication', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
          // domain: 'localhost',
    });
    
    response.clearCookie('Refresh', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
          // domain: 'localhost',
    });

    return { status: 200, message: 'Logout successful' };
  }
}