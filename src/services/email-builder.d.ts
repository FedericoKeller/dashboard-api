interface EmailProperties {
  readonly emailType: string;
}

type AcceptedEmailsOperations = "ResetPassword" | "ChangePassword";

export class ResetPassword implements EmailProperties {
  readonly emailType: AcceptedEmailsOperations = "ResetPassword";
}

type KnownClasses = ResetPassword;
type EmailTypes = KnownClasses["emailType"];

export interface IEmail {
  sendEmail(email: string, htmlTemplate: string): void;
}

export interface IData {
  token: string;
  user: BaseUser;
}
