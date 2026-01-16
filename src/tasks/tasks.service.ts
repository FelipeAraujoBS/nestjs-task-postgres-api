import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/createTask.dto';
import { UpdateTaskDto } from './dto/updateTask.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prismaService: PrismaService) {}

  async createTasks(
    projectId: number,
    createTasksDto: CreateTaskDto,
    userId: number,
  ) {
    const project = await this.prismaService.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Projeto não encontrado!');
    }

    if (project.ownerId !== userId) {
      throw new ForbiddenException('Usúario sem permissão!');
    }

    const task = await this.prismaService.task.create({
      data: {
        ...createTasksDto,
        projectId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        priority: true,
        dueDate: true,
        assignedTo: true,
      },
    });

    return task;
  }

  async updateTasks(
    updateTask: UpdateTaskDto,
    id: any,
    projectId: any,
    ownerId: any,
  ) {
    const updatedTask = await this.prismaService.task.updateMany({
      where: {
        id,
        projectId,
        assignedToId: ownerId,
      },
      data: updateTask,
    });

    if (!updatedTask.count) {
      throw new NotFoundException('Tarefa não encontrada ou acesso negado');
    }

    return { message: 'Tarefa atualizada com sucesso!' };
  }

  async readTasks(projectId: any, ownerId: any) {
    const tasks = await this.prismaService.task.findMany({
      where: {
        projectId,
        assignedToId: ownerId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        priority: true,
        projectId: true,
        assignedTo: true,
      },
    });

    if (tasks.length === 0) {
      throw new NotFoundException('Task não encontrado ou acesso negado');
    }

    return tasks;
  }

  async deleteTaskById(id: any, projectId: any, OwnerId: any) {
    const deletedTasks = await this.prismaService.task.deleteMany({
      where: {
        id,
        projectId,
        assignedToId: OwnerId,
      },
    });

    if (deletedTasks.count === 0) {
      throw new NotFoundException('Task não encontrada ou acesso negado');
    }

    return;
  }
}
