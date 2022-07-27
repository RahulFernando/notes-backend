import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { CreateUserDto } from './dto/create.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

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
}
