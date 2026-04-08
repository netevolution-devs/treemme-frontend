import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import type {IArticleClassesStoreState} from "@features/panels/products/article-classes/ArticleClassesPanel";
import {articleClassApi} from "@features/panels/products/article-classes/api/articleClassApi";
import GenericForm from "@features/panels/shared/GenericForm";
import type {IArticleClass} from "@features/panels/products/article-classes/api/IArticleClass";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled";
import type {ICustomPanelFormProps} from "@ui/panel/store/ICustomPanelPropst";
import {usePanelFormButtons} from "@features/panels/shared/hooks/usePanelFormButtons";
import {usePanelFormLogic} from "@ui/panel/usePanelFormLogin";

export type IArticleClassForm = {
    name: string;
    description: string;
}

const ArticleClassesForm = ({initialName, onSuccess}: ICustomPanelFormProps) => {
    const {useStore} = usePanel<unknown, IArticleClassesStoreState>();
    const selectedArticleClassId = useStore(state => state.uiState.selectedArticleClassId);
    const setUIState = useStore(state => state.setUIState);

    const {setFormState} = usePanelFormButtons();
    const {handlePanelSuccess} = usePanelFormLogic({
        initialName,
        selectedId: selectedArticleClassId,
        onSuccess,
        setFormState
    });

    const {useGetDetail, usePost, usePut, useDelete} = articleClassApi;
    const {data: articleClass} = useGetDetail(selectedArticleClassId);
    const {mutateAsync: createArticleClass, isPending: isPosting} = usePost();
    const {mutateAsync: updateArticleClass, isPending: isPutting} = usePut();
    const {mutateAsync: deleteArticleClass, isPending: isDeleting} = useDelete();

    return (
        <GenericForm<IArticleClassForm, IArticleClass, IArticleClassesStoreState>
            onSuccess={handlePanelSuccess}
            selectedId={selectedArticleClassId}
            entity={articleClass}
            emptyValues={{
                name: initialName ?? '',
                description: '',
            }}
            mapEntityToForm={(c) => ({
                name: c.name,
                description: c.description ?? '',
            })}
            create={(payload) => createArticleClass(payload)}
            update={(id, payload) => updateArticleClass({id, payload})}
            remove={(id) => deleteArticleClass(id)}
            isSaving={isPosting || isPutting}
            isDeleting={isDeleting}
            onClearSelection={() => setUIState({selectedArticleClassId: null})}
            validateBeforeSave={(v) => !!v.name}
            renderFields={() => <ArticleClassesFormFields />}
        />
    );
};

const ArticleClassesFormFields = () => {
    const {t} = useTranslation(["form"]);

    return (
        <>
            <TextFieldControlled<IArticleClassForm>
                name="name"
                label={t("products.article_classes.name")}
                required
            />
            <TextFieldControlled<IArticleClassForm>
                name="description"
                label={t("products.article_classes.description")}
                TextFieldProps={{
                    multiline: true,
                    rows: 2
                }}
            />
        </>
    );
}

export default ArticleClassesForm;