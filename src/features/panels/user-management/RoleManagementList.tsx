import {useMemo} from "react";
import {useTranslation} from "react-i18next";
import {roleManagementApi} from "@features/panels/user-management/api/roleManagementApi.ts";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IUserManagementStoreState} from "@features/panels/user-management/UserManagementPanel.tsx";
import type {IRoleManagement} from "@features/panels/user-management/api/IRoleManagement.ts";
import type {MRT_ColumnDef} from "material-react-table";
import GenericList from "@features/panels/shared/GenericList.tsx";

const RoleManagementList = () => {
    const {t} = useTranslation(["form"]);
    const {data: roles = [], isLoading} = roleManagementApi.useGetList();

    const {useStore} = usePanel<unknown, IUserManagementStoreState>();
    const selectedRoleId = useStore(state => state.uiState.selectedRoleId);
    const setUIState = useStore(state => state.setUIState);

    const columns = useMemo<MRT_ColumnDef<IRoleManagement>[]>(() => [
        {
            accessorKey: "name",
            header: t("role_management.name"),
        },
    ], [t]);

    return (
        <GenericList<IRoleManagement>
            data={roles}
            isLoading={isLoading}
            columns={columns}
            selectedId={selectedRoleId}
            onRowSelect={(id) => setUIState({selectedRoleId: id as number})}
        />
    );
};

export default RoleManagementList;
