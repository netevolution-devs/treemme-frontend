import {useState} from "react";
import {useTranslation} from "react-i18next";
import {Autocomplete, Box, Chip, CircularProgress, Divider, TextField, Typography} from "@mui/material";
import type {IUserManagement} from "@features/panels/user-management/api/IUserManagement.ts";
import {useAssignGroup, useRemoveGroup} from "@features/panels/user-management/api/userManagementApi.ts";
import {groupManagementApi} from "@features/panels/user-management/api/groupManagementApi.ts";

interface UserGroupAssignmentProps {
    user: IUserManagement;
}

const UserGroupAssignment = ({user}: UserGroupAssignmentProps) => {
    const {t} = useTranslation(["form"]);
    const [pendingGroupId, setPendingGroupId] = useState<number | null>(null);

    const {data: allGroups = []} = groupManagementApi.useGetList();
    const {mutate: assignGroup, isPending: isAssigning} = useAssignGroup();
    const {mutate: removeGroup, isPending: isRemoving} = useRemoveGroup();

    const assignedGroupIds = new Set(user.group_users.map(gu => gu.group.id));
    const availableGroups = allGroups
        .filter(g => !assignedGroupIds.has(g.id))
        .map(g => ({value: g.id, label: g.name}));

    const handleAdd = (_: unknown, option: { value: number; label: string } | null) => {
        if (!option) return;
        assignGroup({user_id: user.id, group_id: option.value});
        setPendingGroupId(null);
    };

    const handleRemove = (groupId: number) => {
        removeGroup({groupId, userId: user.id});
    };

    return (
        <Box sx={{mt: 2}}>
            <Typography variant="subtitle2" sx={{mb: 0.5}}>
                {t("form:user_management.groups")}
            </Typography>
            <Divider sx={{mb: 1.5}} />

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
                        disabled={isRemoving}
                    />
                ))}
                {isRemoving && <CircularProgress size={16} sx={{alignSelf: "center"}} />}
            </Box>

            <Autocomplete
                size="small"
                options={availableGroups}
                value={null}
                inputValue={pendingGroupId !== null ? String(pendingGroupId) : ""}
                getOptionLabel={(o) => o.label}
                isOptionEqualToValue={(o, v) => o.value === v.value}
                onChange={handleAdd}
                onInputChange={(_, val) => { if (!val) setPendingGroupId(null); }}
                loading={isAssigning}
                noOptionsText={t("common:search.no-options")}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={t("form:user_management.add_group")}
                        size="small"
                        slotProps={{
                            input: {
                                ...params.InputProps,
                                endAdornment: (
                                    <>
                                        {isAssigning && <CircularProgress size={16} />}
                                        {params.InputProps.endAdornment}
                                    </>
                                ),
                            }
                        }}
                    />
                )}
            />
        </Box>
    );
};

export default UserGroupAssignment;
