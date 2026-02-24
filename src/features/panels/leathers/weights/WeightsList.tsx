import GenericList from "@features/panels/shared/GenericList.tsx";
import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IWeightsStoreState} from "@features/panels/leathers/weights/WeightsPanel.tsx";
import {weightApi} from "@features/panels/leathers/weights/api/weightApi.ts";
import {useMemo} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import type {IWeight} from "@features/panels/leathers/weights/api/IWeight.ts";

const WeightsList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IWeightsStoreState>();
    const selectedWeightId = useStore((state) => state.uiState.selectedWeightId);
    const setUIState = useStore((state) => state.setUIState);

    const {data: weights, isLoading} = weightApi.useGetList();

    const columns = useMemo<MRT_ColumnDef<IWeight>[]>(() => [
        {
            accessorKey: "name",
            header: t("leathers.weight.name"),
        }
    ], [t]);

    return (
        <GenericList<IWeight>
            data={weights}
            isLoading={isLoading}
            columns={columns}
            selectedId={selectedWeightId}
            onRowSelect={(id) => setUIState({ selectedWeightId: id })}
        />
    );
};

export default WeightsList;