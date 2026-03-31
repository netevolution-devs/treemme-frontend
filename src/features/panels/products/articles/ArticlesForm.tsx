import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IArticlesStoreState} from "@features/panels/products/articles/ArticlesPanel.tsx";
import {articleApi} from "@features/panels/products/articles/api/articleApi.ts";
import GenericForm from "@features/panels/shared/GenericForm.tsx";
import type {IArticle} from "@features/panels/products/articles/api/IArticle.ts";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled.tsx";
import SelectFieldControlled from "@ui/form/controlled/SelectFieldController.tsx";
import FlagCheckBoxFieldControlled from "@ui/form/controlled/FlagCheckBoxFieldControlled.tsx";
import {contactsApi} from "@features/panels/contacts/contacts/api/contactsApi.ts";
import {articleTypeApi} from "@features/panels/products/article-types/api/articleTypeApi.ts";
import {thicknessApi} from "@features/panels/leathers/thicknesses/api/thicknessApi.ts";
import {articlePrintApi} from "@features/panels/products/articles/api/article-print/articlePrintApi.ts";
import {useMemo} from "react";
import {Box} from "@mui/material";
import TextFieldValue from "@ui/form/controlled/TextFieldValue.tsx";
import useCallablePanel from "@ui/panel/useCallablePanel.ts";
import useSubscribePanel from "@ui/panel/useSubscribePanel.ts";
import {useWatch} from "react-hook-form";
import {colorApi} from "@features/panels/products/article-colors/api/colorApi.ts";

export type IArticleForm = {
    code: string;
    full_grain: boolean;
    client_id: number | null;
    article_type_id: number | null;
    article_variation: string;
    article_color_id: number | null;
    thickness_id: number | null;
    print_id: number | null;
    note: string;
}

const ArticlesForm = () => {
    const {useStore} = usePanel<unknown, IArticlesStoreState>();
    const selectedArticledId = useStore(state => state.uiState.selectedArticledId);
    const setUIState = useStore(state => state.setUIState);

    const {useGetDetail, usePost, usePut, useDelete} = articleApi;
    const {data: article} = useGetDetail(selectedArticledId);
    const {mutateAsync: createArticle, isPending: isPosting} = usePost();
    const {mutateAsync: updateArticle, isPending: isPutting} = usePut();
    const {mutateAsync: deleteArticle, isPending: isDeleting} = useDelete();

    const {data: contacts = []} = contactsApi.useGetList();
    const {data: articleTypes = []} = articleTypeApi.useGetList();
    const {data: thicknesses = []} = thicknessApi.useGetList();
    const {data: prints = []} = articlePrintApi.useGetList();

    const clientOptions = useMemo(() =>
            contacts.filter(c => c.client).map(c => ({value: c.id, label: c.name})),
        [contacts]);

    const articleTypeOptions = useMemo(() =>
            articleTypes.map(at => ({value: at.id, label: at.name})),
        [articleTypes]);

    const thicknessOptions = useMemo(() =>
            thicknesses.map(th => ({value: th.id, label: th.name})),
        [thicknesses]);

    const printOptions = useMemo(() =>
            prints.map(p => ({value: p.id, label: p.name})),
        [prints]);

    return (
        <GenericForm<IArticleForm, IArticle, IArticlesStoreState>
            selectedId={selectedArticledId}
            entity={article}
            emptyValues={{
                code: '',
                full_grain: false,
                client_id: null,
                article_type_id: null,
                article_variation: '',
                article_color_id: null,
                thickness_id: null,
                print_id: null,
                note: ''
            }}
            mapEntityToForm={(a) => ({
                code: a.code,
                full_grain: a.full_grain,
                client_id: a.client?.id ?? null,
                article_type_id: a.article_type?.id ?? null,
                article_variation: a.article_variation ?? '',
                article_color_id: a.color?.id ?? null,
                thickness_id: a.thickness?.id ?? null,
                print_id: a.print?.id ?? null,
                note: a.note ?? ''
            })}
            create={(payload) => createArticle(payload)}
            update={(id, payload) => updateArticle({id, payload})}
            remove={(id) => deleteArticle(id)}
            isSaving={isPosting || isPutting}
            isDeleting={isDeleting}
            onClearSelection={() => setUIState({selectedArticledId: null})}
            validateBeforeSave={(v) => !!v.code && !!v.client_id && !!v.article_type_id && !!v.article_variation && !!v.article_color_id}
            renderFields={() => <ArticlesFormFields 
                article={article as IArticle}
                selectedArticledId={selectedArticledId as number}
                clientOptions={clientOptions}
                articleTypeOptions={articleTypeOptions}
                thicknessOptions={thicknessOptions}
                printOptions={printOptions}
            />}
        />
    );
};

