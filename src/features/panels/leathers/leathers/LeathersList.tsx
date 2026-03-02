import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {ILeathersStoreState} from "@features/panels/leathers/leathers/LeathersPanel.tsx";
import {leatherApi} from "@features/panels/leathers/leathers/api/leatherApi.ts";
import {useMemo} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import type {ILeather} from "@features/panels/leathers/leathers/api/ILeather.ts";
import GenericList from "@features/panels/shared/GenericList.tsx";

const LeatherList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, ILeathersStoreState>();
    const selectedLeatherId = useStore(state => state.uiState.selectedLeatherId);
    const setUIState = useStore(state => state.setUIState);

    const {data: leathers = [], isLoading} = leatherApi.useGetList();

    const columns = useMemo<MRT_ColumnDef<ILeather>[]>(() => [
        {
            accessorKey: "code",
            header: t("leathers.leather.code"),
            size: 0
        },
        {
            accessorKey: "name",
            header: t("leathers.leather.name"),
        }
    ], [t])

    return (
        <GenericList<ILeather>
            data={leathers}
            isLoading={isLoading}
            columns={columns}
            selectedId={selectedLeatherId}
            onRowSelect={(id) => setUIState({selectedLeatherId: id})}
        />
    )
}

export default LeatherList;