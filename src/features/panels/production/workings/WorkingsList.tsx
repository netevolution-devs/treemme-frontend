import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IWorkingsStoreState} from "@features/panels/production/workings/WorkingsPanel.tsx";
import {workingApi} from "@features/panels/production/workings/api/workingApi.ts";
import {useMemo} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import type {IWorking} from "@features/panels/production/workings/api/IWorking.ts";
import GenericList from "@features/panels/shared/GenericList.tsx";

const WorkingsList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IWorkingsStoreState>();
    const selectedWorkingId = useStore(state => state.uiState.selectedWorkingId);
    const setUIState = useStore(state => state.setUIState);

    const {data: workings = [], isLoading} = workingApi.useGetList();

    const columns = useMemo<MRT_ColumnDef<IWorking>[]>(() => [
        {
            accessorKey: "name",
            header: t("production.working.name"),
        }
    ], [t]);

    return (
        <GenericList<IWorking>
            data={workings}
            columns={columns}
            isLoading={isLoading}
            selectedId={selectedWorkingId}
            onRowSelect={(id) => setUIState({selectedWorkingId: id})}
        />
    )
}

export default WorkingsList;