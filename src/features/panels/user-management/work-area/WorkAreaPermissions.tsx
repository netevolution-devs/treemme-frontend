import {useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import type {MRT_ColumnDef} from "material-react-table";
import {
    Button,
    Checkbox,
    Divider,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import GenericList from "@features/panels/shared/GenericList";
import {
    useAssignGroupAccessForWorkArea,
    useDeleteGroupAccessForWorkArea,
    useUpdateGroupAccessInWorkArea,
} from "@features/panels/user-management/users/api/usersApi";
import {groupManagementApi} from "@features/panels/user-management/organization/api/groupManagementApi";
import {roleManagementApi} from "@features/panels/user-management/organization/api/roleManagementApi";
import type {IWorkAreaGroupRoleAccess} from "@features/panels/user-management/work-area/api/IWorkAreaManagement";

type BooleanField = "can_get" | "can_post" | "can_put" | "can_delete" | "check_order";

const getName = (field: { id: number; name: string } | []) =>
    Array.isArray(field) ? "-" : field.name;

const AccessCheckbox = ({
                            row,
                            field,
                            workAreaId,
                        }: {
    row: IWorkAreaGroupRoleAccess;
    field: BooleanField;
    workAreaId: number;
}) => {
    const {mutate, isPending} = useUpdateGroupAccessInWorkArea(workAreaId);
    return (
        <Checkbox
            size="small"
            checked={row[field]}
            sx={{"&.Mui-checked": {color: "text.secondary"}}}
            disabled={isPending}
            onChange={(e) => mutate({id: row.id, field, value: e.target.checked})}
            onClick={(e) => e.stopPropagation()}
        />
    );
};

interface WorkAreaPermissionsSectionProps {
    workAreaId: number;
    groupRoleWorkAreas: IWorkAreaGroupRoleAccess[];
}

const WorkAreaPermissions = ({workAreaId, groupRoleWorkAreas}: WorkAreaPermissionsSectionProps) => {
    const {t} = useTranslation(["form"]);

    const [groupId, setGroupId] = useState<number>(0);
    const [roleId, setRoleId] = useState<number>(0);

    const {data: groups = []} = groupManagementApi.useGetList();
    const {data: roles = []} = roleManagementApi.useGetList();

    const {mutate: deleteAccess, isPending: isDeleting} = useDeleteGroupAccessForWorkArea(workAreaId);
    const {mutate: assignAccess, isPending: isAssigning} = useAssignGroupAccessForWorkArea(workAreaId);

    const handleAdd = () => {
        if (!groupId || !roleId) return;
        assignAccess(
            {group_id: groupId, role_id: roleId},
            {
                onSuccess: () => {
                    setGroupId(0);
                    setRoleId(0);
                }
            }
        );
    };

    const columns = useMemo<MRT_ColumnDef<IWorkAreaGroupRoleAccess>[]>(() => [
        {
            accessorFn: (row) => getName(row.group),
            id: "group",
            header: t("form:access_management.group_id"),
        },
        {
            accessorFn: (row) => getName(row.role),
            id: "role",
            header: t("form:access_management.role_id"),
        },
        {
            accessorKey: "can_get",
            header: t("form:access_management.can_get"),
            size: 60, minSize: 60, maxSize: 60,
            Cell: ({row}) => <AccessCheckbox row={row.original} field="can_get" workAreaId={workAreaId}/>,
        },
        {
            accessorKey: "can_post",
            header: t("form:access_management.can_post"),
            size: 60, minSize: 60, maxSize: 60,
            Cell: ({row}) => <AccessCheckbox row={row.original} field="can_post" workAreaId={workAreaId}/>,
        },
        {
            accessorKey: "can_put",
            header: t("form:access_management.can_put"),
            size: 60, minSize: 60, maxSize: 60,
            Cell: ({row}) => <AccessCheckbox row={row.original} field="can_put" workAreaId={workAreaId}/>,
        },
        {
            accessorKey: "can_delete",
            header: t("form:access_management.can_delete"),
            size: 60, minSize: 60, maxSize: 60,
            Cell: ({row}) => <AccessCheckbox row={row.original} field="can_delete" workAreaId={workAreaId}/>,
        },
        {
            accessorKey: "check_order",
            header: t("form:access_management.check_order"),
            size: 80, minSize: 80, maxSize: 80,
            Cell: ({row}) => <AccessCheckbox row={row.original} field="check_order" workAreaId={workAreaId}/>,
        },
    ], [t, workAreaId]);

    return (
        <Stack gap={1.5} sx={{mt: 1}}>
            <Divider/>
            <Typography sx={{mb: 1, fontSize: 16, mt: 2}}>
                Permessi
            </Typography>

            <Stack direction="row" gap={1} alignItems={"start"} flexWrap="wrap" justifyContent={"space-between"}>

                <Stack direction="row" gap={4} alignItems="start" justifyContent={"space-between"}>
                    <Stack gap={1} >
                        <FormControl sx={{minWidth: 400}}>
                            <InputLabel>{t("form:access_management.group_id")}</InputLabel>
                            <Select
                                size="medium"
                                value={groupId || ""}
                                label={t("form:access_management.group_id")}
                                onChange={(e) => setGroupId(Number(e.target.value))}
                            >
                                {groups.map((g) => (
                                    <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl sx={{minWidth: 400}}>
                            <InputLabel>{t("form:access_management.role_id")}</InputLabel>
                            <Select
                                value={roleId || ""}
                                label={t("form:access_management.role_id")}
                                onChange={(e) => setRoleId(Number(e.target.value))}
                            >
                                {roles.map((r) => (
                                    <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Stack>
                    <Button
                        variant={"outlined"}
                        disabled={!groupId || !roleId || isAssigning}
                        onClick={handleAdd}
                    >
                        Aggiungi
                    </Button>
                </Stack>
                <GenericList<IWorkAreaGroupRoleAccess>
                    data={groupRoleWorkAreas}
                    isLoading={false}
                    columns={columns}
                    maxHeight="260px"
                    minHeight="260px"
                    additionalOptions={{
                        enableRowActions: true,
                        renderRowActions: ({row}) => (
                            <IconButton
                                size="small"
                                disabled={isDeleting}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteAccess(row.original.id);
                                }}
                            >
                                <DeleteIcon fontSize="small"/>
                            </IconButton>
                        ),
                    }}
                />
            </Stack>
        </Stack>
    );
};

export default WorkAreaPermissions;
