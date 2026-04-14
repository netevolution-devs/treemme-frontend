import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import type {IPalletsStoreState} from "@features/panels/warehouse/pallets/PalletsPanel";
import {palletApi} from "@features/panels/warehouse/pallets/api/palletApi";
import GenericForm from "@features/panels/shared/GenericForm";
import type {IPallet} from "@features/panels/warehouse/pallets/api/IPallet";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled";
import NumberFieldControlled from "@ui/form/controlled/NumberFieldControlled";
import SelectFieldControlled from "@ui/form/controlled/SelectFieldController";
import {measurementUnitApi} from "@features/panels/shared/api/measurement-unit/measurementUnitApi";

export type IPalletForm = Omit<IPallet, 'id' | 'measurement_unit'> & {
    measurement_unit_id: number | null;
};

const PalletsForm = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IPalletsStoreState>();
    const selectedPalletId = useStore((state) => state.uiState.selectedPalletId);
    const setUIState = useStore((state) => state.setUIState);

    const {useGetDetail, usePost, usePut, useDelete} = palletApi;
    const {data: palletItem} = useGetDetail(selectedPalletId);
    const {mutateAsync: createPallet, isPending: isPosting} = usePost();
    const {mutateAsync: updatePallet, isPending: isPutting} = usePut();
    const {mutateAsync: deletePallet, isPending: isDeleting} = useDelete();

    const {useGetList: useGetMeasurementUnits} = measurementUnitApi;
    const {data: measurementUnits = []} = useGetMeasurementUnits();

    return (
        <GenericForm<IPalletForm, IPallet, IPalletsStoreState>
            resource="magazzino - pallets"
            selectedId={selectedPalletId}
            entity={palletItem}
            emptyValues={{
                name: '',
                weight: 0,
                measurement_unit_id: null,
            }}
            mapEntityToForm={(x) => ({
                name: x.name,
                weight: x.weight,
                measurement_unit_id: x.measurement_unit.id,
            })}
            create={(payload) => createPallet(payload)}
            update={(id, payload) => updatePallet({id, payload})}
            remove={(id) => deletePallet(id)}
            isSaving={isPosting || isPutting}
            isDeleting={isDeleting}
            onClearSelection={() => setUIState({selectedPalletId: null})}
            renderFields={() => (
                <>
                    <TextFieldControlled
                        name={"name"}
                        label={t("warehouse.pallets.name")}
                        required
                    />
                    <NumberFieldControlled
                        name={"weight"}
                        label={t("warehouse.pallets.weight")}
                        required
                    />
                    <SelectFieldControlled
                        name={"measurement_unit_id"}
                        label={t("warehouse.pallets.measurement_unit")}
                        options={measurementUnits.map(mu => ({value: mu.id, label: `${mu.prefix} - ${mu.name}`}))}
                        required
                    />
                </>
            )}
        />
    );
};

export default PalletsForm;
