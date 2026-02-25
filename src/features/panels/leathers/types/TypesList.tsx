import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {ITypesStoreState} from "@features/panels/leathers/types/TypesPanel.tsx";
import {leatherTypeApi} from "@features/panels/leathers/types/api/leatherTypeApi.ts";
import {useMemo} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import type {ILeatherType} from "@features/panels/leathers/types/api/ILeatherType.ts";
import GenericList from "@features/panels/shared/GenericList.tsx";
import {useSafeArray} from "@helpers/useSafeArray.ts";

const TypesList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, ITypesStoreState>();
    const selectedTypeId = useStore(state => state.uiState.selectedTypeId);
    const setUIState = useStore(state => state.setUIState);

    const {data: types, isLoading} = leatherTypeApi.useGetList();
    const typeList = useSafeArray(types)

    const columns = useMemo<MRT_ColumnDef<ILeatherType>[]>(() => [
        {
            accessorKey: "code",
            header: t("leathers.type.code"),
            size: 0
        },
        {
            accessorKey: "name",
            header: t("leathers.type.name")
        }
    ], [t]);

    return (
        <GenericList<ILeatherType>
            data={typeList}
            isLoading={isLoading}
            columns={columns}
            selectedId={selectedTypeId}
            onRowSelect={(id) => setUIState({ selectedTypeId: id })}
        />
    );
};

export default TypesList;