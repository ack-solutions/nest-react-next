import type { NestAuthUser } from '@ackplus/nest-auth';

import { IBaseEntity } from './base-entity';


export interface IUser extends IBaseEntity {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  phoneIsoCode?: string;
  phoneCountryCode?: string;
  avatar?: string;
  isSuperUser?: boolean;
  status?: UserStatusEnum;
  isProfileCompleted?: boolean;
  authUserId?: string;
  authUser?: NestAuthUser;
  name?: string;
  avatarUrl?: string;
  razorpayCustomerId?: string
  // read only
  formattedPhone?: string;
  isMfaEnabled?: boolean;
}

export interface ICreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  phoneIsoCode: string;
  phoneCountryCode: string;
  password: string;
  status: UserStatusEnum;
  roles: string[];
  locationIds: string[];
  avatar?: string;
}

export interface IVerification extends IBaseEntity {
  email?: string;
  otp: string;
  phoneNumber?: string;
}

export enum UserStatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}


export interface IChangeEmailInput {
  email: string;
  otp?: string;
}

export interface IChangePhoneNumberInput {
  phoneCountryCode?: string;
  phoneIsoCode?: string;
  phoneNumber: string;
  otp?: string;
}

export interface IVerifyOtpInput {
  email: string;
  otp: string;
}

export interface IVerifyForgotPasswordOtpInput {
  email?: string;
  phone?: string;
  otp: string;
}

export interface IVerifyResetPasswordWithTokenResponse {
  resetToken: string;
}

export interface IResetPasswordWithTokenInput {
  token: string;
  newPassword: string;
}

export interface IResetPasswordWithTokenResponse {
  resetToken: string;
}

export interface IVerifyTokenInput {
  token: string;
}

export interface IUpdateProfileInput extends Omit<IUser, 'id' | 'phoneNumber' | 'phoneCountryCode' | 'phoneIsoCode'> {
  [x: string]: any;
}

export interface IChangePasswordInput {
  oldPassword?: string;
  password?: string;
}

export interface ISetPasswordInput {
  password?: string;
}
export interface IDeleteAccountInput {
  password?: string;
}

export interface IOtpSendInput {
  email?: string;
  phoneNumber?: string;
  password?: string;
  action: OtpSendActionEnum;
  // Testing Pending
  platform?: string
}

export enum OtpSendActionEnum {
  LOGIN = 'login',
  REGISTER = 'register',
  FORGOT_PASSWORD = 'forgotPassword',
  CHANGE_EMAIL = 'changeEmail',
  CHANGE_PHONE = 'changePhone',
}
