import type {IApiProfile} from "@features/profile/model/IProfile.ts";
import {type IApiUserRole, type IUserRole, UserRoleArrayAdapter} from "@features/user/model/RoleInterfaces.ts";

export interface IUser {
    id: number;
    name: string;
    email: string;
    roles: IUserRole[];
    firstName: string;
    lastName: string;
    createdAt: Date;
    userCode: string;
    otpEnabled?: boolean;
}

export interface IApiUser {
    id: number;
    email: string;
    roles: IApiUserRole[];
    first_name: string;
    last_name: string;
    created_at: Date;
    user_code: string;
    totp_enabled: boolean;
}

export function UserAdapter(apiUser: IApiUser): IUser {

    return {
        id: apiUser.id,
        name: `${apiUser.first_name} ${apiUser.last_name}`.trim(),
        email: apiUser.email,
        roles: UserRoleArrayAdapter(apiUser.roles),
        firstName: apiUser.first_name,
        lastName: apiUser.last_name,
        createdAt: apiUser.created_at,
        userCode: apiUser.user_code,
        otpEnabled: apiUser.totp_enabled,
    };
}

export function UserArrayAdapter(apiUsers: IApiUser[]): IUser[] {
    return apiUsers.map(UserAdapter);
}


export type IApiUserPayload = Required<
  Omit<IApiProfile, "user_code" | "company"> & {
    password: string
  }
  >

export interface IApiUserPayloadUpdate {
  code: string;
  payload: Partial<Omit<IApiProfile, "user_code">>
}

export interface IApiUserRolePayload {
  user_code: string;
  role_id: number;
  work_area_id: number
}

export interface IApiUserAssignCompanyPayload {
    user_code: string;
    company_code: string;
}