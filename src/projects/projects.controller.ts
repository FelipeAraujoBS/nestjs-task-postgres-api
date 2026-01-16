import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/projects.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async createProject(@Body() createProjectDto: CreateProjectDto, @Req() req) {
    const ownerId = req.user.id;
    return this.projectsService.createProjects(createProjectDto, ownerId);
  }

  @Get('find')
  @HttpCode(HttpStatus.OK)
  async readProject(@Req() req) {
    const ownerId = req.user.id;
    return this.projectsService.readProjects(ownerId);
  }

  @Put('update/:id')
  @HttpCode(HttpStatus.OK)
  async updateProject(
    @Param('id', ParseIntPipe) projectId: number,
    @Body() updateProjectDto: UpdateProjectDto,
    @Req() req,
  ) {
    const ownerId = req.user.id;

    return this.projectsService.updateProject(
      projectId,
      updateProjectDto,
      ownerId,
    );
  }

  @Delete('delete/:id')
  @HttpCode(HttpStatus.OK)
  async deleteProject(
    @Param('id', ParseIntPipe) projectId: number,
    @Req() req,
  ) {
    const owner = req.user;
    return this.projectsService.deleteProject(projectId, owner);
  }
}
