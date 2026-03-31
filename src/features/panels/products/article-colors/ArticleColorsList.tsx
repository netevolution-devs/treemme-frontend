import {useMemo} from "react";
import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import {colorApi} from "@features/panels/products/article-colors/api/colorApi.ts";
import type {MRT_ColumnDef} from "material-react-table";
import type {IArticleColorsStoreState} from "@features/panels/products/article-colors/ArticleColorsPanel.tsx";
import type {IColor} from "@features/panels/products/article-colors/api/IColor.ts";
import GenericList from "@features/panels/shared/GenericList.tsx";

const ArticleColorsList = () => {
    const {t} = useTranslation(["form"]);
    const {data: colors = [], isLoading, isFetching} = colorApi.useGetList();

    const {useStore} = usePanel<unknown, IArticleColorsStoreState>();
    const {selectedColorId} = useStore(state => state.uiState);
    const setUIState = useStore(state => state.setUIState);

    const columns = useMemo<MRT_ColumnDef<IColor>[]>(
        () => [
            {
                accessorKey: "color",
                header: t("products.article_colors.color"),
            },
            {
                accessorKey: "shade",
                header: t("products.article_colors.shade"),
            },
            {
                accessorKey: "var_color",
                header: t("products.article_colors.var_color"),
            },
            {
                accessorKey: "client_color",
                header: t("products.article_colors.client_color"),
            },
            {
                accessorKey: "client.name",
                header: t("products.article_colors.client"),
            }
        ],
        [t]
    );

    return (
        <GenericList<IColor>
            data={colors}
            isLoading={isLoading}
            isFetching={isFetching}
            columns={columns}
            selectedId={selectedColorId}
            onRowSelect={(id) => setUIState({selectedColorId: id})}
        />
    );
};

export default ArticleColorsList;
