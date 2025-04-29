import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsEmail, MinLength } from 'class-validator';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @MinLength(6)
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;
}