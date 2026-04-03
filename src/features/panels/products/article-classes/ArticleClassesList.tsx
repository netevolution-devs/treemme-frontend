import {useMemo} from "react";
import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import {articleClassApi} from "@features/panels/products/article-classes/api/articleClassApi.ts";
import type {MRT_ColumnDef} from "material-react-table";
import type {IArticleClassesStoreState} from "@features/panels/products/article-classes/ArticleClassesPanel.tsx";
import type {IArticleClass} from "@features/panels/products/article-classes/api/IArticleClass.ts";
import GenericList from "@features/panels/shared/GenericList.tsx";

const ArticleClassesList = () => {
    const {t} = useTranslation(["form"]);
    const {data: articleClasses = [], isLoading, isFetching} = articleClassApi.useGetList();

    const {useStore} = usePanel<unknown, IArticleClassesStoreState>();
    const selectedArticleClassId = useStore(state => state.uiState.selectedArticleClassId);
    const setUIState = useStore(state => state.setUIState);

    const columns = useMemo<MRT_ColumnDef<IArticleClass>[]>(
        () => [
            {
                accessorKey: "name",
                header: t("products.article_classes.name"),
            },
            {
                accessorKey: "description",
                header: t("products.article_classes.description"),
            }
        ],
        [t]
    );

    return (
        <GenericList<IArticleClass>
            data={articleClasses}
            isLoading={isLoading}
            isFetching={isFetching}
            columns={columns}
            selectedId={selectedArticleClassId}
            onRowSelect={(id) => setUIState({selectedArticleClassId: id as number})}
        />
    );
};

export default ArticleClassesList;