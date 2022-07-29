import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { genSalt, hash } from 'bcrypt';

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

  @Prop({ default: true })
  status: boolean;

  @Prop({ required: true })
  password: string;

  @Prop({ default: AccountType.Student })
  accountType: AccountType;
}

export const UserSchema = SchemaFactory.createForClass(User);

// function that hash password before save
UserSchema.pre('save', function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;

  if (!user.isModified('password')) return next();

  genSalt(10, function (err, salt) {
    if (err) return next(err);

    hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});
