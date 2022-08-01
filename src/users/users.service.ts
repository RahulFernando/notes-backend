import { ConflictException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AccountType, User, UserDocument } from '../schemas/user.schema';
import { CreateUserDto } from './dto/create.dto';
import { IUser } from 'src/interfaces/user.interface';
import { MailService } from '../mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly mailService: MailService,
  ) {}

  async seed(createUserDto: CreateUserDto): Promise<IUser> {
    const admin = await this.userModel.findOne({ email: createUserDto.email });

    // if exist return admin
    if (admin) {
      return admin;
    }

    const newAdmin = await new this.userModel(createUserDto);
    return newAdmin.save();
  }

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

  async getAllUsers(): Promise<IUser[]> {
    const users = await this.userModel
      .find({
        accountType: AccountType.Student,
      })
      .select('email status accountType');

    return users;
  }
}
