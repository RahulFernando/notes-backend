import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async loginUser(@Res() response, @Body() authDto: AuthDto) {
    try {
      const token = await this.authService.loginUser(authDto);

      return response.status(HttpStatus.OK).json({
        message: 'User logged successfully!',
        token,
      });
    } catch (error) {
      return response.status(error.status).json(error.response);
    }
  }
}
