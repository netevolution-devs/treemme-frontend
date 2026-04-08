import {useMemo} from "react";
import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import {selectionApi} from "@features/panels/products/selection/api/selectionApi";
import type {MRT_ColumnDef} from "material-react-table";
import type {ISelectionStoreState} from "@features/panels/products/selection/SelectionPanel";
import type {ISelection} from "@features/panels/products/selection/api/ISelection";
import GenericList from "@features/panels/shared/GenericList";

const SelectionList = () => {
    const {t} = useTranslation(["form"]);
    const {data: selections = [], isLoading, isFetching} = selectionApi.useGetList();

    const {useStore} = usePanel<unknown, ISelectionStoreState>();
    const selectedSelectionId = useStore(state => state.uiState.selectedSelectionId);
    const setUIState = useStore(state => state.setUIState);

    const columns = useMemo<MRT_ColumnDef<ISelection>[]>(
        () => [
            {
                accessorKey: "name",
                header: t("products.articles.selection.name"),
            }
        ],
        [t]
    );

    return (
        <GenericList<ISelection>
            data={selections}
            isLoading={isLoading}
            isFetching={isFetching}
            columns={columns}
            selectedId={selectedSelectionId}
            onRowSelect={(id) => setUIState({selectedSelectionId: id})}
        />
    );
};

export default SelectionList;
