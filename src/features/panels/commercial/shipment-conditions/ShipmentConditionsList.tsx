import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {
    IShipmentConditionsStoreState
} from "@features/panels/commercial/shipment-conditions/ShipmentConditionsPanel.tsx";
import {useMemo} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import GenericList from "@features/panels/shared/GenericList.tsx";
import {shipmentConditionApi} from "@features/panels/commercial/shipment-conditions/api/shipmentConditionApi.ts";
import type {IShipmentCondition} from "@features/panels/commercial/shipment-conditions/api/IShipmentCondition.ts";

const ShipmentConditionsList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IShipmentConditionsStoreState>();
    const selectedConditionId = useStore((state) => state.uiState.selectedConditionId);
    const setUIState = useStore((state) => state.setUIState);

    const {data: shipmentConditions = [], isLoading, isFetching} = shipmentConditionApi.useGetList();

    const columns = useMemo<MRT_ColumnDef<IShipmentCondition>[]>(() => [
        {
            accessorKey: "name",
            header: t("shipment_conditions.name"),
        }
    ], [t])

    return (
        <GenericList<IShipmentCondition>
            data={shipmentConditions}
            isLoading={isLoading}
            isFetching={isFetching}
            columns={columns}
            selectedId={selectedConditionId}
            onRowSelect={(id) => setUIState({selectedConditionId: id})}
        />
    )
}

export default ShipmentConditionsList;
