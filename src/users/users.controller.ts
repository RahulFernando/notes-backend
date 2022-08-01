import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Get,
  Res,
  UseGuards,
} from '@nestjs/common';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { JwtAuthGuard } from 'src/jwt-auth.guard';
import { Roles } from 'src/roles.decorator';
import { RolesGuard } from 'src/roles.guard';
import { CreateUserDto } from './dto/create.dto';
import { UsersService } from './users.service';

@Controller('/api/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {
    const admin = JSON.parse(
      readFileSync(resolve(__dirname, '../seeds/admin.json'), 'utf8'),
    );

    userService.seed(admin).then(() => console.log('admin created!'));
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async createUser(@Res() response, @Body() createUserDto: CreateUserDto) {
    try {
      const newUser = await this.userService.createUser(createUserDto);

      return response.status(HttpStatus.CREATED).json({
        message: 'User created successfully!',
        newUser,
      });
    } catch (error) {
      return response.status(error.status).json(error.response);
    }
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async getAllUsers(@Res() response) {
    try {
      const users = await this.userService.getAllUsers();

      return response.status(200).json({
        message: 'All users fetched successfully!',
        users,
      });
    } catch (error) {
      return response.status(error.status).json(error.response);
    }
  }
}
