import { BaseUser } from "../models/user/user.interface";
import { EmailTemplatesModule } from "./email-templates";
import { createTransport } from "nodemailer";
import * as dotenv from "dotenv";
import { IEmail, IData, EmailTypes } from "./email-builder";

dotenv.config();

const MAILTRAP_TRANSPORT = createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  },
});

export class EmailBuilder implements IEmail {
  private user: BaseUser;
  private token: string;
  private emailTemplate: string = "";

  constructor(raw: IData) {
    this.user = raw.user;
    this.token = raw.token;
  }

  generateEmailTemplate<T extends EmailTypes>(emailTypes: T): EmailBuilder {
    let emailTemplate: string = "";
    switch (emailTypes) {
      case "ResetPassword":
        emailTemplate = EmailTemplatesModule.getResetPasswordTemplate(
          this.user,
          this.token
        );
        break;
    }

    this.emailTemplate = emailTemplate;

    return this;
  }

  async sendEmail(): Promise<void> {
    try {
      await MAILTRAP_TRANSPORT.sendMail({
        to: this.user.email,
        from: "no-reply@dashsmart.com",
        subject: "Welcome to DashSmart!",
        html: this.emailTemplate,
      });
    } catch (error: any) {
      error.statusCode = 500;
      throw error;
    }
  }
}
