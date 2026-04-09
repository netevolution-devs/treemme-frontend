import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import type {ISelectionStoreState} from "@features/panels/products/selection/SelectionPanel";
import {selectionApi} from "@features/panels/products/selection/api/selectionApi";
import GenericForm from "@features/panels/shared/GenericForm";
import type {ISelection} from "@features/panels/products/selection/api/ISelection";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled";
import type {ICustomPanelFormProps} from "@ui/panel/store/ICustomPanelPropst";
import {usePanelFormButtons} from "@features/panels/shared/hooks/usePanelFormButtons";
import {usePanelFormLogic} from "@ui/panel/usePanelFormLogin";

export type ISelectionForm = Omit<ISelection, 'id'>;

const SelectionForm = ({initialName, onSuccess}: ICustomPanelFormProps) => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, ISelectionStoreState>();
    const selectedSelectionId = useStore(state => state.uiState.selectedSelectionId);
    const setUIState = useStore(state => state.setUIState);

    const {setFormState} = usePanelFormButtons();
    const {handlePanelSuccess} = usePanelFormLogic({
        initialName,
        selectedId: selectedSelectionId,
        onSuccess,
        setFormState
    });

    const {useGetDetail, usePost, usePut, useDelete} = selectionApi;
    const {data: selection} = useGetDetail(selectedSelectionId);
    const {mutateAsync: createSelection, isPending: isPosting} = usePost();
    const {mutateAsync: updateSelection, isPending: isPutting} = usePut();
    const {mutateAsync: deleteSelection, isPending: isDeleting} = useDelete();

    return (
        <GenericForm<ISelectionForm, ISelection, ISelectionStoreState>
            resource="articoli - scelte"
            onSuccess={handlePanelSuccess}
            selectedId={selectedSelectionId}
            entity={selection}
            emptyValues={{
                name: initialName ?? '',
                // value: 1
            }}
            mapEntityToForm={(s) => ({
                name: s.name,
                // value: s.value
            })}
            create={(payload) => createSelection(payload)}
            update={(id, payload) => updateSelection({id, payload})}
            remove={(id) => deleteSelection(id)}
            isSaving={isPosting || isPutting}
            isDeleting={isDeleting}
            onClearSelection={() => setUIState({selectedSelectionId: null})}
            validateBeforeSave={(v) => !!v.name}
            renderFields={() => (
                <>
                    <TextFieldControlled<ISelectionForm>
                        name="name"
                        label={t("products.articles.selection.name")}
                        required
                    />
                    {/*<NumberFieldControlled<ISelectionForm>*/}
                    {/*    name={"value"}*/}
                    {/*    label={t("products.articles.selection.value")}*/}
                    {/*/>*/}
                </>
            )}
        />
    );
};

export default SelectionForm;
