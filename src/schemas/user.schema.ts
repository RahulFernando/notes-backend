import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum AccountType {
  Student = 'student',
  Admin = 'admin',
}

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop()
  dataOfBirth: Date;

  @Prop()
  mobile: number;

  @Prop()
  status: boolean;

  @Prop({ required: true })
  password: string;

  @Prop({ default: AccountType.Student })
  accountType: AccountType;
}

export const UserSchema = SchemaFactory.createForClass(User);
