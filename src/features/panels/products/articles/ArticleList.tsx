import {useMemo} from "react";
import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import {articleApi} from "@features/panels/products/articles/api/articleApi.ts";
import type {MRT_ColumnDef} from "material-react-table";
import type {IArticlesStoreState} from "@features/panels/products/articles/ArticlesPanel.tsx";
import type {IArticle} from "@features/panels/products/articles/api/IArticle.ts";
import GenericList from "@features/panels/shared/GenericList.tsx";

const ArticleList = () => {
    const {t} = useTranslation(["form"]);
    const {data: articles = [], isLoading} = articleApi.useGetList();

    const {useStore} = usePanel<unknown, IArticlesStoreState>();
    const {selectedArticledId} = useStore(state => state.uiState);
    const setUIState = useStore(state => state.setUIState);

    const columns = useMemo<MRT_ColumnDef<IArticle>[]>(
        () => [
            {
                accessorKey: "code",
                header: t("products.articles.code"),
            },
            {
                accessorKey: "client.name",
                header: t("products.articles.client"),
            },
            {
                accessorKey: "article_type.name",
                header: t("products.articles.article_type"),
            },
            {
                accessorKey: "color",
                header: t("products.articles.color"),
            }
        ],
        [t]
    );

    return (
        <GenericList<IArticle>
            data={articles}
            isLoading={isLoading}
            columns={columns}
            selectedId={selectedArticledId}
            onRowSelect={(id) => setUIState({selectedArticledId: id})}
        />
    );
};

export default ArticleList;
