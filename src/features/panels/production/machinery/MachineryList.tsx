import {useMemo} from "react";
import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import {machineApi} from "@features/panels/production/machinery/api/machineApi";
import type {MRT_ColumnDef} from "material-react-table";
import type {IMachineryStoreState} from "@features/panels/production/machinery/MachineryPanel";
import type {IMachine} from "@features/panels/production/machinery/api/IMachine";
import GenericList from "@features/panels/shared/GenericList";

const MachineryList = () => {
    const {t} = useTranslation(["form"]);
    const {data: machines = [], isLoading, isFetching} = machineApi.useGetList();

    const {useStore} = usePanel<unknown, IMachineryStoreState>();
    const {selectedMachineryId} = useStore(state => state.uiState);
    const setUIState = useStore(state => state.setUIState);

    const columns = useMemo<MRT_ColumnDef<IMachine>[]>(
        () => [
            {
                accessorKey: "prefix",
                header: t("production.machinery.prefix"),
            },
            {
                accessorKey: "name",
                header: t("production.machinery.name"),
            }
        ],
        [t]
    );

    return (
        <GenericList<IMachine>
            data={machines}
            isLoading={isLoading}
            isFetching={isFetching}
            columns={columns}
            selectedId={selectedMachineryId}
            onRowSelect={(id) => setUIState({selectedMachineryId: id})}
        />
    );
};

export default MachineryList;
