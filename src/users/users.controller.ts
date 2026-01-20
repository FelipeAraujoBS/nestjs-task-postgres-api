import {
  Controller,
  Body,
  Post,
  Get,
  Put,
  Delete,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/createUsers.dto';
import { UpdateUserDto } from './dto/updateUsers.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  updateUser(@Body() updateUserDto: UpdateUserDto, @Req() req) {
    const userId = req.user.id;
    return this.userService.updateUsers(userId, updateUserDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findUsers() {
    return this.userService.findUsers();
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteUser(@Req() req) {
    const userId = req.user.id;
    return this.userService.deleteUser(userId);
  }
}
