import type {IOrigin} from "@features/panels/leathers/origins/api/IOrigin";
import GenericList from "@features/panels/shared/GenericList";
import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import type {IOriginsStoreState} from "@features/panels/leathers/origins/OriginsPanel";
import {originApi} from "@features/panels/leathers/origins/api/originApi";
import type {MRT_ColumnDef} from "material-react-table";
import {useMemo} from "react";

const OriginsList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IOriginsStoreState>();
    const selectedOriginId = useStore(state => state.uiState.selectedOriginId);
    const setUIState = useStore(state => state.setUIState);

    const {data: origins = [], isLoading, isFetching} = originApi.useGetList();

    const columns = useMemo<MRT_ColumnDef<IOrigin>[]>(() => [
        {
            accessorKey: "code",
            header: t("leathers.origin.code"),
        },
        {
            accessorKey: "nation.name",
            header: t("nations.name"),
        },
        {
            accessorKey: "area.name",
            header: t("leathers.origin.area"),
        },
    ], [t]);

    return (
        <GenericList<IOrigin>
            data={origins}
            isLoading={isLoading}
            isFetching={isFetching}
            columns={columns}
            selectedId={selectedOriginId}
            onRowSelect={(id) => setUIState({selectedOriginId: id})}
        />
    )
}

export default OriginsList;