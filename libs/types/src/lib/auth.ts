export interface ILoginInput {
  email?: string;
  password?: string;
  otp?: number;
  providerId?: string;
  credentials?: any;
}

export interface ILoginSendOtpInput {
  email: string;
  password: string;
}

export interface IRegisterSendOtpInput {
  email: string;
}

export interface ILoginSuccess {
  accessToken: string;
  otpSecurity?: boolean;
  user: any;
}


export enum SocialAuthProviderEnum {
  GOOGLE = 'google',
  FACEBOOK = 'facebook'
}


export interface IRegisterInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
  phoneIsoCode?: string;
  phoneCountryCode?: string;
  avatar?: string;
  otp?: string;
  roles?: any
}

export interface IRegisterOTPInput {
  email: string;
  phoneNumber: string;
}

export interface IForgotPasswordInput {
  email?: string;
}

export interface IResetPasswordInput {
  email: string;
  otp: string;
  password: string;
}

export interface AuthState {
  user?: any;
  currentOrganization?: {
    logoFile?: {
      fileUrl?: string;
    };
    smallLogoFile?: {
      fileUrl?: string;
    };
  };
}
