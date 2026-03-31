import {useMemo} from "react";
import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import {colorApi} from "@features/panels/products/article-colors/api/colorApi.ts";
import type {MRT_ColumnDef} from "material-react-table";
import type {
    IArticleColorsStoreFilter,
    IArticleColorsStoreState
} from "@features/panels/products/article-colors/ArticleColorsPanel.tsx";
import type {IColor} from "@features/panels/products/article-colors/api/IColor.ts";
import GenericList from "@features/panels/shared/GenericList.tsx";
import {cleanFilters} from "@ui/form/filters/useCleanFilters.ts";
import ListToolbar from "@features/panels/shared/ListToolbar.tsx";
import SelectFieldFilter from "@ui/form/filters/SelectFieldFilter.tsx";
import {contactsApi} from "@features/panels/contacts/contacts/api/contactsApi.ts";

const ArticleColorsList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<IArticleColorsStoreFilter, IArticleColorsStoreState>();
    const selectedColorId = useStore(state => state.uiState.selectedColorId);
    const setUIState = useStore(state => state.setUIState);

    const filterClientId = useStore(state => state.filters.filterClientId);
    const setFilters = useStore(state => state.setFilters);

    const queryParams = useMemo(() => cleanFilters(
            {
                client: filterClientId,
            }
        ),
        [filterClientId]
    );

    const {data: clients = []} = contactsApi.useGetList({queryParams: {type: "client"}});
    const {data: colors = [], isLoading, isFetching} = colorApi.useGetList({queryParams});

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
            additionalOptions={{
                enableTopToolbar: true,
                renderTopToolbar: () => (
                    <ListToolbar
                        filters={[
                            <SelectFieldFilter
                                key={"f-client"}
                                label={t("products.article_colors.client")}
                                value={filterClientId}
                                options={clients.map(s => ({value: s.id, label: s.name}))}
                                onFilterChange={(value) => setFilters({filterClientId: value as number})}
                            />,
                        ]}
                    />
                )
            }}
        />
    );
};

export default ArticleColorsList;
