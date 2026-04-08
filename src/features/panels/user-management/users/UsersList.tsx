import {useMemo} from "react";
import {useTranslation} from "react-i18next";
import {usersApi} from "@features/panels/user-management/users/api/usersApi";
import {usePanel} from "@ui/panel/PanelContext";
import type {IUsersStoreState} from "@features/panels/user-management/users/UsersPanel";
import type {IUserManagement} from "@features/panels/user-management/users/api/IUserManagement";
import type {MRT_ColumnDef} from "material-react-table";
import GenericList from "@features/panels/shared/GenericList";
import dayjs from "dayjs";

const UsersList = () => {
    const {t} = useTranslation(["form"]);
    const {data: users = [], isLoading} = usersApi.useGetList();

    const {useStore} = usePanel<unknown, IUsersStoreState>();
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

export default UsersList;
