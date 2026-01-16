import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  HttpStatus,
  HttpCode,
  Body,
  Req,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CreateTaskDto } from './dto/createTask.dto';
import { UpdateTaskDto } from './dto/updateTask.dto';
import { TasksService } from './tasks.service';

@Controller('task')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post(':projectId/tasks')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Req() req,
  ) {
    const userId = req.user.id;
    return this.tasksService.createTasks(projectId, createTaskDto, userId);
  }

  @Put(':id/:projectId/tasks')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async updateTask(
    @Body() updateTaskDto: UpdateTaskDto,
    @Param('id', ParseIntPipe) id: number,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Req() req,
  ) {
    const ownerId = req.user.id;

    return this.tasksService.updateTasks(updateTaskDto, id, projectId, ownerId);
  }

  @Get(':projectId/tasks')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async readTasks(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Req() req,
  ) {
    const ownerId = req.user.id;
    return this.tasksService.readTasks(projectId, ownerId);
  }

  @Delete(':id/:projectId/tasks')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async deleteTasks(
    @Param('id', ParseIntPipe) id: number,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Req() req,
  ) {
    const ownerId = req.user.id;
    return this.tasksService.deleteTaskById(id, projectId, ownerId);
  }
}
