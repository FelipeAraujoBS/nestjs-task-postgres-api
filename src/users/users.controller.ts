import {
  Controller,
  Body,
  Post,
  Get,
  Req,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/users.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  findUsers() {
    return this.userService.findUsers();
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  deleteUser(@Req() req) {
    const userId = req.user.id;
    return this.userService.deleteUser(userId);
  }
}
