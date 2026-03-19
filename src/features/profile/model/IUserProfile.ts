import type {IUser} from "@features/user/model/UserInterfaces.ts";
import type {IProfile} from "@features/profile/model/IProfile.ts";
import {
    type IAccessControl,
    type IApiUserRole,
    type IUserRole,
    UserRoleArrayAdapter
} from "@features/user/model/RoleInterfaces.ts";

export interface IUserProfile {
    id?: number;
    email: string;
    roles: IUserRole[];
    createdAt?: Date | undefined;
    userCode: string;
    name: string;
    firstName: string;
    lastName: string;
    phone?: string | undefined;
    address?: string | undefined;
    fiscalCode?: string | undefined;
    companyCode: string | undefined;
    lastAccess?: string | null;
    accessControl?: IAccessControl[];
}

export function mergeUserAndProfile(user: IUser, profile: IProfile): IUserProfile {
    return {
        id: user.id,
        roles: user.roles,
        createdAt: user.createdAt,
        email: user.email,
        userCode: user.userCode,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: profile?.phone,
        address: profile?.address,
        fiscalCode: profile?.fiscalCode,
        companyCode: profile?.companyCode,
        lastAccess: user.lastAccess,
        accessControl: user.accessControl,
    };
}

export interface IApiUserProfile {
    id: number;
    email: string;
    user_roles: IApiUserRole[],
    user_code: string;
    first_name: string;
    last_name: string;
    phone: string;
    address: string;
    fiscal_code: string;
    company: {
        company_code: string;
    } | undefined;
}

export function UserProfileAdapter(apiUserProfile: IApiUserProfile): IUserProfile {
    return {
        id: apiUserProfile.id,
        email: apiUserProfile.email,
        roles: UserRoleArrayAdapter(apiUserProfile.user_roles),
        createdAt: undefined,
        userCode: apiUserProfile.user_code,
        name: `${apiUserProfile.first_name} ${apiUserProfile.last_name}`.trim(),
        firstName: apiUserProfile.first_name,
        lastName: apiUserProfile.last_name,
        phone: apiUserProfile.phone,
        address: apiUserProfile.address,
        fiscalCode: apiUserProfile.fiscal_code,
        companyCode: apiUserProfile.company?.company_code,
        lastAccess: null,
        accessControl: [],
    }
}

export function UserProfileArrayAdapter(apiUserProfiles: IApiUserProfile[]): IUserProfile[] {
    // Harden against stray undefined entries
    return (apiUserProfiles ?? []).filter(Boolean).map(UserProfileAdapter)
}

export const toUserFromUserProfileAdapter = (data: IUserProfile): IUser => {
    return {
        id: data.id!,
        email: data.email,
        roles: data.roles,
        createdAt: data.createdAt!,
        userCode: data.userCode,
        firstName: data.firstName,
        lastName: data.lastName,
        name: data.name,
        lastAccess: data.lastAccess ?? null,
        accessControl: data.accessControl ?? [],
    }
}

export const toUserFromUserProfileArrayAdapter = (data: IUserProfile[]): IUser[] => {
    return data.map(toUserFromUserProfileAdapter);
}