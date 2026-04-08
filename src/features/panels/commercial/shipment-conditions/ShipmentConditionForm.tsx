import {useTranslation} from "react-i18next";
import type {
    IShipmentConditionsStoreState
} from "@features/panels/commercial/shipment-conditions/ShipmentConditionsPanel";
import {usePanel} from "@ui/panel/PanelContext";
import {shipmentConditionApi} from "@features/panels/commercial/shipment-conditions/api/shipmentConditionApi";
import type {IShipmentCondition} from "@features/panels/commercial/shipment-conditions/api/IShipmentCondition";
import GenericForm from "@features/panels/shared/GenericForm";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled";
import type {ICustomPanelFormProps} from "@ui/panel/store/ICustomPanelPropst";
import {usePanelFormButtons} from "@features/panels/shared/hooks/usePanelFormButtons";
import {usePanelFormLogic} from "@ui/panel/usePanelFormLogin";
import FlagCheckBoxFieldControlled from "@ui/form/controlled/FlagCheckBoxFieldControlled";

export type IShipmentConditionForm = Omit<IShipmentCondition, 'id'>;

const ShipmentConditionForm = ({initialName, onSuccess}: ICustomPanelFormProps) => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IShipmentConditionsStoreState>();
    const selectedConditionId = useStore((state) => state.uiState.selectedConditionId);
    const setUIState = useStore((state) => state.setUIState);

    const {setFormState} = usePanelFormButtons();
    const {handlePanelSuccess} = usePanelFormLogic({
        initialName,
        selectedId: selectedConditionId,
        onSuccess,
        setFormState
    });

    const {useGetDetail, usePost, usePut, useDelete} = shipmentConditionApi;
    const {data: condition} = useGetDetail(selectedConditionId);
    const {mutateAsync: createCondition, isPending: isPosting} = usePost();
    const {mutateAsync: updateCondition, isPending: isPutting} = usePut();
    const {mutateAsync: deleteCondition, isPending: isDeleting} = useDelete();

    return (
        <GenericForm<IShipmentConditionForm, IShipmentCondition>
            onSuccess={handlePanelSuccess}
            selectedId={selectedConditionId}
            entity={condition}
            emptyValues={{
                name: initialName ?? '',
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
