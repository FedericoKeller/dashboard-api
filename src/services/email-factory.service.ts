import  mjm2html from 'mjml';
import { BaseUser } from '../models/user/user.interface';
import * as dotenv from "dotenv";
import { createTransport } from 'nodemailer';
import { EmailTemplates } from './email-templates';


dotenv.config();

const MAILTRAP_TRANSPORT = createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN
  } 
});

export interface IEmail {
    generateEmailTemplate<T extends {new (...args: any[]): InstanceType<T>}>(type: T): void;
    sendEmail(htmlTemplate: string): void;
}

export interface IData {
    token: string;
    user: BaseUser;
}

export class ResetPassword implements IEmail {
    user: BaseUser;
    token: string;

    constructor(raw: IData) {
        this.user = raw.user;
        this.token = raw.token;
    }
    async sendEmail(): Promise<void> {

 try {
    await MAILTRAP_TRANSPORT.sendMail({
        to: this.user.email,
        from: "no-reply@dashsmart.com",
        subject: "Welcome to DashSmart!",
        html: this.generateEmailTemplate(ResetPassword),
      });
    } catch(error: any) {
        error.statusCode = 500;
        throw error;
    }
 }

 generateEmailTemplate<T extends {new (...args: any[]): InstanceType<T>}>(classRef: T): string {
     let emailTemplate: string = "";
     switch(classRef) {
         case ResetPassword:
            emailTemplate = EmailTemplates.getResetPasswordTemplate(this.user, this.token);
             break;
     }

     return emailTemplate;
 }
}



export module EmailFactory {
 
    export function createEmail<T extends IEmail, K extends IData>(c: { new (raw: K): T }, data: K): T {
        return new c(data);
    }
}

