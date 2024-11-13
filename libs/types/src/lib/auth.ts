

export interface ILoginInput {
  email: string;
  password: string;
  otp: number;
}
export interface ILoginSendOtpInput {
  email: string;
  password: string;
}

export interface ILoginSuccess {
  accessToken: string;
  otpSecurity?: boolean;
  user: any;
}
;

export enum SocialAuthProviderEnum {
  GOOGLE = 'google',
  FACEBOOK = 'facebook'
}
export interface IForgotPasswordInput {
  username?: string;
}
