import { Module, Global } from '@nestjs/common';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'string',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  exports: [UserService],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
