import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IArticleTypesStoreState} from "@features/panels/products/article-types/ArticleTypesPanel.tsx";
import {articleTypeApi} from "@features/panels/products/article-types/api/articleTypeApi.ts";
import GenericForm from "@features/panels/shared/GenericForm.tsx";
import type {IArticleType} from "@features/panels/products/article-types/api/IArticleType.ts";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled.tsx";
import SelectFieldControlled from "@ui/form/controlled/SelectFieldController.tsx";
import {leatherTypeApi} from "@features/panels/leathers/types/api/leatherTypeApi.ts";
import {articleClassApi} from "@features/panels/products/articles/api/article-class/articleClassApi.ts";
import {useMemo, useEffect, useCallback} from "react";
import {usePanelFormButtons} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import {useDockviewStore} from "@ui/panel/store/DockviewStore.ts";

export type IArticleTypeForm = Omit<IArticleType, 'id' | 'article_class' | 'leather_type'> & {
    leather_type_id: number;
    article_class_id: number;
}

interface ArticleTypesFormProps {
    initialName?: string;
    onSuccess?: (id: number) => void;
}

const ArticleTypesForm = ({initialName, onSuccess}: ArticleTypesFormProps) => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IArticleTypesStoreState>();
    const selectedArticleTypeId = useStore(state => state.uiState.selectedArticleTypeId);
    const setUIState = useStore(state => state.setUIState);
    const {setFormState} = usePanelFormButtons<unknown, IArticleTypesStoreState>();

    const api = useDockviewStore(state => state.api);

    const {useGetDetail, usePost, usePut, useDelete} = articleTypeApi;
    const {data: articleType} = useGetDetail(selectedArticleTypeId);
    const {mutateAsync: createArticleType, isPending: isPosting} = usePost();
    const {mutateAsync: updateArticleType, isPending: isPutting} = usePut();
    const {mutateAsync: deleteArticleType, isPending: isDeleting} = useDelete();

    const {data: leatherTypes = []} = leatherTypeApi.useGetList();
    const {data: articleClasses = []} = articleClassApi.useGetList();

    const leatherTypeOptions = useMemo(() =>
        leatherTypes.map(lt => ({value: lt.id, label: lt.name})),
    [leatherTypes]);

    const articleClassOptions = useMemo(() =>
        articleClasses.map(ac => ({value: ac.id, label: ac.name})),
    [articleClasses]);

    useEffect(() => {
        if (initialName && !selectedArticleTypeId) {
            setFormState('new');
        }
    }, [initialName, selectedArticleTypeId, setFormState]);

    const handleSuccess = useCallback((entity: IArticleType) => {
        onSuccess?.(entity.id);
        if (initialName) {
            const panels = api?.panels;
            if (panels) {
                const currentPanel = Object.values(panels).find(p => p.params?.initialName === initialName);
                currentPanel?.api.close();
            }
        }
    }, [onSuccess, initialName, api]);

    return (
        <GenericForm<IArticleTypeForm, IArticleType, IArticleTypesStoreState>
            selectedId={selectedArticleTypeId}
            entity={articleType}
            emptyValues={{
                name: initialName ?? '',
                leather_type_id: 0,
                article_class_id: 0
            }}
            mapEntityToForm={(at) => ({
                name: at.name,
                leather_type_id: at.leather_type?.id ?? 0,
                article_class_id: at.article_class?.id ?? 0
            })}
            create={(payload) => createArticleType(payload)}
            update={(id, payload) => updateArticleType({id, payload})}
            remove={(id) => deleteArticleType(id)}
            isSaving={isPosting || isPutting}
            isDeleting={isDeleting}
            onClearSelection={() => setUIState({selectedArticleTypeId: null})}
            onSuccess={handleSuccess}
            validateBeforeSave={(v) => !!v.name && v.leather_type_id > 0 && v.article_class_id > 0}
            renderFields={() => (
                <>
                    <TextFieldControlled<IArticleTypeForm>
                        name="name"
                        label={t("products.types.name")}
                        required
                    />
                    <SelectFieldControlled<IArticleTypeForm>
                        name="leather_type_id"
                        label={t("products.articles.leather_type")}
                        options={leatherTypeOptions}
                        required
                    />
                    <SelectFieldControlled<IArticleTypeForm>
                        name="article_class_id"
                        label={t("products.articles.article_class")}
                        options={articleClassOptions}
                        required
                    />
                </>
            )}
        />
    );
};

export default ArticleTypesForm;
