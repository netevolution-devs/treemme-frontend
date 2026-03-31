import {useMemo} from "react";
import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import {articleTypeApi} from "@features/panels/products/article-types/api/articleTypeApi.ts";
import type {MRT_ColumnDef} from "material-react-table";
import type {IArticleTypesStoreState} from "@features/panels/products/article-types/ArticleTypesPanel.tsx";
import type {IArticleType} from "@features/panels/products/article-types/api/IArticleType.ts";
import GenericList from "@features/panels/shared/GenericList.tsx";

const ArticleTypesList = () => {
    const {t} = useTranslation(["form"]);
    const {data: articleTypes = [], isLoading, isFetching} = articleTypeApi.useGetList();

    const {useStore} = usePanel<unknown, IArticleTypesStoreState>();
    const selectedArticleTypeId = useStore(state => state.uiState.selectedArticleTypeId);
    const setUIState = useStore(state => state.setUIState);

    const columns = useMemo<MRT_ColumnDef<IArticleType>[]>(
        () => [
            {
                accessorKey: "name",
                header: t("products.types.name"),
            },
            {
                accessorKey: "leather_type.name",
                header: t("products.categories.leather_type"),
            },
            {
                accessorKey: "article_class.name",
                header: t("products.categories.class"),
            }
        ],
        [t]
    );

    return (
        <GenericList<IArticleType>
            data={articleTypes}
            isLoading={isLoading}
            isFetching={isFetching}
            columns={columns}
            selectedId={selectedArticleTypeId}
            onRowSelect={(id) => setUIState({selectedArticleTypeId: id})}
        />
    );
};

export default ArticleTypesList;
