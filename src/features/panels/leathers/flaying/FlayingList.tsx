import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IFlayingStoreState} from "@features/panels/leathers/flaying/FlayingPanel.tsx";
import {flayApi} from "@features/panels/leathers/flaying/api/flayApi.ts";
import {useMemo} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import type {IFlay} from "@features/panels/leathers/flaying/api/IFlay.ts";
import GenericList from "@features/panels/shared/GenericList.tsx";

const FlayingList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IFlayingStoreState>();
    const selectedFlayId = useStore(state => state.uiState.selectedFlayId);
    const setUIState = useStore(state => state.setUIState);

    const {data: flays = [], isLoading} = flayApi.useGetList();

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
            columns={columns}
            selectedId={selectedFlayId}
            onRowSelect={(id) => setUIState({selectedFlayId: id})}
        />
    )
}

export default FlayingList;