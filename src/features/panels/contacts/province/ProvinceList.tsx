import {useMemo} from "react";
import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import {provinceApi} from "@features/panels/contacts/province/api/proviceApi.ts";
import type {MRT_ColumnDef} from "material-react-table";
import type {IProvinceStoreState} from "@features/panels/contacts/province/ProvincePanel.tsx";
import type {IProvince} from "@features/panels/contacts/province/api/IProvince.ts";
import GenericList from "@features/panels/shared/GenericList.tsx";

const ProvinceList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IProvinceStoreState>();
    const selectedProvinceId = useStore(state => state.uiState.selectedProvinceId);
    const setUIState = useStore(state => state.setUIState);

    const {data: provinces = [], isLoading, isFetching} = provinceApi.useGetList();
    const sortedProvinces = useMemo(() => provinces.sort((a, b) => a.acronym.localeCompare(b.acronym)), [provinces]);

    const columns = useMemo<MRT_ColumnDef<IProvince>[]>(() => [
        {
            accessorKey: "acronym",
            header: t("province.acronym")
        },
        {
            accessorKey: "name",
            header: t("province.name")
        }
    ], [t]);

    return (
        <GenericList<IProvince>
            data={sortedProvinces}
            isLoading={isLoading}
            isFetching={isFetching}
            columns={columns}
            selectedId={selectedProvinceId}
            onRowSelect={(id) => setUIState({selectedProvinceId: id})}
        />
    );
};

export default ProvinceList;