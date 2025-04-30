import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(body): Promise<{ accessToken: string, refreshToken: string }> {
    const {email, password} = body;
    console.log(email, password)
    const user = await this.usersService.validateUser(email, password);
    if (!user) {
      throw new HttpException('Invalid credentials', 201);
    }
    
    const payload = { email: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '15m' }),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  async register(body: any): Promise<{ accessToken: string, refreshToken: string }> {
    try {
      const { firstName, lastName, email, password } = body;
      const newUser = new User()
      newUser.email = email;
      newUser.firstName = firstName;
      newUser.lastName = lastName;
      newUser.password = password;
      // Создаем пользователя
      const user = await this.usersService.createUser(newUser);
  
      // Генерируем токены
      const payload = { email: user.email, sub: user.id };
      return {
        accessToken: this.jwtService.sign(payload, { expiresIn: '15m' }),
        refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
      };
    } catch (error) {
      // Если ошибка связана с существующим пользователем, пробрасываем ее дальше
      if (error instanceof HttpException && error.getStatus() === HttpStatus.CONFLICT) {
        throw error;
      }
  
      // Для других ошибок генерируем общее сообщение
      console.error('Ошибка регистрации:', error.message);
      throw new HttpException('Ошибка регистрации. Попробуйте позже.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }




  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    if (!refreshToken) {
      throw new HttpException('Refresh token not found', 203);
    }

    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.usersService.findOneByEmail(payload.email);
      
      if (!user) {
        throw new HttpException('User not found', 404);
      }
      
      return {
        accessToken: this.jwtService.sign(
          { email: user.email, sub: user.id },
          { expiresIn: '15m' }
        ),
      };
    } catch (e) {
      throw new HttpException('Invalid refresh token', 403);
    }
  }
}