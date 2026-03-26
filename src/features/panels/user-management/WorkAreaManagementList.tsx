import {useMemo} from "react";
import {useTranslation} from "react-i18next";
import {workAreaManagementApi} from "@features/panels/user-management/api/workAreaManagementApi.ts";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IUserManagementStoreState} from "@features/panels/user-management/UserManagementPanel.tsx";
import type {IWorkAreaManagement} from "@features/panels/user-management/api/IWorkAreaManagement.ts";
import type {MRT_ColumnDef} from "material-react-table";
import GenericList from "@features/panels/shared/GenericList.tsx";

const WorkAreaManagementList = () => {
    const {t} = useTranslation(["form"]);
    const {data: workAreas = [], isLoading} = workAreaManagementApi.useGetList();

    const {useStore} = usePanel<unknown, IUserManagementStoreState>();
    const selectedWorkAreaId = useStore(state => state.uiState.selectedWorkAreaId);
    const setUIState = useStore(state => state.setUIState);

    const columns = useMemo<MRT_ColumnDef<IWorkAreaManagement>[]>(() => [
        {
            accessorKey: "name",
            header: t("work_area_management.name"),
        },
        {
            accessorKey: "description",
            header: t("work_area_management.description"),
            Cell: ({cell}) => cell.getValue<string | null>() ?? "-",
        },
    ], [t]);

    return (
        <GenericList<IWorkAreaManagement>
            data={workAreas}
            isLoading={isLoading}
            columns={columns}
            selectedId={selectedWorkAreaId}
            onRowSelect={(id) => setUIState({selectedWorkAreaId: id as number})}
        />
    );
};

export default WorkAreaManagementList;
