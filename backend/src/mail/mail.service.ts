import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";

@Injectable()
export class MailService {
  private transporter!: nodemailer.Transporter;

  async init() {
    const testAccount = await nodemailer.createTestAccount();

    this.transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  async sendPasswordResetEmail(to: string, token: string) {
    if (!this.transporter) {
      await this.init();
    }

    const info = await this.transporter.sendMail({
      from: '"Test App" <no-reply@test.com>',
      to,
      subject: "Reset your password",
      text: `Use this token: ${token}`,
    });

    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
  }
}
