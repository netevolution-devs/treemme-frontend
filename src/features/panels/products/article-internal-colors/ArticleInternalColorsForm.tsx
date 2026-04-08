import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import type {
    IArticleInternalColorsStoreParams,
    IArticleInternalColorsStoreState
} from "@features/panels/products/article-internal-colors/ArticleInternalColorsPanel";
import {internalColorApi} from "@features/panels/products/article-internal-colors/api/internalColorApi";
import GenericForm from "@features/panels/shared/GenericForm";
import type {IInternalColor} from "@features/panels/products/article-internal-colors/api/IInternalColor";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled";
import type {ICustomPanelFormProps} from "@ui/panel/store/ICustomPanelPropst";
import {usePanelFormButtons} from "@features/panels/shared/hooks/usePanelFormButtons";
import {usePanelFormLogic} from "@ui/panel/usePanelFormLogin";

export type IInternalColorForm = {
    name: string;
}

const ArticleInternalColorsForm = ({initialName, onSuccess}: ICustomPanelFormProps<IArticleInternalColorsStoreParams>) => {
    const {useStore} = usePanel<unknown, IArticleInternalColorsStoreState>();
    const selectedId = useStore(state => state.uiState.selectedId);
    const setUIState = useStore(state => state.setUIState);

    const {setFormState} = usePanelFormButtons();
    const {handlePanelSuccess} = usePanelFormLogic({
        initialName,
        selectedId: selectedId,
        onSuccess,
        setFormState
    });

    const {useGetDetail, usePost, usePut, useDelete} = internalColorApi;
    const {data: internalColorEntity} = useGetDetail(selectedId);
    const {mutateAsync: createInternalColor, isPending: isPosting} = usePost();
    const {mutateAsync: updateInternalColor, isPending: isPutting} = usePut();
    const {mutateAsync: deleteInternalColor, isPending: isDeleting} = useDelete();

    return (
        <GenericForm<IInternalColorForm, IInternalColor, IArticleInternalColorsStoreState>
            onSuccess={handlePanelSuccess}
            resource="articoli - colori interni"
            selectedId={selectedId}
            entity={internalColorEntity}
            emptyValues={{
                name: initialName ?? '',
            }}
            mapEntityToForm={(c) => ({
                name: c.name,
            })}
            create={(payload) => createInternalColor(payload)}
            update={(id, payload) => updateInternalColor({id, payload})}
            remove={(id) => deleteInternalColor(id)}
            isSaving={isPosting || isPutting}
            isDeleting={isDeleting}
            onClearSelection={() => setUIState({selectedId: null})}
            validateBeforeSave={(v) => !!v.name}
            renderFields={() => <ArticleInternalColorsFormFields />}
        />
    );
};

const ArticleInternalColorsFormFields = () => {
    const {t} = useTranslation(["form"]);

    return (
        <TextFieldControlled<IInternalColorForm>
            name="name"
            label={t("products.article_internal_colors.name")}
            required
        />
    );
}

export default ArticleInternalColorsForm;