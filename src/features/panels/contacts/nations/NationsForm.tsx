import {useTranslation} from "react-i18next";
import type {INation} from "@features/panels/contacts/nations/api/INation.ts";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {INationsStoreState} from "@features/panels/contacts/nations/NationsPanel.tsx";
import {nationsApi} from "@features/panels/contacts/nations/api/nationsApi.ts";
import GenericForm from "@features/panels/shared/GenericForm.tsx";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled.tsx";
import type {ICustomPanelFormProps} from "@ui/panel/store/ICustomPanelPropst.ts";
import {usePanelFormButtons} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import {usePanelFormLogic} from "@ui/panel/usePanelFormLogin.ts";

export type INationForm = Omit<INation, "id">;

const NationsForm = ({initialName, onSuccess}: ICustomPanelFormProps) => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, INationsStoreState>();
    const selectedNationId = useStore(state => state.uiState.selectedNationId);
    const setUIState = useStore(state => state.setUIState);

    const {setFormState} = usePanelFormButtons();
    const {handlePanelSuccess} = usePanelFormLogic({
        initialName,
        selectedId: selectedNationId,
        onSuccess,
        setFormState
    });

    const { useGetDetail, usePost, usePut, useDelete } = nationsApi;
    const {data: nation} = useGetDetail(selectedNationId);
    const {mutateAsync: createNation, isPending: isPosting} = usePost();
    const {mutateAsync: updateNation, isPending: isPutting} = usePut();
    const {mutateAsync: deleteNation, isPending: isDeleting} = useDelete();

    return (
        <GenericForm<INationForm, INation, INationsStoreState>
            resource="contatti - nazioni"
            onSuccess={handlePanelSuccess}
            selectedId={selectedNationId}
            entity={nation}
            emptyValues={{ name: initialName ?? '' }}
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