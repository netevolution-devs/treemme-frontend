import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import type {ISeaportsStoreState} from "@features/panels/contacts/seaports/SeaportsPanel";
import {seaPortApi} from "@features/panels/contacts/seaports/api/seaPortApi";
import type {MRT_ColumnDef} from "material-react-table";
import {useMemo} from "react";
import type {ISeaPort} from "@features/panels/contacts/seaports/api/ISeaPort";
import GenericList from "@features/panels/shared/GenericList";

const SeaPortsList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, ISeaportsStoreState>();
    const selectedSeaPortId = useStore(state => state.uiState.selectedSeaPortId);
    const setUIState = useStore(state => state.setUIState);

    const {data: seaPorts = [], isLoading, isFetching} = seaPortApi.useGetList();

    const columns = useMemo<MRT_ColumnDef<ISeaPort>[]>(() => [
        {
            accessorKey: "name",
            header: t("contacts.seaports.name")
        }
    ], [t]);

    return (
        <GenericList<ISeaPort>
            data={seaPorts}
            isLoading={isLoading}
            isFetching={isFetching}
            columns={columns}
            selectedId={selectedSeaPortId}
            onRowSelect={(id) => setUIState({selectedSeaPortId: id})}
        />
    )
}

export default SeaPortsList;