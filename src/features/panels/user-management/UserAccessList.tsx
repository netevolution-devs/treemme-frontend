import {useMemo} from "react";
import {useTranslation} from "react-i18next";
import type {MRT_ColumnDef} from "material-react-table";
import {Checkbox} from "@mui/material";
import GenericList from "@features/panels/shared/GenericList.tsx";
import {
    useGetGroupAccessList,
    useUpdateGroupAccess,
    type IUserGroupAccess
} from "@features/panels/user-management/api/userManagementApi.ts";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IUserAccessStoreState} from "@features/panels/user-management/UserAccessPanel.tsx";

const getName = (field: { id: number; name?: string } | []) =>
    Array.isArray(field) ? "-" : (field.name ?? "-");

type BooleanField = "can_get" | "can_post" | "can_put" | "can_delete" | "check_order";

const AccessCheckbox = ({row, field}: { row: IUserGroupAccess; field: BooleanField }) => {
    const {mutate, isPending} = useUpdateGroupAccess();
    return (
        <Checkbox
            size="small"
            checked={row[field]}
            sx={{
                '&.Mui-checked': {
                    color: 'text.secondary',
                },
            }}
            disabled={isPending}
            onChange={(e) => mutate({id: row.id, field, value: e.target.checked})}
            onClick={(e) => e.stopPropagation()}
        />
    );
};

const UserAccessList = () => {
    const {t} = useTranslation(["form"]);
    const {data: accesses = [], isLoading} = useGetGroupAccessList();

    const {useStore} = usePanel<unknown, IUserAccessStoreState>();
    const selectedAccessId = useStore(state => state.uiState.selectedAccessId);
    const setUIState = useStore(state => state.setUIState);

    const columns = useMemo<MRT_ColumnDef<IUserGroupAccess>[]>(() => [
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
            accessorFn: (row) => getName(row.work_area),
            id: "work_area",
            header: t("form:access_management.work_area_id"),
        },
        {
            accessorKey: "can_get",
            header: t("form:access_management.can_get"),
            size: 60, minSize: 60, maxSize: 60,
            Cell: ({row}) => <AccessCheckbox row={row.original} field="can_get"/>,
        },
        {
            accessorKey: "can_post",
            header: t("form:access_management.can_post"),
            size: 60, minSize: 60, maxSize: 60,
            Cell: ({row}) => <AccessCheckbox row={row.original} field="can_post"/>,
        },
        {
            accessorKey: "can_put",
            header: t("form:access_management.can_put"),
            size: 60, minSize: 60, maxSize: 60,
            Cell: ({row}) => <AccessCheckbox row={row.original} field="can_put"/>,
        },
        {
            accessorKey: "can_delete",
            header: t("form:access_management.can_delete"),
            size: 60, minSize: 60, maxSize: 60,
            Cell: ({row}) => <AccessCheckbox row={row.original} field="can_delete"/>,
        },
        {
            accessorKey: "check_order",
            header: t("form:access_management.check_order"),
            size: 80, minSize: 80, maxSize: 80,
            Cell: ({row}) => <AccessCheckbox row={row.original} field="check_order"/>,
        },
    ], [t]);

    return (
        <GenericList<IUserGroupAccess>
            data={accesses}
            isLoading={isLoading}
            columns={columns}
            selectedId={selectedAccessId}
            onRowSelect={(id) => setUIState({selectedAccessId: id as number})}
        />
    );
};

export default UserAccessList;
