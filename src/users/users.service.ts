import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/createUsers.dto';
import { UpdateUserDto } from './dto/updateUsers.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  private readonly SYSTEM_USERS_INITIAL_COUNT = 2;

  constructor(private readonly prismaService: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    const { name, email, password, avatar } = createUserDto;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await this.prismaService.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
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

      this.logger.log(
        `User created successfully: ${email} (ID: ${newUser.id})`,
      );
      return newUser;
    } catch (error) {
      if (error.code === 'P2002') {
        this.logger.warn(`Duplicate email attempt: ${email}`);
        throw new ConflictException('Email já cadastrado!');
      }

      this.logger.error(`Error creating user: ${email}`, error.stack);
      throw new InternalServerErrorException('Erro ao criar usuário');
    }
  }

  async updateUsers(userId: number, updateUsersDto: UpdateUserDto) {
    try {
      this.logger.log(`Tentando atualizar o usuario de id: ${userId}`);
      const user = await this.prismaService.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        this.logger.warn(`Usuário do id:${userId} não encontrado!`);
        throw new NotFoundException('Usuário não encontrado!');
      }

      if (updateUsersDto.password) {
        updateUsersDto.password = await bcrypt.hash(
          updateUsersDto.password,
          10,
        );
      }

      const updatedUser = await this.prismaService.user.update({
        where: { id: userId },
        data: { ...UpdateUserDto },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      this.logger.log(`Usuário ${updatedUser.name} atualizado com sucesso`);

      return updatedUser;
    } catch (error) {
      if (error.code === 'P2025') {
        this.logger.warn(
          `Usuário de id: ${userId} não encontrado durante atualização!`,
        );
        throw new NotFoundException('Usuário não encontrado!');
      }

      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      this.logger.error(
        `Erro ao tentar atualizar usuário de id: ${userId}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Erro ao tentar atualizar usuário',
      );
    }
  }

  async findUsers(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    try {
      this.logger.log(`Tentando listar todos os usuários`);

      const [users, total] = await this.prismaService.$transaction([
        this.prismaService.user.findMany({
          skip,
          take: limit,
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            avatar: true,
            ownedProjects: true,
            projectMembers: true,
            assignedTasks: true,
          },
        }),
        this.prismaService.user.count(),
      ]);

      this.logger.log('Usuários listados com sucesso!');

      if (users.length <= this.SYSTEM_USERS_INITIAL_COUNT) {
        return {
          data: [],
          meta: { page, limit, total, totalPages: 0 },
          message: 'Não há usuários cadastrados',
        };
      }

      return {
        data: users,
        meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
      };
    } catch (error) {
      if (error.code === 'P2025') {
        this.logger.warn(`Usuários não encontrados!`);
        throw new NotFoundException('Usuários não encontrados!');
      }

      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      this.logger.error('Erro ao tentar listar usuários!', error.stack);
      throw new InternalServerErrorException('Erro ao tentar listar usuários');
    }
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
    try {
      this.logger.log(`Tentando deletar o usuário: ${userId}`);

      const user = await this.prismaService.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true, deletedAt: true },
      });

      if (!user) {
        this.logger.warn(`Usuário ${userId} não encontrado para ser deletado!`);
        throw new NotFoundException('Usuário não encontrado!');
      }

      if (user?.deletedAt) {
        this.logger.warn(`Usuário ${userId} já foi deletado!`);
        throw new ConflictException('Usuário já foi deletado!');
      }

      await this.prismaService.user.update({
        where: { id: userId },
        data: {
          deletedAt: new Date(),
          email: `deleted_${Date.now()}_${user.email}`,
        },
      });

      this.logger.log(
        `Usúario ${user?.name} de id: ${userId} foi deletado com sucesso!`,
      );

      return { message: `Usuário ${user?.name} deletado com sucesso!` };
    } catch (error) {
      if (error.code === 'P2025') {
        this.logger.warn(
          `Usuário não encontrado durante a deletação: ${userId}`,
        );
        throw new NotFoundException('Usuário não encontrado');
      }

      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      this.logger.error(`Erro deletando usuário: ${userId}`, error.stack);
      throw new InternalServerErrorException('Erro ao deletar usuário');
    }
  }
}
