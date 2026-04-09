import {useTranslation} from "react-i18next";
import type {ITanningStagesStoreState} from "@features/panels/leathers/tanning-stages/TanningStagesPanel";
import {usePanel} from "@ui/panel/PanelContext";
import {tanningStageApi} from "@features/panels/leathers/tanning-stages/api/tanningStageApi";
import {useMemo} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import type {ITanningStage} from "@features/panels/leathers/tanning-stages/api/ITanningStage";
import GenericList from "@features/panels/shared/GenericList";

const TanningStagesList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, ITanningStagesStoreState>();
    const selectedTanningStageId = useStore(state => state.uiState.selectedTanningStageId);
    const setUIState = useStore(state => state.setUIState);

    const {data: tanningStages = [], isLoading, isFetching} = tanningStageApi.useGetList();

    const columns = useMemo<MRT_ColumnDef<ITanningStage>[]>(() => [
        {
            accessorKey: "code",
            header: t("leathers.status.code"),
            size: 0
        },
        {
            accessorKey: "name",
            header: t("leathers.status.name"),
        }
    ], [t])

    return (
        <GenericList<ITanningStage>
            data={tanningStages}
            isLoading={isLoading}
            isFetching={isFetching}
            columns={columns}
            selectedId={selectedTanningStageId}
            onRowSelect={(id) => setUIState({selectedTanningStageId: id})}
        />
    );
};

export default TanningStagesList;