import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IReasonsStoreState} from "@features/panels/shipping-invoicing/reasons/ReasonsPanel.tsx";
import {deliveryReasonApi} from "@features/panels/shipping-invoicing/reasons/api/deliveryReasonApi.ts";
import {useMemo} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import GenericList from "@features/panels/shared/GenericList.tsx";
import type {IDeliveryReason} from "@features/panels/shipping-invoicing/reasons/api/IDeliveryReason.ts";

const ReasonsList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IReasonsStoreState>();
    const selectedDeliveryReasonId = useStore(state => state.uiState.selectedDeliveryReasonId);
    const setUIState = useStore(state => state.setUIState);

    const {data: deliveryReasons = [], isLoading} = deliveryReasonApi.useGetList();

    const columns = useMemo<MRT_ColumnDef<IDeliveryReason>[]>(() => [
        {
            accessorKey: "name",
            header: t("shipping.reasons.name"),
        },
        {
            accessorKey: "warehouse_movement_reason.name",
            header: t("shipping.reasons.warehouse_movement_reason"),
        }
    ], [t]);


    return (
        <GenericList<IDeliveryReason>
            data={deliveryReasons}
            isLoading={isLoading}
            columns={columns}
            selectedId={selectedDeliveryReasonId}
            onRowSelect={(id) => setUIState({selectedDeliveryReasonId: id as number})}
        />
    )
}

export default ReasonsList;
