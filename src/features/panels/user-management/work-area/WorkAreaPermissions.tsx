import {useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import type {MRT_ColumnDef, MRT_Row} from "material-react-table";
import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
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
import type {ResourceName} from "@features/authz/permission.utils";

type BooleanField = "can_get" | "can_post" | "can_put" | "can_delete" | "check_order";

const getName = (field: { id: number; name: string } | []) =>
    Array.isArray(field) ? "-" : field.name;

const AccessCheckbox = ({
                            row,
                            field,
                            workAreaId,
                            disabled = false,
                        }: {
    row: IWorkAreaGroupRoleAccess;
    field: BooleanField;
    workAreaId: number;
    disabled?: boolean;
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [effectiveValue, setEffectiveValue] = useState(row[field]);
    const {mutateAsync: updatingPerm} = useUpdateGroupAccessInWorkArea(workAreaId);

    const handleChange = async (checked: boolean) => {
        setIsLoading(true);
        try {
            await updatingPerm({id: row.id, field, value: checked});
            setEffectiveValue(checked);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Checkbox
            size="small"
            checked={effectiveValue}
            sx={{
                "&.Mui-checked": {color: "text.secondary"},
            }}
            disabled={disabled || isLoading}
            onChange={(e) => handleChange(e.target.checked)}
            onClick={(e) => e.stopPropagation()}
            icon={isLoading ? <CircularProgress size={16}/> : undefined}
            checkedIcon={isLoading ? <CircularProgress size={16}/> : undefined}
        />
    );
};

interface WorkAreaPermissionsSectionProps {
    workAreaId: number | null | undefined;
    workAreaAsResource: ResourceName;
    groupRoleWorkAreas: IWorkAreaGroupRoleAccess[];
    disabled?: boolean;
}

const WorkAreaPermissions = ({
                                 workAreaId,
                                 workAreaAsResource,
                                 groupRoleWorkAreas,
                                 disabled = false
                             }: WorkAreaPermissionsSectionProps) => {
    const {t} = useTranslation(["form"]);

    const [groupId, setGroupId] = useState<number>(0);
    const [roleId, setRoleId] = useState<number>(0);

    const {data: groups = []} = groupManagementApi.useGetList();
    const {data: roles = []} = roleManagementApi.useGetList();

    const {mutate: deleteAccess, isPending: isDeleting} = useDeleteGroupAccessForWorkArea(workAreaId!);
    const {mutate: assignAccess, isPending: isAssigning} = useAssignGroupAccessForWorkArea(workAreaId!);

    const showCheckOrder = workAreaAsResource === "ordini - ordini clienti";

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
            Cell: ({row}: { row: MRT_Row<IWorkAreaGroupRoleAccess> }) => <AccessCheckbox row={row.original}
                                                                                         field="can_get"
                                                                                         workAreaId={workAreaId!}
                                                                                         disabled={disabled}/>,
        },
        {
            accessorKey: "can_post",
            header: t("form:access_management.can_post"),
            size: 60, minSize: 60, maxSize: 60,
            Cell: ({row}: { row: MRT_Row<IWorkAreaGroupRoleAccess> }) => <AccessCheckbox row={row.original}
                                                                                         field="can_post"
                                                                                         workAreaId={workAreaId!}
                                                                                         disabled={disabled}/>,
        },
        {
            accessorKey: "can_put",
            header: t("form:access_management.can_put"),
            size: 60, minSize: 60, maxSize: 60,
            Cell: ({row}: { row: MRT_Row<IWorkAreaGroupRoleAccess> }) => <AccessCheckbox row={row.original}
                                                                                         field="can_put"
                                                                                         workAreaId={workAreaId!}
                                                                                         disabled={disabled}/>,
        },
        {
            accessorKey: "can_delete",
            header: t("form:access_management.can_delete"),
            size: 60, minSize: 60, maxSize: 60,
            Cell: ({row}: { row: MRT_Row<IWorkAreaGroupRoleAccess> }) => <AccessCheckbox row={row.original}
                                                                                         field="can_delete"
                                                                                         workAreaId={workAreaId!}
                                                                                         disabled={disabled}/>,
        },
        ...(showCheckOrder ? [{
            accessorKey: "check_order",
            header: t("form:access_management.check_order"),
            size: 80, minSize: 80, maxSize: 80,
            Cell: ({row}: { row: MRT_Row<IWorkAreaGroupRoleAccess> }) => <AccessCheckbox row={row.original}
                                                                                         field="check_order"
                                                                                         workAreaId={workAreaId!}
                                                                                         disabled={disabled}/>,
        }] : []),
    ], [t, workAreaId, showCheckOrder, disabled]);

    return (
        <Box>
            <Typography
                variant="h6"
                sx={{
                    mt: 0.5,
                    mb: 1,
                    fontWeight: 600,
                    color: disabled ? 'text.disabled' : 'text.primary'
                }}
            >
                Permessi
            </Typography>

            <Stack direction="row" gap={2} alignItems="flex-start" flexWrap="wrap">
                <Box sx={{
                    bgcolor: "background.card.default",
                    border: "1px solid",
                    borderColor: 'divider',
                    borderRadius: 1,
                    p: 1,
                    display: "flex",
                    flexDirection: "column",
                    height: "318px",
                    width: "400px",
                }}>
                    <Stack gap={2} sx={{minWidth: 300}}>
                        <FormControl fullWidth disabled={disabled}>
                            <InputLabel>{t("form:access_management.group_id")}</InputLabel>
                            <Select
                                size="small"
                                value={groupId || ""}
                                label={t("form:access_management.group_id")}
                                onChange={(e) => setGroupId(Number(e.target.value))}
                            >
                                {groups.map((g) => (
                                    <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth disabled={disabled}>
                            <InputLabel>{t("form:access_management.role_id")}</InputLabel>
                            <Select
                                size="small"
                                value={roleId || ""}
                                label={t("form:access_management.role_id")}
                                onChange={(e) => setRoleId(Number(e.target.value))}
                            >
                                {roles.map((r) => (
                                    <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button
                            sx={{mt: 0.5, boxShadow: "none"}}
                            variant="contained"
                            disabled={disabled || !groupId || !roleId || isAssigning}
                            onClick={handleAdd}
                            fullWidth
                        >
                            {isAssigning ? <CircularProgress size={20}/> : 'Aggiungi'}
                        </Button>
                    </Stack>
                </Box>

                {/* Permissions Table */}
                <Box sx={{flex: 1, minWidth: 600}}>
                    <GenericList<IWorkAreaGroupRoleAccess>
                        disableBorder
                        data={groupRoleWorkAreas}
                        isLoading={false}
                        columns={columns}
                        maxHeight="300px"
                        minHeight="300px"
                        additionalOptions={{
                            enableRowActions: true,
                            renderRowActions: ({row}) => (
                                <IconButton
                                    size="small"
                                    disabled={disabled || isDeleting}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteAccess(row.original.id);
                                    }}
                                    sx={{
                                        color: 'error.main',
                                        '&:hover': {
                                            backgroundColor: 'error.lighter',
                                        },
                                    }}
                                >
                                    <DeleteIcon fontSize="small"/>
                                </IconButton>
                            ),
                        }}
                    />
                </Box>
            </Stack>
        </Box>
    );
};

export default WorkAreaPermissions;
