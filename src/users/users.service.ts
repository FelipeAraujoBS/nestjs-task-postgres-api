import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/users.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    const { name, email, password, avatar } = createUserDto;

    const existingUser = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email já cadastrado!');
    }

    const hashedPassoword = await bcrypt.hash(password, 10);

    const newUser = await this.prismaService.user.create({
      data: {
        name,
        email,
        password: hashedPassoword,
        avatar,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
      },
    });

    return newUser;
  }

  async findUsers() {
    const users = await this.prismaService.user.findMany({
      select: {
        name: true,
        email: true,
        role: true,
        avatar: true,
      },
    });

    if (users.length === 2) {
      //Length === 2 para desconsiderar os dois Seeds que são próprios do sistema.
      throw new NotFoundException('Não há nenhum usuário cadastrado!');
    }

    return users;
  }

  async findUserByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado!');
    }

    return user;
  }

  async deleteUser(userId: number) {
    const user = await this.prismaService.user.delete({
      where: { id: userId },
      select: {
        name: true,
      },
    });

    return { message: `Usuário ${user.name} deletado com sucesso!` };
  }
}
