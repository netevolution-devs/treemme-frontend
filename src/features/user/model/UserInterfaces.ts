import type {IApiProfile} from "@features/profile/model/IProfile";
import {
    type IAccessControl,
    type IApiAccessControl,
    AccessControlArrayAdapter,
    type IUserRole
} from "@features/user/model/RoleInterfaces";

export interface IUser {
    id: number;
    email: string;
    roles: IUserRole[];
    userCode: string;
    firstName: string;
    lastName: string;
    name: string;
    lastAccess: string | null;
    createdAt?: Date | undefined;
    accessControl: IAccessControl[];
    otpEnabled?: boolean;
}

export interface IApiUser {
    id: number;
    email: string;
    roles: IUserRole[];
    user_code: string;
    first_name: string;
    last_name: string;
    last_access: string | null;
    access_control: IApiAccessControl[];
    totp_enabled?: boolean;
}

export function UserAdapter(apiUser: IApiUser): IUser {
    const user: IUser = {
        id: apiUser.id,
        email: apiUser.email,
        roles: apiUser.roles,
        userCode: apiUser.user_code,
        firstName: apiUser.first_name,
        lastName: apiUser.last_name,
        name: `${apiUser.first_name} ${apiUser.last_name}`.trim(),
        lastAccess: apiUser.last_access,
        accessControl: AccessControlArrayAdapter(apiUser.access_control),
        otpEnabled: apiUser.totp_enabled ?? false,
    }

    if (typeof apiUser.totp_enabled === "undefined") delete user.otpEnabled;

    return user;
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