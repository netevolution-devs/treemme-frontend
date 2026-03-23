import type {IOrigin} from "@features/panels/leathers/origins/api/IOrigin.ts";
import GenericList from "@features/panels/shared/GenericList.tsx";
import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IOriginsStoreState} from "@features/panels/leathers/origins/OriginsPanel.tsx";
import {originApi} from "@features/panels/leathers/origins/api/originApi.ts";
import type {MRT_ColumnDef} from "material-react-table";
import {useMemo} from "react";

const OriginsList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IOriginsStoreState>();
    const selectedOriginId = useStore(state => state.uiState.selectedOriginId);
    const setUIState = useStore(state => state.setUIState);

    const {data: origins = [], isLoading} = originApi.useGetList();

    const columns = useMemo<MRT_ColumnDef<IOrigin>[]>(() => [
        {
            accessorKey: "code",
            header: t("leathers.origin.code"),
            size: 0
        },
        {
            accessorKey: "nation.name",
            header: t("nations.name"),
        },
    ], [t]);

    return (
        <GenericList<IOrigin>
            data={origins}
            isLoading={isLoading}
            columns={columns}
            selectedId={selectedOriginId}
            onRowSelect={(id) => setUIState({selectedOriginId: id})}
        />
    )
}

export default OriginsList;