import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import type {IPalletsStoreState} from "@features/panels/warehouse/pallets/PalletsPanel";
import {palletApi} from "@features/panels/warehouse/pallets/api/palletApi";
import {useMemo} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import type {IPallet} from "@features/panels/warehouse/pallets/api/IPallet";
import GenericList from "@features/panels/shared/GenericList";

const PalletsList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IPalletsStoreState>();
    const selectedPalletId = useStore(state => state.uiState.selectedPalletId);
    const setUIState = useStore(state => state.setUIState);

    const {data: pallets = [], isLoading, isFetching} = palletApi.useGetList();

    const columns = useMemo<MRT_ColumnDef<IPallet>[]>(() => [
        {
            accessorKey: "name",
            header: t("warehouse.pallets.name")
        },
        {
            accessorKey: "weight",
            header: t("warehouse.pallets.weight")
        },
        {
            accessorKey: "measurement_unit.prefix",
            header: t("warehouse.pallets.measurement_unit")
        }
    ], [t]);

    return (
        <GenericList<IPallet>
            data={pallets}
            isLoading={isLoading}
            isFetching={isFetching}
            columns={columns}
            selectedId={selectedPalletId}
            onRowSelect={(id) => setUIState({selectedPalletId: id})}
        />
    );
};

export default PalletsList;
