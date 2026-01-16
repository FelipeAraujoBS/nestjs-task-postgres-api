import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/users/users.service';

@Injectable()
export class LoginService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async ValidateUser(email: string, password: string) {
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Email não cadastrado!');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Senha incorreta!');
    }

    const { password: _, ...result } = user;
    return result;
  }

  async Login(email: string, password: string) {
    const user = await this.ValidateUser(email, password);

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      acess_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}
