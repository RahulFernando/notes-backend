import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { User, UserDocument } from '../schemas/user.schema';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async loginUser(loginUserDto: AuthDto): Promise<string> {
    const user = await this.userModel.findOne({ email: loginUserDto.email });

    if (!user) throw new NotFoundException('Email is incorrect!');

    const isMatch = await this.comparePassword(
      loginUserDto.password,
      user.password,
    );

    if (!isMatch) throw new NotFoundException('Password is incorrect!');

    const exp = Math.floor(Date.now() / 1000) + 60 * 60;

    // generate jwt token
    const token = await sign(
      { email: user.email, type: user.accountType, exp },
      process.env.JWT_SECRETE,
    );

    return token;
  }

  // function to compare hash and plain password
  async comparePassword(
    plainPassword: string,
    userPassword: string,
  ): Promise<boolean> {
    return await compare(plainPassword, userPassword);
  }
}
