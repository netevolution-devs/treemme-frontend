import {Box, Stack} from "@mui/material";
import FormButtons from "@features/panels/shared/FormButtons.tsx";
import {FormProvider, useForm, type DefaultValues, type SubmitHandler} from "react-hook-form";
import React, {type ForwardedRef, type ReactNode, useEffect, useRef} from "react";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import {usePanelFormButtons, type IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import type {IDialogActions} from "@shared/ui/dialog/IDialogActions.ts";
import {closeDialog, openDialog} from "@shared/ui/dialog/dialogHelper.ts";
import DeleteConfirmDialog from "@shared/ui/dialog/confirm/DeleteConfirmDialog.tsx";
import SaveConfirmDialog from "@shared/ui/dialog/confirm/SaveConfirmDialog.tsx";
import type {FieldValues} from "react-hook-form";

export interface GenericFormProps<TForm extends FieldValues, TEntity> {
    selectedId: number | null | undefined;
    entity?: TEntity | null | undefined;
    emptyValues: TForm;
    mapEntityToForm: (entity: TEntity) => TForm;

    create?: (payload: TForm) => Promise<unknown> | unknown;
    update?: (id: number, payload: TForm) => Promise<unknown> | unknown;
    remove?: (id: number) => Promise<unknown> | unknown;

    isSaving?: boolean;
    isDeleting?: boolean;

    onClearSelection?: () => void;

    validateBeforeSave?: (values: TForm) => boolean;

    renderFields: () => React.ReactNode;

    onSuccess?: (entity: TEntity) => void;

    // used if form data is inside a dialog
    dialogMode?: boolean;
    dialogRef?: ForwardedRef<IDialogActions>;

    extraButtons?: ReactNode[];
    disabledBasicButtons?: boolean;
    bypassConfirm?: boolean;

    onCreateSuccess?: (id: number) => void;
}

const GenericForm = <TForm extends FieldValues, TEntity = TForm, TUI extends IPanelUIState = IPanelUIState>(
    {
        selectedId,
        entity,
        emptyValues,
        mapEntityToForm,
        create,
        update,
        remove,
        isSaving = false,
        isDeleting = false,
        onClearSelection,
        validateBeforeSave,
        renderFields,
        onSuccess,
        dialogMode = false,
        dialogRef,
        extraButtons,
        disabledBasicButtons = false,
        bypassConfirm = false,
        onCreateSuccess
    }: GenericFormProps<TForm, TEntity>
) => {
    const {useStore} = usePanel<unknown, TUI>();
    const {isFormDisabled, buttonsState} = useStore(state => state.uiState);
    const {setFormState} = usePanelFormButtons<unknown, TUI>();

    const deleteRef = useRef<IDialogActions>(null);
    const saveRef = useRef<IDialogActions>(null);

    const methods = useForm<TForm>({
        disabled: !dialogMode && isFormDisabled,
        mode: "onSubmit",
        defaultValues: emptyValues as DefaultValues<TForm>,
    });

    const handleCloseDialog = React.useCallback(() => {
        if (dialogRef) {
            closeDialog(dialogRef)
        }
    }, [dialogRef]);

    const handleNew = React.useCallback(() => {
        if (dialogMode) return;
        setFormState('new');
    }, [dialogMode, setFormState]);

    const handleEdit = React.useCallback(() => {
        if (dialogMode) return;
        setFormState('edit');
    }, [dialogMode, setFormState]);

    const handleDelete = () => {
        openDialog(deleteRef);
    };

    const onConfirmDelete = async () => {
        if (selectedId) {
            try {
                await remove?.(selectedId);
                onClearSelection?.();
            } finally {
                handleCloseDialog();
                closeDialog(deleteRef);
            }
        }
    };

    const handleCancel = React.useCallback(() => {
        if (selectedId && !isFormDisabled && entity) {
            methods.reset(mapEntityToForm(entity));
            if (dialogMode) return;
            setFormState('selected');
        } else {
            onClearSelection?.();
            methods.reset(emptyValues);
            handleCloseDialog();
            if (dialogMode) return;
            setFormState('cancel');
        }
    }, [selectedId, isFormDisabled, entity, methods, mapEntityToForm, dialogMode, setFormState, onClearSelection, emptyValues, handleCloseDialog]);

    const onSubmit = (data: TForm) => {
        if (validateBeforeSave && !validateBeforeSave(data)) return;
        if (bypassConfirm) {
            onConfirmSave();
            return;
        }
        openDialog(saveRef);
    };

    const onConfirmSave = async () => {
        const data = methods.getValues();

        const cleanData = Object.fromEntries(
            Object.entries(data).filter(([, value]) => value !== null && value !== undefined)
        ) as TForm;

        try {
            if (selectedId && !bypassConfirm) {
                const res = await update?.(selectedId, cleanData);
                if (res) {
                    onSuccess?.(res as TEntity);
                    setFormState('selected');
                }
            } else {
                const res = await create?.(cleanData) as {id: number};
                if (res) {
                    onSuccess?.(res as TEntity);
                    onCreateSuccess?.(res.id);
                    if (!onClearSelection) {
                        methods.reset(emptyValues);
                        setFormState('init');
                    }
                }
            }
        } finally {
            handleCloseDialog();
            closeDialog(saveRef);
        }
    };

    useEffect(() => {
        if (selectedId && entity) {
            methods.reset(mapEntityToForm(entity));
            if (dialogMode) return;
            setFormState('selected');
        } else if (selectedId === null) {
            methods.reset(emptyValues);
            if (dialogMode) return;
            setFormState('cancel');
        }
    }, [selectedId, entity]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement;
            if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
                return;
            }

            if (event.key === "Escape") {
                handleCancel();
            }

            if (event.key === "Enter" && isFormDisabled) {
                handleNew();
            }

            if (event.key === "Enter" && isFormDisabled && !!selectedId) {
                handleEdit();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleCancel, handleNew, handleEdit, isFormDisabled, selectedId]);

    return (
        <Box sx={{width: '100%'}}>
            <FormProvider {...methods}>
                <Stack
                    component="form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        methods.handleSubmit(onSubmit as SubmitHandler<TForm>)(e);
                    }}
                    autoComplete="off"
                >
                    <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1}}>
                        <FormButtons
                            onNew={handleNew}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onCancel={handleCancel}
                            buttonState={buttonsState}
                            hideNew={dialogMode}
                            hideEdit={dialogMode}
                            hideDelete={!selectedId && dialogMode || disabledBasicButtons}
                            hideSave={disabledBasicButtons}
                            overrideButtonState={dialogMode}
                        />
                        <Box sx={{display: 'flex', flexDirection: 'row', gap: 1, flexWrap: 'wrap'}}>
                            {extraButtons?.map((button, index) => (
                                <React.Fragment key={index}>
                                    {button}
                                </React.Fragment>
                            ))}
                        </Box>
                    </Box>
                    <Stack sx={{mt: 3}}>
                        {renderFields()}
                    </Stack>
                </Stack>
            </FormProvider>

            <DeleteConfirmDialog
                ref={deleteRef}
                onConfirm={onConfirmDelete}
                isPending={isDeleting}
            />

            <SaveConfirmDialog
                ref={saveRef}
                onConfirm={onConfirmSave}
                isPending={isSaving}
            />
        </Box>
    );
};

export default GenericForm;