interface ArticlesFormFieldsProps {
    article: IArticle;
    selectedArticledId: number | null;
    clientOptions: { value: number; label: string }[];
    articleTypeOptions: { value: number; label: string }[];
    thicknessOptions: { value: number; label: string }[];
    printOptions: { value: number; label: string }[];
}

const ArticlesFormFields = ({
    article,
    selectedArticledId,
    clientOptions,
    articleTypeOptions,
    thicknessOptions,
    printOptions,
}: ArticlesFormFieldsProps) => {
    const {t} = useTranslation(["form"]);

    const clientId = useWatch<IArticleForm>({name: "client_id"});
    const {data: colors = []} = colorApi.useGetList({
        queryParams: {client_id: clientId as number},
        staleTime: 0
    });

    const colorOptions = useMemo(() =>
            colors.map(c => ({value: c.id, label: `${c.color} - ${c.client_color}`})),
        [colors]);

    const {add: addSelectPanel} = useCallablePanel();

    useSubscribePanel<IArticleForm>({
        formKey: 'article_type_id',
        dependencyKey: 'articleTypes'
    });
    useSubscribePanel<IArticleForm>({
        formKey: "client_id",
        dependencyKey: "contacts"
    });
    useSubscribePanel<IArticleForm>({
        formKey: "article_color_id",
        dependencyKey: "articleColors"
    });

    return (
        <>
            <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                <TextFieldControlled<IArticleForm>
                    name="code"
                    label={t("products.articles.code")}
                    required
                />
                <TextFieldValue
                    label={t("products.articles.name")}
                    value={article?.name}
                    isFilled={!!selectedArticledId}
                />
                <FlagCheckBoxFieldControlled<IArticleForm>
                    name="full_grain"
                    label={t("products.articles.full_grain")}
                />
            </Box>
            <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                <SelectFieldControlled<IArticleForm>
                    name="client_id"
                    label={t("products.articles.client")}
                    options={clientOptions}
                    required
                    onNoOptionsMatch={(input) => {
                        addSelectPanel({
                            extra: {
                                client: true
                            },
                            initialValue: input,
                            menu: {
                                component: "contacts",
                                i18nKey: "menu.contacts.contacts"
                            }
                        })
                    }}
                />
                <SelectFieldControlled<IArticleForm>
                    name="article_type_id"
                    label={t("products.articles.article_type")}
                    options={articleTypeOptions}
                    required
                    onNoOptionsMatch={(input) => addSelectPanel({
                        initialValue: input,
                        menu: {
                            component: "articleTypes",
                            i18nKey: "products.articles.article_type"
                        }
                    })}
                />
            </Box>
            <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                <TextFieldControlled<IArticleForm>
                    name="article_variation"
                    label={t("products.articles.article_variation")}
                    required
                />
                <SelectFieldControlled<IArticleForm>
                    name="article_color_id"
                    label={t("products.articles.color")}
                    options={colorOptions}
                    required
                    deactivated={!clientId}
                    onNoOptionsMatch={(input) => {
                        addSelectPanel({
                            extra: {
                                client_id: clientId,
                            },
                            initialValue: input,
                            menu: {
                                component: "articleColors",
                                i18nKey: "menu.products.article-colors"
                            }
                        })
                    }}
                />
            </Box>
            <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                <SelectFieldControlled<IArticleForm>
                    name="thickness_id"
                    label={t("products.articles.thickness")}
                    options={thicknessOptions}
                    required
                />
                <SelectFieldControlled<IArticleForm>
                    name="print_id"
                    label={t("products.articles.print")}
                    options={printOptions}
                />
            </Box>
            <TextFieldControlled<IArticleForm>
                name="note"
                label={t("products.articles.note")}
                TextFieldProps={{
                    multiline: true,
                    rows: 4
                }}
            />
        </>
    );
}

export default ArticlesForm;
