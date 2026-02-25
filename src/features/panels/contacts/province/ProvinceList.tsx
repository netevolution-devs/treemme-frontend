import {useMemo} from "react";
import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import {provinceApi} from "@features/panels/contacts/province/api/proviceApi.ts";
import type {MRT_ColumnDef} from "material-react-table";
import type {IProvinceStoreState} from "@features/panels/contacts/province/ProvincePanel.tsx";
import type {IProvince} from "@features/panels/contacts/province/api/IProvince.ts";
import GenericList from "@features/panels/shared/GenericList.tsx";
import {useSafeArray} from "@helpers/useSafeArray.ts";

const ProvinceList = () => {
    const {t} = useTranslation(["form"]);
    const {data: provinces, isLoading} = provinceApi.useGetList();
    const provinceList = useSafeArray(provinces)

    const {useStore} = usePanel<unknown, IProvinceStoreState>();
    const selectedProvinceId = useStore(state => state.uiState.selectedProvinceId);
    const setUIState = useStore(state => state.setUIState);

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
            data={provinceList}
            isLoading={isLoading}
            columns={columns}
            selectedId={selectedProvinceId}
            onRowSelect={(id) => setUIState({selectedProvinceId: id})}
        />
    );
};

export default ProvinceList;