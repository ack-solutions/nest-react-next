export interface ILoginInput {
  email?: string;
  password?: string;
  otp?: number;
  providerName?: string;
  credentials?: any;
  mfaMethod?: 'email' | 'phone' | 'totp';
  resend?: boolean;
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
  isRequiresMfa?: boolean;
  requiresMfa?: boolean;
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

export interface IMfaStatus {
  isEnabled: boolean;
  enabledMethods: string[];
  availableMethods: string[];
}
