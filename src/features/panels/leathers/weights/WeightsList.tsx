import GenericList from "@features/panels/shared/GenericList";
import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import type {IWeightsStoreState} from "@features/panels/leathers/weights/WeightsPanel";
import {weightApi} from "@features/panels/leathers/weights/api/weightApi";
import {useMemo} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import type {IWeight} from "@features/panels/leathers/weights/api/IWeight";

const WeightsList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IWeightsStoreState>();
    const selectedWeightId = useStore((state) => state.uiState.selectedWeightId);
    const setUIState = useStore((state) => state.setUIState);

    const {data: weights = [], isLoading, isFetching} = weightApi.useGetList();

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
            isFetching={isFetching}
            columns={columns}
            selectedId={selectedWeightId}
            onRowSelect={(id) => setUIState({ selectedWeightId: id })}
        />
    );
};

export default WeightsList;