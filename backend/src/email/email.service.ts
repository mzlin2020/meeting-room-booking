import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  // 实例
  transporter: Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = createTransport({
      host: 'smtp.163.com',
      port: 465,
      secure: true,
      auth: {
        user: this.configService.get('email_user'), // 发件邮箱
        pass: this.configService.get('emial_pass'), // 授权码
      },
    });
  }

  // 发送邮件
  async sendMail({ to, subject, html }) {
    await this.transporter.sendMail({
      from: {
        name: '会议室预定系统',
        address: this.configService.get('email_user'),
      },
      to,
      subject,
      html,
    });
  }
}
