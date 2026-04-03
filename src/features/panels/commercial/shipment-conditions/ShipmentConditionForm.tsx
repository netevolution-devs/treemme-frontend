import {useTranslation} from "react-i18next";
import type {
    IShipmentConditionsStoreState
} from "@features/panels/commercial/shipment-conditions/ShipmentConditionsPanel.tsx";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import {shipmentConditionApi} from "@features/panels/commercial/shipment-conditions/api/shipmentConditionApi.ts";
import type {IShipmentCondition} from "@features/panels/commercial/shipment-conditions/api/IShipmentCondition.ts";
import GenericForm from "@features/panels/shared/GenericForm.tsx";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled.tsx";
import FlagCheckBoxFieldControlled from "@ui/form/controlled/FlagCheckBoxFieldControlled.tsx";

export type IShipmentConditionForm = Omit<IShipmentCondition, 'id'>;

const ShipmentConditionForm = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IShipmentConditionsStoreState>();
    const selectedConditionId = useStore((state) => state.uiState.selectedConditionId);
    const setUIState = useStore((state) => state.setUIState);

    const {useGetDetail, usePost, usePut, useDelete} = shipmentConditionApi;
    const {data: condition} = useGetDetail(selectedConditionId);
    const {mutateAsync: createCondition, isPending: isPosting} = usePost();
    const {mutateAsync: updateCondition, isPending: isPutting} = usePut();
    const {mutateAsync: deleteCondition, isPending: isDeleting} = useDelete();

    return (
        <GenericForm<IShipmentConditionForm>
            selectedId={selectedConditionId}
            entity={condition}
            emptyValues={{
                name: '',
                borne_by_customer: false
            }}
            mapEntityToForm={(x) => ({
                name: x.name,
                borne_by_customer: x.borne_by_customer
            })}
            create={(payload) => createCondition(payload)}
            update={(id, payload) => updateCondition({id, payload})}
            remove={(id) => deleteCondition(id)}
            isSaving={isPosting || isPutting}
            isDeleting={isDeleting}
            onClearSelection={() => setUIState({selectedConditionId: null})}
            validateBeforeSave={(v) => !!v.name}
            renderFields={() => (
                <>
                    <TextFieldControlled<IShipmentConditionForm>
                        name="name"
                        label={t("shipment_conditions.name")}
                        required
                    />
                    <FlagCheckBoxFieldControlled<IShipmentConditionForm>
                        name="borne_by_customer"
                        label={t("shipment_conditions.borne_by_customer")}
                    />
                </>
            )}
        />
    );
};

export default ShipmentConditionForm;
