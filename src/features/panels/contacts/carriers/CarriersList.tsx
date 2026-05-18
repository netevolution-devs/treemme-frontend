import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import type {ICarriersStoreState} from "@features/panels/contacts/carriers/CarriersPanel";
import {carrierApi} from "@features/panels/contacts/carriers/api/carrierApi";
import {useMemo} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import type {ICarrier} from "@features/panels/contacts/carriers/api/ICarrier";
import GenericList from "@features/panels/shared/GenericList";

const CarriersList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, ICarriersStoreState>();
    const selectedCarrierId = useStore(state => state.uiState.selectedCarrierId);
    const setUIState = useStore(state => state.setUIState);

    const {data: carriers = [], isLoading, isFetching} = carrierApi.useGetList();

    const columns = useMemo<MRT_ColumnDef<ICarrier>[]>(() => [
        {
            accessorKey: "name",
            header: t("contacts.carrier-name"),
        }
    ], [t]);

    return (
        <GenericList<ICarrier>
            data={carriers}
            isLoading={isLoading}
            isFetching={isFetching}
            columns={columns}
            selectedId={selectedCarrierId}
            onRowSelect={(id) => setUIState({selectedCarrierId: id})}
        />
    )
}

export default CarriersList;