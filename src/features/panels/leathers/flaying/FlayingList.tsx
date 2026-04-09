import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import type {IFlayingStoreState} from "@features/panels/leathers/flaying/FlayingPanel";
import {flayApi} from "@features/panels/leathers/flaying/api/flayApi";
import {useMemo} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import type {IFlay} from "@features/panels/leathers/flaying/api/IFlay";
import GenericList from "@features/panels/shared/GenericList";

const FlayingList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IFlayingStoreState>();
    const selectedFlayId = useStore(state => state.uiState.selectedFlayId);
    const setUIState = useStore(state => state.setUIState);

    const {data: flays = [], isLoading, isFetching} = flayApi.useGetList();

    const columns = useMemo<MRT_ColumnDef<IFlay>[]>(() => [
        {
            accessorKey: "code",
            header: t("leathers.flay.code"),
            size: 0
        },
        {
            accessorKey: "name",
            header: t("leathers.flay.name"),
        }
    ], [t]);

    return (
        <GenericList<IFlay>
            data={flays}
            isLoading={isLoading}
            isFetching={isFetching}
            columns={columns}
            selectedId={selectedFlayId}
            onRowSelect={(id) => setUIState({selectedFlayId: id})}
        />
    )
}

export default FlayingList;