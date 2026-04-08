import type {IUserProfile} from "@features/profile/model/IUserProfile";
import type {IRole} from "@features/user/model/RoleInterfaces";

export type IUserForm = 
  IUserProfile & 
  { 
    password: string, 
    roles: IRole[],
  }