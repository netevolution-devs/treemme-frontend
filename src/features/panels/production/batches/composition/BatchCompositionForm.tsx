import {usePanel} from "@ui/panel/PanelContext";
import {useTranslation} from "react-i18next";
import GenericForm from "@features/panels/shared/GenericForm";
import NumberFieldControlled from "@ui/form/controlled/NumberFieldControlled";
import SelectFieldControlled from "@ui/form/controlled/SelectFieldController";
import {Box} from "@mui/material";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled";
import {useWatch} from "react-hook-form";
import dayjs from "dayjs";
import DateFieldControlled from "@ui/form/controlled/DateFieldControlled";
import CustomButton from "@features/panels/shared/CustomButton";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";
import type {ICustomPanelFormProps} from "@ui/panel/store/ICustomPanelPropst";
import {usePanelFormButtons} from "@features/panels/shared/hooks/usePanelFormButtons";
import {usePanelFormLogic} from "@ui/panel/usePanelFormLogin";
import {useEffect} from "react";
import type {
    IBatchCompositionStoreParams,
    IBatchCompositionStoreState
} from "@features/panels/production/batches/composition/BatchCompositionPanel";
import {batchCompositionApi} from "@features/panels/production/batches/composition/api/batchCompositionApi";
import useGetBatchSplitAvailability from "@features/panels/production/batches/composition/api/useGetBatchSplitAvailability";
import type {
    IBatchComposition,
} from "@features/panels/production/batches/composition/api/IBatchComposition";

export interface IBatchCompositionForm {
    father_batch_piece: number | null;
    father_batch_id: number | null;
    batch_selection_id: number | null;
    composition_note?: string;
    date?: string;
    batch_id: number | null;
}

const BatchCompositionForm = ({
                                   initialName,
                                   onSuccess,
                                   extra
                               }: ICustomPanelFormProps<IBatchCompositionStoreParams>) => {
    const {t} = useTranslation(["form", "common"]);

    const batchId = extra?.batch_id ?? 0;
    const batchCompositionId = extra?.batch_composition_id ?? 0;
    const floatingPanelUUID = extra?.panelId as string;

    const {useStore} = usePanel<unknown, IBatchCompositionStoreState>();
    const selectedStoreId = useStore(state => state.uiState.selectedBatchCompositionId);
    const selectedBatchCompositionId = batchCompositionId || selectedStoreId;

    const {setFormState} = usePanelFormButtons();
    const {handlePanelSuccess} = usePanelFormLogic({
        initialName,
        selectedId: selectedBatchCompositionId,
        onSuccess,
        setFormState
    });

    const {useGetDetail, usePost, usePut, useDelete} = batchCompositionApi;
    const {data: batchCompositionDetail} = useGetDetail(selectedBatchCompositionId);

    const {mutateAsync: createComposition, isPending: isPosting} = usePost({
        invalidateQueries: ['BATCH', 'LIST', 'DETAIL', String(batchId)]
    });

    const {mutateAsync: updateComposition, isPending: isPutting} = usePut({
        invalidateQueries: ['BATCH', 'LIST', 'DETAIL', String(batchId)]
    });

    const {mutateAsync: deleteComposition, isPending: isDeleting} = useDelete({
        invalidateQueries: ['BATCH', 'LIST', 'DETAIL', String(batchId)]
    });

    useEffect(() => {
        if (floatingPanelUUID?.includes("create")) {
            setFormState("new");
        }
    }, [floatingPanelUUID, setFormState]);

    return (
        <GenericForm<IBatchCompositionForm, IBatchComposition, IBatchCompositionStoreState>
            onSuccess={handlePanelSuccess}
            resource="produzione - lotti"
            selectedId={selectedBatchCompositionId}
            floatingPanelUUID={floatingPanelUUID}
            disabledBasicButtons
            disableCreateButton
            bypassConfirm
            entity={batchCompositionDetail}
            emptyValues={{
                father_batch_piece: null,
                father_batch_id: null,
                batch_selection_id: null,
                composition_note: '',
                date: dayjs().format('YYYY-MM-DD'),
                batch_id: batchId
            }}
            mapEntityToForm={(entity) => ({
                father_batch_piece: entity.father_batch_piece,
                father_batch_id: entity.father_batch?.id || null,
                batch_selection_id: null,
                composition_note: entity.composition_note,
                date: entity.date,
                batch_id: batchId
            })}
            create={(data) => createComposition({
                batch_id: batchId,
                batch_selection_id: data.batch_selection_id as number,
                date: data.date as string,
                composition_note: data.composition_note as string,
                father_batch_piece: data.father_batch_piece as number
            })}
            update={(data) => updateComposition({
                id: selectedBatchCompositionId as number,
                payload: {
                    batch_id: batchId,
                    batch_selection_id: data.batch_selection_id as number,
                    date: data.date as string,
                    composition_note: data.composition_note as string,
                    father_batch_piece: data.father_batch_piece as number
                }
            })}
            delete={() => deleteComposition(selectedBatchCompositionId as number)}
            isSaving={isPosting || isPutting}
            isDeleting={isDeleting}
            validateBeforeSave={(v) =>
                !!v.father_batch_piece &&
                !!v.batch_selection_id
            }
            extraButtons={[
                <CustomButton
                    key="execute-btn"
                    label={t("common:button.execute")}
                    color={"primary"}
                    icon={<AddToPhotosIcon/>}
                    isSubmit
                />
            ]}
            renderFields={() => (
                <BatchCompositionFormFields/>
            )}
        />
    );
};

const BatchCompositionFormFields = () => {
    const {t} = useTranslation(["form"]);

    const {data: batches = []} = useGetBatchSplitAvailability();

    const watchedFatherBatchId = useWatch<IBatchCompositionForm>({name: "father_batch_id"});
    const watchedSelectionId = useWatch<IBatchCompositionForm>({name: "batch_selection_id"});
    const batchSelections = batches.find(b => b.id === watchedFatherBatchId)?.batch_selections || [];

    return (
        <Box sx={{mb: 1}}>
            <pre>{JSON.stringify(batchSelections, null, 2)}</pre>
            <Box sx={{mb: 1.2}}>
                <DateFieldControlled<IBatchCompositionForm>
                    name={"date"}
                    label={t("production.date")}
                />
            </Box>
            <SelectFieldControlled<IBatchCompositionForm>
                name="father_batch_id"
                label={t("production.batch.father_batch")}
                options={batches.map(b => ({
                    value: b.id,
                    label: `${b.batch_code} - ${b.leather?.name || b.article?.name || ''}`
                }))}
                required
            />
            <SelectFieldControlled<IBatchCompositionForm>
                name="batch_selection_id"
                label={t("production.batch.father_batch_selection")}
                options={batchSelections.map((b) => ({
                    value: b.id,
                    label: `${b.selection?.name || ''} - ${b.thickness?.name || ''} - ${b.stock_pieces} ${t("production.batch.pieces-string")} - ${b.note}`
                }))}
                required
                deactivated={!watchedFatherBatchId}
            />
            <NumberFieldControlled<IBatchCompositionForm>
                name="father_batch_piece"
                label={t("production.batch.pieces")}
                required
                precision={0}
                max={batchSelections.find(b => b.id === watchedSelectionId)?.stock_pieces as number || 0}
                deactivated={!watchedSelectionId}
            />
            <TextFieldControlled<IBatchCompositionForm>
                name="composition_note"
                label={t("production.batch.note")}
                TextFieldProps={{multiline: true, rows: 2}}
            />
        </Box>
    )
}

export default BatchCompositionForm;
