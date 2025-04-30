import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'e0628bdc4671b986a7b5b5cafe0b2e720a4c56db8c7f8b400a95c8427ec8d15804d3addc0ec83c955ce9d6d16c79e3ddc57ce65246a783cd31085cba1f1b27842ea2baf8925db8e0e02929c34e440726a608514bed8e9d81f94a26c72c1c16b054a70ea3b0042e96c486b9d12c5c2de50ad09e9c14fb870fa18563c25873019e823311bc2562e49a4c452df989be99cd3af94f2e8f9e36ce50243ad68e193819b9fb4aa103e05967bb8e2972353166665a96a8e2a0faf74b7de53607e13c338a7e67a058006e08ad4a6bf4fff688954ff35297517a0bcddd82458f64c2f3a81b1a06f2503c162c755343f46e394b0c2556e625bc28a631b5079d34193fd1b4a7',
      signOptions: { expiresIn: '1h' },
    }),
    UsersModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [JwtModule],
})
export class AuthModule {}