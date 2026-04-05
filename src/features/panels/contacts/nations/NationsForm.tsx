import {useTranslation} from "react-i18next";
import type {INation} from "@features/panels/contacts/nations/api/INation";
import {usePanel} from "@ui/panel/PanelContext";
import type {INationsStoreState} from "@features/panels/contacts/nations/NationsPanel";
import {nationsApi} from "@features/panels/contacts/nations/api/nationsApi";
import GenericForm from "@features/panels/shared/GenericForm";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled";
import type {ICustomPanelFormProps} from "@ui/panel/store/ICustomPanelPropst";
import {usePanelFormButtons} from "@features/panels/shared/hooks/usePanelFormButtons";
import {usePanelFormLogic} from "@ui/panel/usePanelFormLogin";

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