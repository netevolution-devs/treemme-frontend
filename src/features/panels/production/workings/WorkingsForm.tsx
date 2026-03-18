import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IWorkingsStoreState} from "@features/panels/production/workings/WorkingsPanel.tsx";
import {workingApi} from "@features/panels/production/workings/api/workingApi.ts";
import GenericForm from "@features/panels/shared/GenericForm.tsx";
import type {IWorking} from "@features/panels/production/workings/api/IWorking.ts";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled.tsx";
import FlagCheckBoxFieldControlled from "@ui/form/controlled/FlagCheckBoxFieldControlled.tsx";
import {Box} from "@mui/material";

export interface IWorkingForm {
    name: string;
    external: boolean;
    color_recipe: boolean;
    final_check: boolean;
    processing_recipe: boolean;
}

const WorkingsForm = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IWorkingsStoreState>();
    const selectedWorkingId = useStore(state => state.uiState.selectedWorkingId);
    const setUIState = useStore(state => state.setUIState);

    const { useGetDetail, usePost, usePut, useDelete } = workingApi;
    const {data: working} = useGetDetail(selectedWorkingId);
    const {mutateAsync: createWorking, isPending: isPosting} = usePost();
    const {mutateAsync: updateWorking, isPending: isPutting} = usePut();
    const {mutateAsync: deleteWorking, isPending: isDeleting} = useDelete();

    return (
        <GenericForm<IWorkingForm, IWorking, IWorkingsStoreState>
            selectedId={selectedWorkingId}
            entity={working}
            emptyValues={{
                name: '',
                external: false,
                color_recipe: false,
                final_check: false,
                processing_recipe: false
            }}
            mapEntityToForm={(w) => ({
                name: w.name,
                external: w.external,
                color_recipe: w.color_recipe,
                final_check: w.final_check,
                processing_recipe: w.processing_recipe
            })}
            create={(payload) => createWorking(payload)}
            update={(id, payload) => updateWorking({ id, payload })}
            remove={(id) => deleteWorking(id)}
            isSaving={isPosting || isPutting}
            isDeleting={isDeleting}
            onClearSelection={() => setUIState({ selectedWorkingId: null })}
            validateBeforeSave={(v) => !!v.name}
            renderFields={() => (
                <>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <FlagCheckBoxFieldControlled<IWorkingForm>
                            name="external"
                            label={t("production.working.external")}
                        />
                        <FlagCheckBoxFieldControlled<IWorkingForm>
                            name="color_recipe"
                            label={t("production.working.color_recipe")}
                        />
                        <FlagCheckBoxFieldControlled<IWorkingForm>
                            name="final_check"
                            label={t("production.working.final_check")}
                        />
                        <FlagCheckBoxFieldControlled<IWorkingForm>
                            name="processing_recipe"
                            label={t("production.working.processing_recipe")}
                        />
                    </Box>
                    <TextFieldControlled<IWorkingForm>
                        name="name"
                        label={t("production.working.name")}
                        required
                    />
                </>
            )}
        />
    );
};

export default WorkingsForm;