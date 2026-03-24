import {useMemo} from "react";
import {useTranslation} from "react-i18next";
import {userManagementApi} from "@features/panels/user-management/api/userManagementApi.ts";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IUserManagementStoreState} from "@features/panels/user-management/UserManagementPanel.tsx";
import type {IUserManagement} from "@features/panels/user-management/api/IUserManagement.ts";
import type {MRT_ColumnDef} from "material-react-table";
import GenericList from "@features/panels/shared/GenericList.tsx";
import dayjs from "dayjs";

const UserManagementList = () => {
    const {t} = useTranslation(["form"]);
    const {data: users = [], isLoading} = userManagementApi.useGetList();

    const {useStore} = usePanel<unknown, IUserManagementStoreState>();
    const selectedUserId = useStore(state => state.uiState.selectedUserId);
    const setUIState = useStore(state => state.setUIState);

    const columns = useMemo<MRT_ColumnDef<IUserManagement>[]>(() => [
        {
            accessorKey: "user_code",
            header: t("user_management.user_code"),
        },
        {
            accessorKey: "email",
            header: t("user_management.email"),
        },
        {
            accessorKey: "last_access",
            header: t("user_management.last_access"),
            Cell: ({ cell }) => {
                const value = cell.getValue<string | null>();
                return value ? dayjs(value).format("DD/MM/YYYY HH:mm") : "-";
            },
        },
    ], [t]);

    return (
        <GenericList<IUserManagement>
            data={users}
            isLoading={isLoading}
            columns={columns}
            selectedId={selectedUserId}
            onRowSelect={(id) => setUIState({selectedUserId: id as number})}
        />
    );
};

export default UserManagementList;
