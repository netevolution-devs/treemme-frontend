import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import type {IArticleTypesStoreState} from "@features/panels/products/article-types/ArticleTypesPanel";
import {articleTypeApi} from "@features/panels/products/article-types/api/articleTypeApi";
import GenericForm from "@features/panels/shared/GenericForm";
import type {IArticleType} from "@features/panels/products/article-types/api/IArticleType";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled";
import SelectFieldControlled from "@ui/form/controlled/SelectFieldController";
import {leatherTypeApi} from "@features/panels/leathers/types/api/leatherTypeApi";
import {articleClassApi} from "@features/panels/products/article-classes/api/articleClassApi";
import {useMemo} from "react";
import {usePanelFormButtons} from "@features/panels/shared/hooks/usePanelFormButtons";
import {usePanelFormLogic} from "@ui/panel/usePanelFormLogin";
import type {ICustomPanelFormProps} from "@ui/panel/store/ICustomPanelPropst";
import useCallablePanel from "@ui/panel/useCallablePanel";
import useSubscribePanel from "@ui/panel/useSubscribePanel";

export type IArticleTypeForm = Omit<IArticleType, 'id' | 'article_class' | 'leather_type'> & {
    leather_type_id?: number | null;
    article_class_id?: number | null;
}

const ArticleTypesForm = ({initialName, onSuccess}: ICustomPanelFormProps) => {
    const {useStore} = usePanel<unknown, IArticleTypesStoreState>();
    const selectedArticleTypeId = useStore(state => state.uiState.selectedArticleTypeId);
    const setUIState = useStore(state => state.setUIState);

    const {setFormState} = usePanelFormButtons();
    const {handlePanelSuccess} = usePanelFormLogic({
        initialName,
        selectedId: selectedArticleTypeId,
        onSuccess,
        setFormState
    });

    const {useGetDetail, usePost, usePut, useDelete} = articleTypeApi;
    const {data: articleType} = useGetDetail(selectedArticleTypeId);
    const {mutateAsync: createArticleType, isPending: isPosting} = usePost();
    const {mutateAsync: updateArticleType, isPending: isPutting} = usePut();
    const {mutateAsync: deleteArticleType, isPending: isDeleting} = useDelete();


    return (
        <GenericForm<IArticleTypeForm, IArticleType, IArticleTypesStoreState>
            resource="prodotti - tipologie articoli"
            selectedId={selectedArticleTypeId}
            entity={articleType}
            emptyValues={{
                name: initialName ?? '',
                leather_type_id: null,
                article_class_id: null
            }}
            mapEntityToForm={(at) => ({
                name: at.name,
                leather_type_id: at.leather_type?.id ?? null,
                article_class_id: at.article_class?.id ?? null
            })}
            create={(payload) => createArticleType(payload)}
            update={(id, payload) => updateArticleType({id, payload})}
            remove={(id) => deleteArticleType(id)}
            isSaving={isPosting || isPutting}
            isDeleting={isDeleting}
            onClearSelection={() => setUIState({selectedArticleTypeId: null})}
            onSuccess={handlePanelSuccess}
            validateBeforeSave={(v) => !!v.name && !!v.leather_type_id && !!v.article_class_id}
            renderFields={() => (
                <ArticleTypesFields/>
            )}
        />
    );
};

const ArticleTypesFields = () => {
    const {t} = useTranslation(["form"]);

    const {data: leatherTypes = []} = leatherTypeApi.useGetList();
    const {data: articleClasses = []} = articleClassApi.useGetList();

    const leatherTypeOptions = useMemo(() =>
            leatherTypes.map(lt => ({value: lt.id, label: lt.name})),
        [leatherTypes]);

    const articleClassOptions = useMemo(() =>
            articleClasses.map(ac => ({value: ac.id, label: ac.name})),
        [articleClasses]);

    const {add: addSelectPanel} = useCallablePanel();

    useSubscribePanel<IArticleTypeForm>({
        formKey: "leather_type_id",
        dependencyKey: "types"
    })

    useSubscribePanel<IArticleTypeForm>({
        formKey: "article_class_id",
        dependencyKey: "articleClasses"
    })

    return (
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
                onNoOptionsMatch={(input) => {
                    addSelectPanel({
                        initialValue: input,
                        menu: {
                            component: "types",
                            i18nKey: "menu.leathers.types"
                        }
                    })
                }}
            />
            <SelectFieldControlled<IArticleTypeForm>
                name="article_class_id"
                label={t("products.articles.article_class")}
                options={articleClassOptions}
                required
                onNoOptionsMatch={(input) => {
                    addSelectPanel({
                        initialValue: input,
                        menu: {
                            component: "articleClasses",
                            i18nKey: "menu.products.article-classes"
                        }
                    })
                }}
            />
        </>
    )
}

export default ArticleTypesForm;
