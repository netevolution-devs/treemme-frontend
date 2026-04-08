import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import type {
    IPaymentTypesStoreState
} from "@features/panels/commercial/payment-types/PaymentTypesPanel";
import {useMemo} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import GenericList from "@features/panels/shared/GenericList";
import {paymentApi} from "@features/panels/commercial/payment-types/api/paymentApi";
import type {IPayment} from "@features/panels/commercial/payment-types/api/IPayment";

const PaymentTypesList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IPaymentTypesStoreState>();
    const selectedPaymentId = useStore((state) => state.uiState.selectedPaymentId);
    const setUIState = useStore((state) => state.setUIState);

    const {data: paymentTypes = [], isLoading, isFetching} = paymentApi.useGetList();

    const columns = useMemo<MRT_ColumnDef<IPayment>[]>(() => [
        {
            accessorKey: "name",
            header: t("payment_types.name"),
        }
    ], [t])

    return (
        <GenericList<IPayment>
            data={paymentTypes}
            isLoading={isLoading}
            isFetching={isFetching}
            columns={columns}
            selectedId={selectedPaymentId}
            onRowSelect={(id) => setUIState({selectedPaymentId: id})}
        />
    )
}

export default PaymentTypesList;
