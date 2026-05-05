import { Injectable, OnModuleInit } from "@nestjs/common";
import nodemailer, { Transporter } from "nodemailer";
import { EnvProvider } from "src/config/env/env.provider";

@Injectable()
export class MailService implements OnModuleInit {
  private transporter: Transporter;

  constructor(private env: EnvProvider) {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: this.env.get("USER_GMAIL"),
        clientId: this.env.get("GOOGLE_CLIENT_ID"),
        clientSecret: this.env.get("GOOGLE_CLIENT_SECRET"),
        refreshToken: this.env.get("GOOGLE_REFRESH_TOKEN"),
      },
    });
  }

  async onModuleInit() {
    await this.transporter.verify();
  }

  async sendMail(to: string, subject: string, html: string) {
    return this.transporter.sendMail({
      from: this.env.get("USER_GMAIL"),
      to,
      subject,
      html,
    });
  }
}
