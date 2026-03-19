import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {ISelectionStoreState} from "@features/panels/products/selection/SelectionPanel.tsx";
import {selectionApi} from "@features/panels/products/selection/api/selectionApi.ts";
import GenericForm from "@features/panels/shared/GenericForm.tsx";
import type {ISelection} from "@features/panels/products/selection/api/ISelection.ts";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled.tsx";
import NumberFieldControlled from "@ui/form/controlled/NumberFieldControlled.tsx";

export type ISelectionForm = Omit<ISelection, 'id'>;

const SelectionForm = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, ISelectionStoreState>();
    const selectedSelectionId = useStore(state => state.uiState.selectedSelectionId);
    const setUIState = useStore(state => state.setUIState);

    const {useGetDetail, usePost, usePut, useDelete} = selectionApi;
    const {data: selection} = useGetDetail(selectedSelectionId);
    const {mutateAsync: createSelection, isPending: isPosting} = usePost();
    const {mutateAsync: updateSelection, isPending: isPutting} = usePut();
    const {mutateAsync: deleteSelection, isPending: isDeleting} = useDelete();

    return (
        <GenericForm<ISelectionForm, ISelection, ISelectionStoreState>
            selectedId={selectedSelectionId}
            entity={selection}
            emptyValues={{
                name: '',
                value: 1
            }}
            mapEntityToForm={(s) => ({
                name: s.name,
                value: s.value
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
                    <NumberFieldControlled<ISelectionForm>
                        name={"value"}
                        label={t("products.articles.selection.value")}
                    />
                </>
            )}
        />
    );
};

export default SelectionForm;
