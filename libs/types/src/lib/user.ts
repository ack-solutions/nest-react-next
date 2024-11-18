// import { IOrganizationBaseEntity } from "./base-entity";
import { IBaseEntity } from "./base-entity";
import { IRole } from "./role";

export interface IUser extends IBaseEntity {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  avatar?: string;
  passwordHash?: string;
  isSuperAdmin?: boolean;
  emailVerifiedAt?: Date;
  status?: UserStatusEnum;
  isProfileCompleted?: boolean;
  roles?: IRole[];
  name?: string;
  avatarUrl?: string;
}

export interface IVerification extends IBaseEntity {
  email?: string;
  otp: number;
  phoneNumber?: string;
  userId?: string;
  user?: IUser;
}

export enum UserStatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}


export interface ChangePasswordInput {
  oldPassword?: string,
  password?: string,
  confirmPassword?: string,
}