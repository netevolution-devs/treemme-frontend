import {useTranslation} from "react-i18next";
import type {ITanningStagesStoreState} from "@features/panels/leathers/tanning-stages/TanningStagesPanel.tsx";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import {tanningStageApi} from "@features/panels/leathers/tanning-stages/api/tanningStageApi.ts";
import {useMemo} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import type {ITanningStage} from "@features/panels/leathers/tanning-stages/api/ITanningStage.ts";
import GenericList from "@features/panels/shared/GenericList.tsx";
import {useSafeArray} from "@helpers/useSafeArray.ts";

const TanningStagesList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, ITanningStagesStoreState>();
    const selectedTanningStageId = useStore(state => state.uiState.selectedTanningStageId);
    const setUIState = useStore(state => state.setUIState);

    const {data: tanningStages, isLoading} = tanningStageApi.useGetList();
    const tanningStageList = useSafeArray(tanningStages)

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
            data={tanningStageList}
            isLoading={isLoading}
            columns={columns}
            selectedId={selectedTanningStageId}
            onRowSelect={(id) => setUIState({selectedTanningStageId: id})}
        />
    );
};

export default TanningStagesList;