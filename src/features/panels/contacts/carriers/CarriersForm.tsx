import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import type {ICarriersStoreState} from "@features/panels/contacts/carriers/CarriersPanel";
import {carrierApi} from "@features/panels/contacts/carriers/api/carrierApi";
import type {ICarrier} from "@features/panels/contacts/carriers/api/ICarrier";
import GenericForm from "@features/panels/shared/GenericForm";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled";
export type ICarrierForm = Omit<ICarrier, "id">;

const CarriersForm = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, ICarriersStoreState>();
    const selectedCarrierId = useStore(state => state.uiState.selectedCarrierId);
    const setUIState = useStore(state => state.setUIState);

    const {useGetDetail, usePost, usePut, useDelete} = carrierApi;
    const {data: carrier} = useGetDetail(selectedCarrierId);
    const {mutateAsync: createCarrier, isPending: isPosting} = usePost();
    const {mutateAsync: updateCarrier, isPending: isPutting} = usePut();
    const {mutateAsync: deleteCarrier, isPending: isDeleting} = useDelete();

    return (
        <GenericForm<ICarrierForm, ICarrier, ICarriersStoreState>
            resource="contatti - trasportatori"
            selectedId={selectedCarrierId}
            entity={carrier}
            emptyValues={{
                name: "",
            }}
            mapEntityToForm={(x) => ({
                name: x.name,
            })}
            create={(payload) => createCarrier(payload)}
            update={(id, payload) => updateCarrier({id, payload})}
            remove={(id) => deleteCarrier(id)}
            isSaving={isPosting || isPutting}
            isDeleting={isDeleting}
            onClearSelection={() => setUIState({selectedCarrierId: null})}
            validateBeforeSave={(v) => !!v.name}
            renderFields={() => (
                <TextFieldControlled<ICarrierForm>
                    name={"name"}
                    label={t("contacts.carrier-name")}
                    required
                />
            )}
        />
    )
}

export default CarriersForm;