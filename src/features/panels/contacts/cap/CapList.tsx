import {useMemo} from "react";
import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import {capApi} from "@features/panels/contacts/cap/api/capApi";
import type {MRT_ColumnDef} from "material-react-table";
import type {ICapStoreState} from "@features/panels/contacts/cap/CapPanel";
import type {ICap} from "@features/panels/contacts/cap/api/ICap";
import GenericList from "@features/panels/shared/GenericList";

const CapList = () => {
    const {t} = useTranslation(["form"]);
    const {data: caps = [], isLoading, isFetching} = capApi.useGetList();

    const {useStore} = usePanel<unknown, ICapStoreState>();
    const {selectedCapId} = useStore(state => state.uiState);
    const setUIState = useStore(state => state.setUIState);

    const columns = useMemo<MRT_ColumnDef<ICap>[]>(
        () => [
            {
                accessorKey: "cap",
                header: t("cap.code"),
            },
            {
                accessorKey: "name",
                header: t("cap.name"),
            },
            {
                accessorKey: "province.name",
                header: t("province.name"),
            }
        ],
        [t]
    );

    return (
        <GenericList<ICap>
            data={caps}
            isLoading={isLoading}
            isFetching={isFetching}
            columns={columns}
            selectedId={selectedCapId}
            onRowSelect={(id) => setUIState({selectedCapId: id})}
        />
    );
};

export default CapList;