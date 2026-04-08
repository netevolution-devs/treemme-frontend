import {useMemo} from "react";
import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import type {MRT_ColumnDef} from "material-react-table";
import GenericList from "@features/panels/shared/GenericList";
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
        />
    );
};

export default ArticlePrintsList;
