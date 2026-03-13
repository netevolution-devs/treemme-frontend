import type {IUser} from "@features/user/model/UserInterfaces.ts";
import {EnumRoles} from "@features/user/model/RoleInterfaces.ts";

export const mockUser: IUser = {
  id: 999,
  name: "Dev User",
  email: "dev@example.com",
  firstName: "Dev",
  lastName: "User",
  createdAt: new Date(),
  userCode: "DEV001",
  otpEnabled: true,
  lastAccess: null,
  accessControl: [],
  roles: [
    {
      associationId: 1,
      role: {id: 1, name: EnumRoles.Admin, description: "Administrator"},
      workArea: {id: 1, name: "All", description: "All areas", active: true}
    }
  ]
};