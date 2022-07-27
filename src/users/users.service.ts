import { ConflictException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { CreateUserDto } from './dto/create.dto';
import { IUser } from 'src/interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(createUserDto: CreateUserDto): Promise<IUser> {
    const user = await this.userModel.findOne({ email: createUserDto.email });

    // check user already exists
    if (user) {
      throw new ConflictException('User already exists!');
    }

    const newUser = await new this.userModel(createUserDto);
    return newUser.save();
  }
}
