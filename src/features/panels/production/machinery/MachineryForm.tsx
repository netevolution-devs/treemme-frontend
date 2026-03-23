import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IMachineryStoreState} from "@features/panels/production/machinery/MachineryPanel.tsx";
import {machineApi} from "@features/panels/production/machinery/api/machineApi.ts";
import GenericForm from "@features/panels/shared/GenericForm.tsx";
import type {IMachine} from "@features/panels/production/machinery/api/IMachine.ts";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled.tsx";
import SelectFieldControlled from "@ui/form/controlled/SelectFieldController.tsx";
import {batchTypeApi} from "@features/panels/production/batches/api/batch-type/batchTypeApi.ts";
import {useMemo} from "react";

export interface IMachineryForm {
    name: string;
    prefix: string | null;
    batch_type_id: number | null;
}

const MachineryForm = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IMachineryStoreState>();
    const selectedMachineryId = useStore(state => state.uiState.selectedMachineryId);
    const setUIState = useStore(state => state.setUIState);

    const { useGetDetail, usePost, usePut, useDelete } = machineApi;
    const {data: machinery} = useGetDetail(selectedMachineryId);
    const {mutateAsync: createMachinery, isPending: isPosting} = usePost();
    const {mutateAsync: updateMachinery, isPending: isPutting} = usePut();
    const {mutateAsync: deleteMachinery, isPending: isDeleting} = useDelete();

    const {data: batchTypes = []} = batchTypeApi.useGetList();

    const batchTypeOptions = useMemo(() => 
        batchTypes.map(bt => ({ value: bt.id, label: bt.name })), 
    [batchTypes]);

    return (
        <GenericForm<IMachineryForm, IMachine, IMachineryStoreState>
            selectedId={selectedMachineryId}
            entity={machinery}
            emptyValues={{ name: '', prefix: '', batch_type_id: null }}
            mapEntityToForm={(m) => ({ 
                name: m.name, 
                prefix: m.prefix ?? '', 
                batch_type_id: m.batch_type?.id ?? null
            })}
            create={(payload) => createMachinery(payload)}
            update={(id, payload) => updateMachinery({ id, payload })}
            remove={(id) => deleteMachinery(id)}
            isSaving={isPosting || isPutting}
            isDeleting={isDeleting}
            onClearSelection={() => setUIState({ selectedMachineryId: null })}
            validateBeforeSave={(v) => !!v.name && !!v.batch_type_id}
            renderFields={() => (
                <>
                    <TextFieldControlled<IMachineryForm>
                        name="prefix"
                        label={t("production.machinery.prefix")}
                        required
                    />
                    <TextFieldControlled<IMachineryForm>
                        name="name"
                        label={t("production.machinery.name")}
                        required
                    />
                    <SelectFieldControlled<IMachineryForm>
                        name="batch_type_id"
                        label={t("production.machinery.batch_type")}
                        options={batchTypeOptions}
                    />
                </>
            )}
        />
    );
};

export default MachineryForm;
