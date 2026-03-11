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

export type IArticleForm = {
    code: string;
    full_grain: boolean;
    client_id: number;
    article_type_id: number;
    article_variation: string;
    thickness_id: number;
    print_id: number;
    note: string;
}

const ArticlesForm = () => {
    const {t} = useTranslation(["form"]);

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
                client_id: 0,
                article_type_id: 0,
                article_variation: '',
                thickness_id: 0,
                print_id: 0,
                note: ''
            }}
            mapEntityToForm={(a) => ({
                code: a.code,
                full_grain: a.full_grain,
                client_id: a.client?.id ?? 0,
                article_type_id: a.article_type?.id ?? 0,
                article_variation: a.article_variation ?? '',
                thickness_id: a.thickness?.id ?? 0,
                print_id: a.print?.id ?? 0,
                note: a.note ?? ''
            })}
            create={(payload) => createArticle(payload)}
            update={(id, payload) => updateArticle({id, payload})}
            remove={(id) => deleteArticle(id)}
            isSaving={isPosting || isPutting}
            isDeleting={isDeleting}
            onClearSelection={() => setUIState({selectedArticledId: null})}
            validateBeforeSave={(v) => !!v.code && v.client_id > 0 && v.article_type_id > 0}
            renderFields={() => (
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
                        />
                        <SelectFieldControlled<IArticleForm>
                            name="article_type_id"
                            label={t("products.articles.article_type")}
                            options={articleTypeOptions}
                            required
                        />
                    </Box>
                    <TextFieldControlled<IArticleForm>
                        name="article_variation"
                        label={t("products.articles.article_variation")}
                    />
                    <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                        <SelectFieldControlled<IArticleForm>
                            name="thickness_id"
                            label={t("products.articles.thickness")}
                            options={thicknessOptions}
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
            )}
        />
    );
};

export default ArticlesForm;
