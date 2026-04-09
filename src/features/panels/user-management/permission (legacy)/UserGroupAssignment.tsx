import {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {Box, Chip, CircularProgress, Divider, Typography} from "@mui/material";
import type {IUserManagement} from "@features/panels/user-management/users/api/IUserManagement";
import {useAssignGroup, useRemoveGroup} from "@features/panels/user-management/users/api/usersApi";
import {groupManagementApi} from "@features/panels/user-management/organization/api/groupManagementApi";
import SelectFieldControlled from "@ui/form/controlled/SelectFieldController";
import {FormProvider, useForm} from "react-hook-form";
import {permissionEngine} from "@features/authz/permission.utils";
import type {IAccessControl} from "@features/user/model/RoleInterfaces";
import {useAuth} from "@features/auth/model/AuthContext";

interface UserGroupAssignmentProps {
    user: IUserManagement;
}

interface IGroupSelectForm {
    group_id: number | null;
}

const UserGroupAssignment = ({user}: UserGroupAssignmentProps) => {
    const {t} = useTranslation(["form"]);

    const {user: u} = useAuth();
    const engine = permissionEngine((u?.accessControl ?? []) as IAccessControl[]);
    const canPut = engine.can("sistema - utenti", 'put');

    const {data: allGroups = []} = groupManagementApi.useGetList();
    const {mutate: assignGroup, isPending: isAssigning} = useAssignGroup();
    const {mutate: removeGroup, isPending: isRemoving} = useRemoveGroup();

    const assignedGroupIds = new Set(user.group_users.map(gu => gu.group.id));
    const availableGroups = allGroups
        .filter(g => !assignedGroupIds.has(g.id))
        .map(g => ({value: g.id, label: g.name}));

    const methods = useForm<IGroupSelectForm>({defaultValues: {group_id: null}});
    const selectedGroupId = methods.watch("group_id");

    useEffect(() => {
        if (!selectedGroupId) return;
        assignGroup({user_id: user.id, group_id: selectedGroupId});
        methods.reset({group_id: null});
    }, [selectedGroupId]);

    const handleRemove = (groupId: number) => {
        removeGroup({groupId, userId: user.id});
    };

    return (
        <Box sx={{mt: 2}}>
            <Typography variant="subtitle2" sx={{mb: 0.5}}>
                {t("form:user_management.groups")}
            </Typography>
            <Divider sx={{mb: 1.5}}/>

            <Box sx={{display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1.5, minHeight: 32}}>
                {user.group_users.length === 0 && (
                    <Typography variant="body2" color="text.secondary">—</Typography>
                )}
                {user.group_users.map(gu => (
                    <Chip
                        key={gu.id}
                        label={gu.group.name}
                        size="small"
                        onDelete={() => handleRemove(gu.group.id)}
                        disabled={isRemoving || !canPut}
                    />
                ))}
                {isRemoving && <CircularProgress size={16} sx={{alignSelf: "center"}}/>}
            </Box>

            <FormProvider {...methods}>
                <SelectFieldControlled<IGroupSelectForm>
                    name="group_id"
                    label={t("form:user_management.add_group")}
                    options={availableGroups}
                    deactivated={isAssigning || !canPut}
                />
            </FormProvider>
        </Box>
    );
};

export default UserGroupAssignment;
