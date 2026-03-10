import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {ITanningStagesStoreState} from "@features/panels/leathers/tanning-stages/TanningStagesPanel.tsx";
import GenericForm from "@features/panels/shared/GenericForm.tsx";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled.tsx";
import NumberFieldControlled from "@ui/form/controlled/NumberFieldControlled.tsx";
import SelectFieldControlled from "@ui/form/controlled/SelectFieldController.tsx";
import type {ITanningStage} from "@features/panels/leathers/tanning-stages/api/ITanningStage.ts";
import {type ITanningStagePayload, tanningStageApi} from "@features/panels/leathers/tanning-stages/api/tanningStageApi.ts";
import {measurementUnitApi} from "@features/panels/shared/api/measurement-unit/measurementUnitApi.ts";
import {Box} from "@mui/material";

export type ITanningStageForm = Omit<ITanningStage, 'id' | 'measurement_unit' | 'flower_yield_coefficient'> & {
    measurement_unit_id: number | null;
    flower_yield_coefficient: number | null;
};

const TanningStagesForm = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, ITanningStagesStoreState>();
    const selectedTanningStageId = useStore(state => state.uiState.selectedTanningStageId);
    const setUIState = useStore(state => state.setUIState);

    const {useGetDetail, usePost, usePut, useDelete} = tanningStageApi;
    const {data: tanningStage} = useGetDetail(selectedTanningStageId);
    const {mutateAsync: createTanningStage, isPending: isPosting} = usePost();
    const {mutateAsync: updateTanningStage, isPending: isPutting} = usePut();
    const {mutateAsync: deleteTanningStage, isPending: isDeleting} = useDelete();

    const {useGetList: useGetMeasurementUnits} = measurementUnitApi;
    const {data: measurementUnits} = useGetMeasurementUnits();

    return (
        <GenericForm<ITanningStageForm, ITanningStage, ITanningStagesStoreState>
            selectedId={selectedTanningStageId}
            entity={tanningStage}
            emptyValues={{
                code: '',
                name: '',
                flower_yield_coefficient: null,
                measurement_unit_id: null,
            }}
            mapEntityToForm={(x) => ({
                code: x.code,
                name: x.name,
                flower_yield_coefficient: x.flower_yield_coefficient,
                measurement_unit_id: x.measurement_unit?.id ?? null,
            })}
            create={(payload) => createTanningStage(payload as ITanningStagePayload)}
            update={(id, payload) => updateTanningStage({id, payload: payload as ITanningStagePayload})}
            remove={(id) => deleteTanningStage(id)}
            isSaving={isPosting || isPutting}
            isDeleting={isDeleting}
            onClearSelection={() => setUIState({selectedTanningStageId: null})}
            validateBeforeSave={(v) => !!v.name && !!v.code && !!v.measurement_unit_id}
            renderFields={() => (
                <>
                    <Box sx={{display: 'flex', gap: 1}}>
                        <TextFieldControlled<ITanningStageForm>
                            name={"code"}
                            label={t("leathers.status.code")}
                            required
                        />
                        <TextFieldControlled<ITanningStageForm>
                            name={"name"}
                            label={t("leathers.status.name")}
                            required
                        />
                    </Box>
                    <SelectFieldControlled<ITanningStageForm>
                        name={"measurement_unit_id"}
                        label={t("leathers.status.measurement-unit")}
                        options={measurementUnits?.map(x => ({
                            label: `${x.prefix} - ${x.name}`,
                            value: x.id,
                        })) || []}
                        required
                    />
                    <Box sx={{display: 'flex', gap: 1}}>
                        <NumberFieldControlled<ITanningStageForm>
                            name={"flower_yield_coefficient"}
                            label={t("leathers.status.flower-yield-coefficient")}
                            step={0.01}
                        />
                    </Box>
                </>
            )}
        />
    )
}

export default TanningStagesForm;