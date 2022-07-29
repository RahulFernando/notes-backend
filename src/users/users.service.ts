import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { User, UserDocument } from '../schemas/user.schema';
import { CreateUserDto } from './dto/create.dto';
import { IUser } from 'src/interfaces/user.interface';
import { LoginUserDto } from './dto/login.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly mailService: MailService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<IUser> {
    const user = await this.userModel.findOne({ email: createUserDto.email });

    // check user already exists
    if (user) {
      throw new ConflictException('User already exists!');
    }

    const newUser = await new this.userModel(createUserDto);

    // send an email
    await this.mailService.sendUserConfirmation(newUser);

    return newUser.save();
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<string> {
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
