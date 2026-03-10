import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {ISeaportsStoreState} from "@features/panels/contacts/seaports/SeaportsPanel.tsx";
import {seaPortApi} from "@features/panels/contacts/seaports/api/seaPortApi.ts";
import GenericForm from "@features/panels/shared/GenericForm.tsx";
import type {ISeaPort} from "@features/panels/contacts/seaports/api/ISeaPort.ts";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled.tsx";
import NumberFieldControlled from "@ui/form/controlled/NumberFieldControlled.tsx";
import {Box} from "@mui/material";

export type ISeaPortForm = Omit<ISeaPort, 'id'>;

const SeaPortsForm = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, ISeaportsStoreState>();
    const selectedSeaPortId = useStore(state => state.uiState.selectedSeaPortId);
    const setUIState = useStore(state => state.setUIState);

    const {useGetDetail, usePost, usePut, useDelete} = seaPortApi;
    const {data: seaPort} = useGetDetail(selectedSeaPortId);
    const {mutateAsync: createSeaPort, isPending: isPosting} = usePost();
    const {mutateAsync: updateSeaPort, isPending: isPutting} = usePut();
    const {mutateAsync: deleteSeaPort, isPending: isDeleting} = useDelete();

    return (
        <GenericForm<ISeaPortForm, ISeaPort, ISeaportsStoreState>
            selectedId={selectedSeaPortId}
            entity={seaPort}
            emptyValues={{
                name: '',
                note: '',
                ductible_day: null,
                parking_day_cost: null,
                container_deductible_day: null,
                container_parking_day_cost: null,
            }}
            mapEntityToForm={(x) => ({
                name: x.name,
                note: x.note ?? '',
                ductible_day: x.ductible_day,
                parking_day_cost: x.parking_day_cost,
                container_deductible_day: x.container_deductible_day,
                container_parking_day_cost: x.container_parking_day_cost,
            })}
            create={(payload) => createSeaPort(payload)}
            update={(id, payload) => updateSeaPort({id, payload})}
            remove={(id) => deleteSeaPort(id)}
            isSaving={isPosting || isPutting}
            isDeleting={isDeleting}
            onClearSelection={() => setUIState({selectedSeaPortId: null})}
            validateBeforeSave={(v) => !!v.name}
            renderFields={() => (
                <>
                    <TextFieldControlled<ISeaPortForm>
                        name={"name"}
                        label={t("contacts.seaports.name")}
                        required
                    />
                    <Box sx={{display: 'flex', gap: 1}}>
                        <NumberFieldControlled<ISeaPortForm>
                            name={"ductible_day"}
                            label={t("contacts.seaports.ductible_day")}
                        />
                        <NumberFieldControlled<ISeaPortForm>
                            name={"parking_day_cost"}
                            label={t("contacts.seaports.parking_day_cost")}
                        />
                    </Box>
                    <Box sx={{display: 'flex', gap: 1}}>
                        <NumberFieldControlled<ISeaPortForm>
                            name={"container_deductible_day"}
                            label={t("contacts.seaports.container_deductible_day")}
                        />
                        <NumberFieldControlled<ISeaPortForm>
                            name={"container_parking_day_cost"}
                            label={t("contacts.seaports.container_parking_day_cost")}
                        />
                    </Box>
                    <TextFieldControlled<ISeaPortForm>
                        name={"note"}
                        label={t("contacts.notes")}
                        TextFieldProps={{multiline: true, rows: 2}}
                    />
                </>
            )}
        />
    )
}

export default SeaPortsForm;