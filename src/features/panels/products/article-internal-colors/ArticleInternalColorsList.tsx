import {useMemo} from "react";
import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import type {MRT_ColumnDef} from "material-react-table";
import GenericList from "@features/panels/shared/GenericList";
import ListToolbar from "@features/panels/shared/ListToolbar";
import {internalColorApi} from "@features/panels/products/article-internal-colors/api/internalColorApi";
import type {IInternalColor} from "@features/panels/products/article-internal-colors/api/IInternalColor";
import type {
    IArticleInternalColorsStoreState
} from "@features/panels/products/article-internal-colors/ArticleInternalColorsPanel";

const ArticleInternalColorsList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IArticleInternalColorsStoreState>();
    const selectedId = useStore(state => state.uiState.selectedInternalColorId);
    const setUIState = useStore(state => state.setUIState);

    const {data: colors = [], isLoading, isFetching} = internalColorApi.useGetList();
    const exportMutation = internalColorApi.useExport();

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
            onRowSelect={(id) => setUIState({selectedInternalColorId: id})}
            additionalOptions={{
                enableTopToolbar: true,
                renderTopToolbar: () => (
                    <ListToolbar
                        onExport={() => exportMutation.mutate()}
                        exportLoading={exportMutation.isPending}
                    />
                )
            }}
        />
    );
};

export default ArticleInternalColorsList;