import { Document } from 'mongoose';
import { AccountType } from '../schemas/user.schema';

export interface IUser extends Document {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly dataOfBirth: Date;
  readonly mobile: number;
  readonly status: boolean;
  readonly password: string;
  readonly accountType: AccountType;
}
