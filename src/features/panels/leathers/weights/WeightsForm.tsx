import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IWeightsStoreState} from "@features/panels/leathers/weights/WeightsPanel.tsx";
import {type IWeightPayload, weightApi} from "@features/panels/leathers/weights/api/weightApi.ts";
import type {IWeight} from "@features/panels/leathers/weights/api/IWeight.ts";
import GenericForm from "@features/panels/shared/GenericForm.tsx";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled.tsx";
import NumberFieldControlled from "@ui/form/controlled/NumberFieldControlled.tsx";
import {Box} from "@mui/material";
import type {ICustomPanelFormProps} from "@ui/panel/store/ICustomPanelPropst.ts";
import {usePanelFormButtons} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import {usePanelFormLogic} from "@ui/panel/usePanelFormLogin.ts";

export type IWeightForm = Omit<IWeight, 'id' | 'kg_weight' | 'cost_stripped_crust_manual' | 'cost_stripped_crust_various' | 'kg_leather_expected' | 'sqft_leather_expected'> & {
    kg_weight?: number | null;
    cost_stripped_crust_manual?: number | null;
    cost_stripped_crust_various?: number | null;
    kg_leather_expected?: number | null;
    sqft_leather_expected?: number | null;
}

const WeightsForm = ({initialName, onSuccess}: ICustomPanelFormProps) => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IWeightsStoreState>();
    const selectedWeightId = useStore((state) => state.uiState.selectedWeightId);
    const setUIState = useStore((state) => state.setUIState);

    const {setFormState} = usePanelFormButtons();
    const {handlePanelSuccess} = usePanelFormLogic({
        initialName,
        selectedId: selectedWeightId,
        onSuccess,
        setFormState
    });

    const {useGetDetail, usePost, usePut, useDelete} = weightApi;
    const {data: weight} = useGetDetail(selectedWeightId);
    const {mutateAsync: createWeight, isPending: isPosting} = usePost();
    const {mutateAsync: updateWeight, isPending: isPutting} = usePut();
    const {mutateAsync: deleteWeight, isPending: isDeleting} = useDelete();

    return (
        <GenericForm<IWeightForm, IWeight, IWeightsStoreState>
            onSuccess={handlePanelSuccess}
            selectedId={selectedWeightId}
            entity={weight}
            emptyValues={{
                name: initialName ?? '',
                kg_weight: null,
                cost_stripped_crust_manual: null,
                cost_stripped_crust_various: null,
                kg_leather_expected: null,
                sqft_leather_expected: null
            }}
            mapEntityToForm={(x) => ({
                name: x.name,
                kg_weight: x.kg_weight,
                cost_stripped_crust_manual: x.cost_stripped_crust_manual,
                cost_stripped_crust_various: x.cost_stripped_crust_various,
                kg_leather_expected: x.kg_leather_expected,
                sqft_leather_expected: x.sqft_leather_expected
            })}
            create={(payload) => createWeight(payload as IWeightPayload)}
            update={(id, payload) => updateWeight({id, payload: payload as IWeightPayload})}
            remove={(id) => deleteWeight(id)}
            isSaving={isPosting || isPutting}
            isDeleting={isDeleting}
            onClearSelection={() => setUIState({selectedWeightId: null})}
            validateBeforeSave={(v) => !!v.name && !!v.kg_weight}
            renderFields={() => (
                <>
                    <Box sx={{display: 'flex', gap: 1}}>
                        <TextFieldControlled<IWeightForm>
                            name={"name"}
                            label={t("leathers.weight.name")}
                            required
                        />
                        <NumberFieldControlled<IWeightForm>
                            name={"kg_weight"}
                            label={t("leathers.weight.kg-weight")}
                            required
                        />
                    </Box>
                    <Box sx={{display: 'flex', gap: 1}}>
                        <NumberFieldControlled<IWeightForm>
                            name={"sqft_leather_expected"}
                            label={t("leathers.weight.sqft-leather-expected")}
                        />
                        <NumberFieldControlled<IWeightForm>
                            name={"kg_leather_expected"}
                            label={t("leathers.weight.kg-leather-expected")}
                        />
                    </Box>
                    <Box sx={{display: 'flex', gap: 1}}>
                        <NumberFieldControlled<IWeightForm>
                            name={"cost_stripped_crust_various"}
                            label={t("leathers.weight.cost-stripped-crust-various")}
                        />
                        <NumberFieldControlled<IWeightForm>
                            name={"cost_stripped_crust_manual"}
                            label={t("leathers.weight.cost-stripped-crust-manual")}
                        />
                    </Box>
                </>
            )}
        />
    )
}

export default WeightsForm;