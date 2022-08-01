import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MailModule } from './mail/mail.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb+srv://admin:${process.env.MONGO_PASSWORD}@cluster0.cncl6.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`,
    ),
    MailModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRETE,
      signOptions: { expiresIn: '1h' },
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
