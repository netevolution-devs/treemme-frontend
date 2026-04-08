import {useMemo} from "react";
import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import type {MRT_ColumnDef} from "material-react-table";
import GenericList from "@features/panels/shared/GenericList";
import {internalColorApi} from "@features/panels/products/article-internal-colors/api/internalColorApi";
import type {IInternalColor} from "@features/panels/products/article-internal-colors/api/IInternalColor";
import type {
    IArticleInternalColorsStoreFilter,
    IArticleInternalColorsStoreState
} from "@features/panels/products/article-internal-colors/ArticleInternalColorsPanel";

const ArticleInternalColorsList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<IArticleInternalColorsStoreFilter, IArticleInternalColorsStoreState>();
    const selectedId = useStore(state => state.uiState.selectedId);
    const setUIState = useStore(state => state.setUIState);

    const {data: colors = [], isLoading, isFetching} = internalColorApi.useGetList();

    const columns = useMemo<MRT_ColumnDef<IInternalColor>[]>(
        () => [
            {
                accessorKey: "name",
                header: t("products.article_internal_colors.name"),
            }
        ],
        [t]
    );

    return (
        <GenericList<IInternalColor>
            data={colors}
            isLoading={isLoading}
            isFetching={isFetching}
            columns={columns}
            selectedId={selectedId}
            onRowSelect={(id) => setUIState({selectedId: id})}
        />
    );
};

export default ArticleInternalColorsList;