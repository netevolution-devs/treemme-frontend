import {useMemo} from "react";
import {useTranslation} from "react-i18next";
import {nationsApi} from "@features/panels/contacts/nations/api/nationsApi";
import {usePanel} from "@ui/panel/PanelContext";
import type {INationsStoreState} from "@features/panels/contacts/nations/NationsPanel";
import type {INation} from "@features/panels/contacts/nations/api/INation";
import type {MRT_ColumnDef} from "material-react-table";
import GenericList from "@features/panels/shared/GenericList";

const NationsList = () => {
    const {t} = useTranslation(["form"]);
    const {data: nations = [], isLoading, isFetching} = nationsApi.useGetList();

    const {useStore} = usePanel<unknown, INationsStoreState>();
    const selectedNationId = useStore(state => state.uiState.selectedNationId);
    const setUIState = useStore(state => state.setUIState);

    const columns = useMemo<MRT_ColumnDef<INation>[]>(() => [
        {
            accessorKey: "name",
            header: t("nations.name")
        },
    ], [t]);

    return (
        <GenericList<INation>
            data={nations}
            isLoading={isLoading}
            isFetching={isFetching}
            columns={columns}
            selectedId={selectedNationId}
            onRowSelect={(id) => setUIState({selectedNationId: id as number})}
        />
    );
};

export default NationsList;