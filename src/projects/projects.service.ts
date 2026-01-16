import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from './dto/projects.dto';
import { UpdateProjectDto } from './dto/projects.dto';
import { Role } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createProjects(createProjectDto: CreateProjectDto, ownerId) {
    const projects = await this.prismaService.project.create({
      data: {
        ...createProjectDto,
        ownerId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        color: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tasks: true,
      },
    });

    return projects;
  }

  async updateProject(
    projectId: number,
    updateProjectDto: UpdateProjectDto,
    ownerId: number,
  ) {
    const result = await this.prismaService.project.updateMany({
      where: {
        id: projectId,
        ownerId,
      },
      data: updateProjectDto,
    });

    if (!result.count) {
      throw new NotFoundException('Projeto não encontrado ou acesso negado');
    }

    return { message: 'Projeto atualizado com sucesso' };
  }

  async readProjects(ownerId: any) {
    const projects = await this.prismaService.project.findMany({
      where: { ownerId },
    });

    if (!projects) {
      throw new NotFoundException('Projeto não encontrado ou acesso negado');
    }

    return projects;
  }

  async deleteProject(id: any, owner: any) {
    const project = await this.prismaService.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException('Projeto não encontrado!');
    }

    if (project.ownerId !== owner.id && owner.role !== Role.ADMIN) {
      throw new ForbiddenException(
        'Você só pode deletar seus próprios projetos',
      );
    }

    const deletedProject = await this.prismaService.project.delete({
      where: { id },
    });

    return { message: `Projeto ${deletedProject.name} deletado com sucesso!` };
  }
}
