import {useTranslation} from "react-i18next";
import type {INation} from "@features/panels/contacts/nations/api/INation.ts";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {INationsStoreState} from "@features/panels/contacts/nations/NationsPanel.tsx";
import {nationsApi} from "@features/panels/contacts/nations/api/nationsApi.ts";
import GenericForm from "@features/panels/shared/GenericForm.tsx";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled.tsx";

export type INationForm = Omit<INation, "id">;

const NationsForm = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, INationsStoreState>();
    const selectedNationId = useStore(state => state.uiState.selectedNationId);
    const setUIState = useStore(state => state.setUIState);

    const { useGetDetail, usePost, usePut, useDelete } = nationsApi;
    const {data: nation} = useGetDetail(selectedNationId);
    const {mutateAsync: createNation, isPending: isPosting} = usePost();
    const {mutateAsync: updateNation, isPending: isPutting} = usePut();
    const {mutateAsync: deleteNation, isPending: isDeleting} = useDelete();

    return (
        <GenericForm<INationForm, INation, INationsStoreState>
            selectedId={selectedNationId}
            entity={nation}
            emptyValues={{ name: '' }}
            mapEntityToForm={(n) => ({ name: n.name })}
            create={(payload) => createNation(payload)}
            update={(id, payload) => updateNation({ id, payload })}
            remove={(id) => deleteNation(id)}
            isSaving={isPosting || isPutting}
            isDeleting={isDeleting}
            onClearSelection={() => setUIState({ selectedNationId: null })}
            validateBeforeSave={(v) => !!v.name}
            renderFields={() => (
                <TextFieldControlled<INationForm>
                    name="name"
                    label={t("nations.name")}
                    required
                />
            )}
        />
    );
};

export default NationsForm;