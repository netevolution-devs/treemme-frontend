import {useMemo} from "react";
import {useTranslation} from "react-i18next";
import {groupManagementApi} from "@features/panels/user-management/api/groupManagementApi.ts";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IUserManagementStoreState} from "@features/panels/user-management/UserManagementPanel.tsx";
import type {IGroupManagement} from "@features/panels/user-management/api/IGroupManagement.ts";
import type {MRT_ColumnDef} from "material-react-table";
import GenericList from "@features/panels/shared/GenericList.tsx";

const GroupManagementList = () => {
    const {t} = useTranslation(["form"]);
    const {data: groups = [], isLoading} = groupManagementApi.useGetList();

    const {useStore} = usePanel<unknown, IUserManagementStoreState>();
    const selectedGroupId = useStore(state => state.uiState.selectedGroupId);
    const setUIState = useStore(state => state.setUIState);

    const columns = useMemo<MRT_ColumnDef<IGroupManagement>[]>(() => [
        {
            accessorKey: "name",
            header: t("group_management.name"),
        },
        {
            accessorKey: "description",
            header: t("group_management.description"),
            Cell: ({cell}) => cell.getValue<string | null>() ?? "-",
        },
    ], [t]);

    return (
        <GenericList<IGroupManagement>
            data={groups}
            isLoading={isLoading}
            columns={columns}
            selectedId={selectedGroupId}
            onRowSelect={(id) => setUIState({selectedGroupId: id as number})}
        />
    );
};

export default GroupManagementList;
