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

// -------- MFA / TOTP Types --------
export enum NestAuthMFAMethodEnum {
  EMAIL = 'email',
  SMS = 'sms',
  TOTP = 'totp',
}

export interface ITotpSetupResponse {
  secret: string;
  qrCode: string;
  otpAuthUrl: string;
}

export interface IVerifyTotpSetupRequest {
  otp: string;
  secret: string;
}

export interface IMfaDevice {
  id: string;
  deviceName: string;
  method: NestAuthMFAMethodEnum;
  lastUsedAt?: Date | string | null;
  verified: boolean;
  createdAt?: Date | string | null;
}

export interface IMfaStatusResponse {
  isEnabled: boolean;
  verifiedMethods: NestAuthMFAMethodEnum[];
  configuredMethods: NestAuthMFAMethodEnum[];
  allowUserToggle: boolean;
  allowMethodSelection: boolean;
  totpDevices: IMfaDevice[];
  hasRecoveryCode: boolean;
  required?: boolean;
  canToggle?: boolean;
}

export interface IMfaCodeResponse {
  code: string;
  expiresAt: Date | string;
  used: boolean;
  warning?: string;
}

export interface IToggleMfaRequest {
  enabled: boolean;
}

export interface IMessageResponse {
  message: string;
}
