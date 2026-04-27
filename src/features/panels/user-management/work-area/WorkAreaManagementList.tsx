import {useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {workAreaManagementApi} from "@features/panels/user-management/work-area/api/workAreaManagementApi";
import {usePanel} from "@ui/panel/PanelContext";
import type {IWorkAreaManagement} from "@features/panels/user-management/work-area/api/IWorkAreaManagement";
import type {MRT_ColumnDef} from "material-react-table";
import type {
    IFunctionalityManagementStoreState
} from "@features/panels/user-management/work-area/WorkAreaPanel";
import GenericList from "@features/panels/shared/GenericList";
import ListToolbar from "@features/panels/shared/ListToolbar";
import TextFieldFilter from "@ui/form/filters/TextFieldFilter";

const WorkAreaManagementList = () => {
    const {t} = useTranslation(["form"]);
    const {data: workAreas = [], isLoading} = workAreaManagementApi.useGetList();

    const {useStore} = usePanel<unknown, IFunctionalityManagementStoreState>();
    const selectedWorkAreaId = useStore(state => state.uiState.selectedWorkAreaId);
    const setUIState = useStore(state => state.setUIState);

    const columns = useMemo<MRT_ColumnDef<IWorkAreaManagement>[]>(() => [
        {
            accessorKey: "name",
            header: t("work_area_management.name"),
        },
        {
            accessorKey: "description",
            header: t("work_area_management.description"),
            Cell: ({cell}) => cell.getValue<string | null>() ?? "-",
        },
    ], [t]);

    const [filter, setFilter] = useState<string>("");

    const filteredWorkAreas = useMemo(() => {
        if (!filter || !filter.trim()) {
            return workAreas;
        }

        const lowerFilter = filter.toLowerCase();
        return workAreas.filter((wa) => {
            const name = wa?.name ?? "";
            const description = wa?.description ?? "";

            return (
                name.toLowerCase().includes(lowerFilter) ||
                description.toLowerCase().includes(lowerFilter)
            );
        });
    }, [workAreas, filter]);

    return (
        <GenericList<IWorkAreaManagement>
            data={filteredWorkAreas}
            isLoading={isLoading}
            columns={columns}
            selectedId={selectedWorkAreaId}
            onRowSelect={(id) => setUIState({selectedWorkAreaId: id as number})}
            additionalOptions={{
                enableTopToolbar: true,
                renderTopToolbar: () => (
                    <ListToolbar
                        filters={[
                            <TextFieldFilter
                                label={t("work_area_management.filter")}
                                value={filter}
                                onFilterChange={(value) => setFilter(value as string)}
                            />
                        ]}
                    />
                )
            }}
        />
    );
};

export default WorkAreaManagementList;
