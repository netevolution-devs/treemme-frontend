import { useQueryClient } from "@tanstack/react-query";
import usePostUserRole from "./usePostUserRole.ts";
import useDeleteUserRole from "./useDeleteUserRole.ts";
import QUERY_KEY_STRINGS from "@api/QueryKeyStrings.ts";
import type {IUserProfile} from "@features/profile/model/IUserProfile.ts";
import type {IRole} from "@features/user/model/RoleInterfaces.ts";

export const useUpdateUserRole = () => {
    const queryClient = useQueryClient();
    const { mutateAsync: addRole } = usePostUserRole();
    const { mutateAsync: deleteRole } = useDeleteUserRole();
    
    const updateUserRole = async (user: IUserProfile, selectedRoles: IRole[]) => {
        const currentRoleIds = user.roles.map((userRole) => userRole.role.id);
        const selectedRoleIds = selectedRoles.map((role) => role.id);
        
        const rolesToAdd = selectedRoles.filter(
            (role) => !currentRoleIds.includes(role.id)
        );
        
        const rolesToDelete = user.roles.filter(
            (userRole) => !selectedRoleIds.includes(userRole.role.id)
        );

        const addPromises = rolesToAdd.map((role) =>
            addRole({
                user_code: user.userCode,
                role_id: role.id,
                work_area_id: 1,
            })
        );

        const deletePromises = rolesToDelete.map((userRole) =>
            deleteRole(userRole.associationId)
        );

        await Promise.allSettled([
            ...addPromises,
            ...deletePromises
        ]);

        await queryClient.invalidateQueries({ 
            queryKey: [QUERY_KEY_STRINGS.USER.LIST] 
        });
        await queryClient.removeQueries({ 
            queryKey: [QUERY_KEY_STRINGS.USER.DETAIL, user.userCode] 
        });
        
    };
    
    return { updateUserRole };
};