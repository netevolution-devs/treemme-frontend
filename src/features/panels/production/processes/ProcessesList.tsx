import {processApi} from "@features/panels/production/processes/api/processApi.ts";
import {useTranslation} from "react-i18next";
import type {MRT_ColumnDef} from "material-react-table";
import {useEffect, useMemo} from "react";
import type {IProcess} from "@features/panels/production/processes/api/IProcess.ts";
import GenericList from "@features/panels/shared/GenericList.tsx";
import dayjs from "dayjs";
import ListToolbar from "@features/panels/shared/ListToolbar.tsx";
import DateFieldFilter from "@ui/form/filters/DateFieldFilter.tsx";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IProcessesStoreState, IProcessStoreFilter} from "@features/panels/production/processes/ProcessesPanel.tsx";
import {cleanFilters} from "@ui/form/filters/useCleanFilters.ts";
import {MenuItem} from "@mui/material";
import CustomButton from "@features/panels/shared/CustomButton.tsx";
import VisibilityIcon from '@mui/icons-material/Visibility';
import {useDockviewStore} from "@ui/panel/store/DockviewStore.ts";

const ProcessesList = () => {
    const {t} = useTranslation(["form", "menu"]);
    const {useStore} = usePanel<IProcessStoreFilter, IProcessesStoreState>();
    const addPanel = useDockviewStore(state => state.addPanel);

    const selectedProcessId = useStore(state => state.uiState.selectedProcessId);
    const setUIState = useStore(state => state.setUIState);
    const setFilters = useStore(state => state.setFilters);
    const filterScheduledDate = useStore(state => state.filters.filterScheduledDate);

    const setTodayDate = () => setFilters({filterScheduledDate: dayjs(Date()).format("YYYY-MM-DD")});

    useEffect(() => {
        setTodayDate();
    }, []);

    const queryParams = useMemo(() => cleanFilters(
            {
                scheduled_date: filterScheduledDate,
            }
        ),
        [filterScheduledDate],
    );

    const {data: processes = [], isLoading, isFetching} = processApi.useGetList({queryParams});

    const columns = useMemo<MRT_ColumnDef<IProcess>[]>(() => [
        {
            accessorKey: "scheduled_date",
            header: t("processes.scheduled_date"),
            Cell: ({row}) => (
                dayjs(row.original.scheduled_date).format("DD/MM/YYYY")
            )
        },
        {
            accessorKey: "batch.batch_code",
            header: t("processes.batch_code")
        },
        {
            accessorKey: "machine.name",
            header: t("processes.machine_name")
        },
        {
            accessorKey: "batch.pieces",
            header: t("processes.batch_pieces")
        },
        {
            accessorKey: "batch.quantity",
            header: t("processes.batch_quantity")
        },
        {
            accessorKey: "production_note",
            header: t("processes.production_note")
        }
    ], [t]);

    return (
        <GenericList<IProcess>
            data={processes}
            isLoading={isLoading}
            isFetching={isFetching}
            columns={columns}
            minHeight={"700px"}
            selectedId={selectedProcessId}
            onRowSelect={(id) => setUIState({selectedProcessId: id})}
            additionalOptions={{
                enableRowActions: true,
                renderRowActionMenuItems: ({row, closeMenu}) => [
                    <MenuItem key={"view_batch"} onClick={() => {
                        addPanel({
                            id: `batches:${crypto.randomUUID()}`,
                            title: t("menu:menu.production.batches"),
                            component: 'batches',
                            params: {
                                extra: {
                                    id: row.original.batch.id,
                                    batch_code: row.original.batch.batch_code
                                }
                            }
                        });
                        closeMenu();
                    }}>
                        <VisibilityIcon color={"primary"} sx={{mr: 1}} />
                        {t("processes.view_batch")}
                    </MenuItem>
                ],
                enableTopToolbar: true,
                renderTopToolbar: () => (
                    <ListToolbar
                        filters={[
                            <DateFieldFilter
                                key={"f-date_filter"}
                                label={t("processes.scheduled_date")}
                                value={filterScheduledDate}
                                onFilterChange={(val) => setFilters({filterScheduledDate: val as string})}
                            />,
                            <CustomButton
                                label={t("processes.today")}
                                color={"primary"}
                                icon={""}
                                onClick={() => setTodayDate()}
                            />
                        ]}
                    />
                )
            }}
        />
    )
}

export default ProcessesList;