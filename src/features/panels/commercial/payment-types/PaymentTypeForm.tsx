import {useTranslation} from "react-i18next";
import type {
    IPaymentTypesStoreState
} from "@features/panels/commercial/payment-types/PaymentTypesPanel.tsx";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import {paymentApi} from "@features/panels/commercial/payment-types/api/paymentApi.ts";
import type {IPayment} from "@features/panels/commercial/payment-types/api/IPayment.ts";
import GenericForm from "@features/panels/shared/GenericForm.tsx";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled.tsx";

export type IPaymentForm = Omit<IPayment, 'id'>;

const PaymentTypeForm = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IPaymentTypesStoreState>();
    const selectedPaymentId = useStore((state) => state.uiState.selectedPaymentId);
    const setUIState = useStore((state) => state.setUIState);

    const {useGetDetail, usePost, usePut, useDelete} = paymentApi;
    const {data: payment} = useGetDetail(selectedPaymentId);
    const {mutateAsync: createPayment, isPending: isPosting} = usePost();
    const {mutateAsync: updatePayment, isPending: isPutting} = usePut();
    const {mutateAsync: deletePayment, isPending: isDeleting} = useDelete();

    return (
        <GenericForm<IPaymentForm>
            selectedId={selectedPaymentId}
            entity={payment}
            emptyValues={{
                name: ''
            }}
            mapEntityToForm={(x) => ({
                name: x.name
            })}
            create={(payload) => createPayment(payload)}
            update={(id, payload) => updatePayment({id, payload})}
            remove={(id) => deletePayment(id)}
            isSaving={isPosting || isPutting}
            isDeleting={isDeleting}
            onClearSelection={() => setUIState({selectedPaymentId: null})}
            validateBeforeSave={(v) => !!v.name}
            renderFields={() => (
                <>
                    <TextFieldControlled<IPaymentForm>
                        name="name"
                        label={t("payment_types.name")}
                        required
                    />
                </>
            )}
        />
    );
};

export default PaymentTypeForm;
