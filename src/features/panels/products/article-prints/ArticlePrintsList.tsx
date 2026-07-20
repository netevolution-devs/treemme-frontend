import {useMemo} from "react";
import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import type {MRT_ColumnDef} from "material-react-table";
import GenericList from "@features/panels/shared/GenericList";
import ListToolbar from "@features/panels/shared/ListToolbar";
import {articlePrintApi} from "@features/panels/products/article-prints/api/articlePrintApi";
import type {IArticlePrint} from "@features/panels/products/article-prints/api/IArticlePrint";
import type {
    IArticlePrintsStoreState
} from "@features/panels/products/article-prints/ArticlePrintsPanel";

const ArticlePrintsList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IArticlePrintsStoreState>();
    const selectedId = useStore(state => state.uiState.selectedPrintId);
    const setUIState = useStore(state => state.setUIState);

    const {data: prints = [], isLoading, isFetching} = articlePrintApi.useGetList();
    const exportMutation = articlePrintApi.useExport();

    const columns = useMemo<MRT_ColumnDef<IArticlePrint>[]>(
        () => [
            {
                accessorKey: "name",
                header: t("products.article_prints.name"),
            }
        ],
        [t]
    );

    return (
        <GenericList<IArticlePrint>
            data={prints}
            isLoading={isLoading}
            isFetching={isFetching}
            columns={columns}
            selectedId={selectedId}
            onRowSelect={(id) => setUIState({selectedPrintId: id})}
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

export default ArticlePrintsList;
