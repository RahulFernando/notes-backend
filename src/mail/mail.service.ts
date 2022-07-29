import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { IUser } from '../interfaces/user.interface';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: IUser) {
    const url = 'http://localhost:3001';

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to Surge Notes',
      template: './confirmation',
      context: {
        url,
      },
    });
  }
}
