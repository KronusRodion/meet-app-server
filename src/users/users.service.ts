import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(user:User): Promise<User> {

    try {
      // Проверяем, существует ли пользователь с таким email
      const existingUser = await this.usersRepository.findOneBy({ email: user.email });
      if (existingUser) {
        throw new HttpException('Пользователь с таким email уже существует', HttpStatus.CONFLICT);
      }
  
      // Хэшируем пароль перед сохранением
      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(user.password, salt);
  
      return this.usersRepository.save(user);
    } catch (error) {
      console.error('Ошибка при создании пользователя:', error.message);
      throw error; // Пробрасываем ошибку дальше
    }
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.findOneByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }
}