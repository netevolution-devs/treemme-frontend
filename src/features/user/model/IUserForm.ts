import type {IUserProfile} from "@features/profile/model/IUserProfile.ts";
import type {IRole} from "@features/user/model/RoleInterfaces.ts";

export type IUserForm = 
  IUserProfile & 
  { 
    password: string, 
    roles: IRole[],
  }