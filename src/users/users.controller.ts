import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { CreateUserDto } from './dto/create.dto';
import { LoginUserDto } from './dto/login.dto';
import { UsersService } from './users.service';

@Controller('/api/users')
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

  @Post('/sign-in')
  async loginUser(@Res() response, @Body() loginUserDto: LoginUserDto) {
    try {
      const token = await this.userService.loginUser(loginUserDto);

      return response.status(HttpStatus.OK).json({
        message: 'User logged successfully!',
        token,
      });
    } catch (error) {
      return response.status(error.status).json(error.response);
    }
  }
}
