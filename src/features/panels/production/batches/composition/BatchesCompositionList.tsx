import GenericList from "@features/panels/shared/GenericList";
import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import type {IBatchesStoreState} from "@features/panels/production/batches/BatchesPanel";
import {batchApi} from "@features/panels/production/batches/api/batchApi";
import ListToolbar from "@features/panels/shared/ListToolbar";
import CustomButton from "@features/panels/shared/CustomButton";
import {openDialog} from "@ui/dialog/dialogHelper";
import BatchCompositionFormDialog from "@features/panels/production/batches/composition/BatchCompositionFormDialog";
import {useMemo, useRef} from "react";
import type {IDialogActions} from "@ui/dialog/IDialogActions";
import type {MRT_ColumnDef} from "material-react-table";
import type {
    IBatchCompositionResponse
} from "@features/panels/production/batches/composition/api/IBatchComposition";
import {Typography} from "@mui/material";
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import dayjs from "dayjs";

interface ICompositionDialogProps {
    customBatchId?: number;
    enableToolbar?: boolean;
}

const BatchesCompositionList = ({customBatchId, enableToolbar = true}: ICompositionDialogProps) => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IBatchesStoreState>();
    const selectedBatchId = useStore(state => state.uiState.selectedBatchId) || customBatchId;

    const {data: batch, isLoading, isFetching} = batchApi.useGetDetail(selectedBatchId as number);
    const compositions = batch?.batch_compositions ?? [];

    const canComposition = batch?.batch_type.name === "Tintura" || batch?.batch_type.name === "Rifinizione";

    const isTForUF = batch?.batch_type.name === "Tintura" || batch?.batch_type.name === "Rifinizione";

    const columns = useMemo<MRT_ColumnDef<IBatchCompositionResponse>[]>(() => [
        {
            accessorKey: "date",
            header: isTForUF ? t("composition.date-tf") : t("composition.date"),
            Cell: ({row}) => dayjs(row.original.date).format("DD/MM/YYYY")
        },
        {
            accessorKey: "father_batch.batch_code",
            header: t("composition.father_batch_code"),
        },
        {
            accessorKey: "father_batch_piece",
            header: t("composition.father_batch_piece"),
        },
        {
            accessorKey: "father_batch_quantity",
            header: t("composition.father_batch_quantity"),
        },
        {
            accessorKey: "composition_note",
            header: t("composition.composition_note"),
        }
    ], [t, isTForUF]);

    const compositionDialogRef = useRef<IDialogActions | null>(null);

    return (
        <>
            <BatchCompositionFormDialog ref={compositionDialogRef} />

            <GenericList<IBatchCompositionResponse>
                disableBorder
                minHeight={"265px"}
                columns={columns}
                data={compositions}
                isLoading={isLoading}
                isFetching={isFetching}
                additionalOptions={{
                    enableTopToolbar: enableToolbar,
                    renderTopToolbar: () => <ListToolbar
                        label={<Typography variant="h6" sx={{mb: enableToolbar ? 0 : 1, textWrap: 'nowrap'}}>{t("composition.title")}</Typography>}
                        buttons={[
                            <CustomButton
                                color={"primary"}
                                icon={<AddToPhotosIcon/>}
                                label={t("composition.button")}
                                onClick={() => openDialog(compositionDialogRef)}
                                isEnable={!!selectedBatchId && canComposition}
                            />,
                        ]}
                        sx={{mt: 0}}
                        alignButtons={'flex-end'}
                    />
                }}
            />
        </>
    )
};

export default BatchesCompositionList;