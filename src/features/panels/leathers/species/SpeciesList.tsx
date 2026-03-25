import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {ISpeciesStoreState} from "@features/panels/leathers/species/SpeciesPanel.tsx";
import {speciesApi} from "@features/panels/leathers/species/api/speciesApi.ts";
import type {MRT_ColumnDef} from "material-react-table";
import {useMemo} from "react";
import type {ISpecies} from "@features/panels/leathers/species/api/ISpecies.ts";
import GenericList from "@features/panels/shared/GenericList.tsx";

const SpeciesList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, ISpeciesStoreState>();
    const selectedSpeciesId = useStore((state) => state.uiState.selectedSpeciesId);
    const setUIState = useStore((state) => state.setUIState);

    const {data: species = [], isLoading, isFetching} = speciesApi.useGetList();

    const columns = useMemo<MRT_ColumnDef<ISpecies>[]>(() => [
        {
            accessorKey: "code",
            header: t("leathers.species.code"),
            size: 0
        },
        {
            accessorKey: "name",
            header: t("leathers.species.name")
        }
    ], [t]);

    return (
        <GenericList<ISpecies>
            data={species}
            isLoading={isLoading}
            isFetching={isFetching}
            columns={columns}
            selectedId={selectedSpeciesId}
            onRowSelect={(id) => setUIState({selectedSpeciesId: id})}
        />
    );
};

export default SpeciesList;