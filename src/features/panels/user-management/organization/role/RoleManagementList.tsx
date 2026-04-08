import {useMemo} from "react";
import {useTranslation} from "react-i18next";
import {roleManagementApi} from "@features/panels/user-management/organization/api/roleManagementApi";
import {usePanel} from "@ui/panel/PanelContext";
import type {IRoleManagement} from "@features/panels/user-management/organization/api/IRoleManagement";
import type {MRT_ColumnDef} from "material-react-table";
import GenericList from "@features/panels/shared/GenericList";
import type {IOrganizationManagementStoreState} from "@features/panels/user-management/organization/OrganizationManagementPanel";

const RoleManagementList = () => {
    const {t} = useTranslation(["form"]);
    const {data: roles = [], isLoading} = roleManagementApi.useGetList();

    const {useStore} = usePanel<unknown, IOrganizationManagementStoreState>();
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
