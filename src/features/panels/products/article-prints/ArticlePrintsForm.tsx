import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import type {
    IArticlePrintsStoreState
} from "@features/panels/products/article-prints/ArticlePrintsPanel";
import {articlePrintApi} from "@features/panels/products/article-prints/api/articlePrintApi";
import GenericForm from "@features/panels/shared/GenericForm";
import type {IArticlePrint} from "@features/panels/products/article-prints/api/IArticlePrint";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled";
import type {ICustomPanelFormProps} from "@ui/panel/store/ICustomPanelPropst";
import {usePanelFormButtons} from "@features/panels/shared/hooks/usePanelFormButtons";
import {usePanelFormLogic} from "@ui/panel/usePanelFormLogin";

export type IArticlePrintForm = {
    name: string;
}

const ArticlePrintsForm = ({initialName, onSuccess}: ICustomPanelFormProps) => {
    const {useStore} = usePanel<unknown, IArticlePrintsStoreState>();
    const selectedId = useStore(state => state.uiState.selectedPrintId);
    const setUIState = useStore(state => state.setUIState);

    const {setFormState} = usePanelFormButtons();
    const {handlePanelSuccess} = usePanelFormLogic({
        initialName,
        selectedId: selectedId,
        onSuccess,
        setFormState
    });

    const {useGetDetail, usePost, usePut, useDelete} = articlePrintApi;
    const {data: articlePrintEntity} = useGetDetail(selectedId);
    const {mutateAsync: createArticlePrint, isPending: isPosting} = usePost();
    const {mutateAsync: updateArticlePrint, isPending: isPutting} = usePut();
    const {mutateAsync: deleteArticlePrint, isPending: isDeleting} = useDelete();

    return (
        <GenericForm<IArticlePrintForm, IArticlePrint, IArticlePrintsStoreState>
            onSuccess={handlePanelSuccess}
            resource="articoli - stampe"
            selectedId={selectedId}
            entity={articlePrintEntity}
            emptyValues={{
                name: initialName ?? '',
            }}
            mapEntityToForm={(p) => ({
                name: p.name,
            })}
            create={(payload) => createArticlePrint(payload)}
            update={(id, payload) => updateArticlePrint({id, payload})}
            remove={(id) => deleteArticlePrint(id)}
            isSaving={isPosting || isPutting}
            isDeleting={isDeleting}
            onClearSelection={() => setUIState({selectedPrintId: null})}
            validateBeforeSave={(v) => !!v.name}
            renderFields={() => <ArticlePrintsFormFields />}
        />
    );
};

const ArticlePrintsFormFields = () => {
    const {t} = useTranslation(["form"]);

    return (
        <TextFieldControlled<IArticlePrintForm>
            name="name"
            label={t("products.article_prints.name")}
            required
        />
    );
}

export default ArticlePrintsForm;
