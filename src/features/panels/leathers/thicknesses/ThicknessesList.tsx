import {useTranslation} from "react-i18next";
import type {IThicknessesStoreState} from "@features/panels/leathers/thicknesses/ThicknessesPanel.tsx";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import {thicknessApi} from "@features/panels/leathers/thicknesses/api/thicknessApi.ts";
import {useMemo} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import type {IThickness} from "@features/panels/leathers/thicknesses/api/IThickness.ts";
import GenericList from "@features/panels/shared/GenericList.tsx";

const ThicknessesList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IThicknessesStoreState>();
    const selectedThicknessId = useStore(state => state.uiState.selectedThicknessId);
    const setUIState = useStore(state => state.setUIState);

    const {data: thicknesses = [], isLoading, isFetching} = thicknessApi.useGetList();

    const columns = useMemo<MRT_ColumnDef<IThickness>[]>(() => [
        {
            accessorKey: "name",
            header: t("leathers.thickness.name"),
            size: 0
        },
        {
            accessorKey: "thickness_mm",
            header: t("leathers.thickness.mm"),
            Cell: ({row}) => row.original.thickness_mm.toFixed(2)
        }
    ], [t]);

    return (
        <GenericList<IThickness>
            data={thicknesses}
            isLoading={isLoading}
            isFetching={isFetching}
            columns={columns}
            selectedId={selectedThicknessId}
            onRowSelect={(id) => setUIState({selectedThicknessId: id})}
        />
    )
}

export default ThicknessesList;