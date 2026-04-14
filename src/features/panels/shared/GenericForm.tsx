import {Box, Stack} from "@mui/material";
import FormButtons from "@features/panels/shared/FormButtons";
import {FormProvider, useForm, type DefaultValues, type SubmitHandler} from "react-hook-form";
import React, {type ForwardedRef, type ReactNode, useEffect, useRef} from "react";
import {usePanel} from "@ui/panel/PanelContext";
import {usePanelFormButtons, type IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import type {IDialogActions} from "@shared/ui/dialog/IDialogActions";
import {closeDialog, openDialog} from "@shared/ui/dialog/dialogHelper";
import DeleteConfirmDialog from "@shared/ui/dialog/confirm/DeleteConfirmDialog";
import SaveConfirmDialog from "@shared/ui/dialog/confirm/SaveConfirmDialog";
import type {FieldValues} from "react-hook-form";
import {useDockviewStore} from "@ui/panel/store/DockviewStore";
import type {IDockviewPanel} from "dockview";
import {useAuth} from "@features/auth/model/AuthContext";
import {permissionEngine, type ResourceName} from "@features/authz/permission.utils";
import type {IAccessControl} from "@features/user/model/RoleInterfaces";

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

    floatingPanelMode?: boolean;
    floatingPanelUUID?: string;

    extraButtons?: ReactNode[];
    disabledBasicButtons?: boolean;
    bypassConfirm?: boolean;
    disableDeleteButton?: boolean;

    onCreateSuccess?: (id: number) => void;
    resource?: ResourceName;
    closePanelOnSave?: boolean;
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
        disableDeleteButton = false,
        bypassConfirm = false,
        onCreateSuccess,
        floatingPanelMode = false,
        floatingPanelUUID,
        resource,
        closePanelOnSave = true,
    }: GenericFormProps<TForm, TEntity>
) => {
    const dockviewApi = useDockviewStore(state => state.api);

    const {useStore} = usePanel<unknown, TUI>();
    const {isFormDisabled, buttonsState} = useStore(state => state.uiState);
    const {setFormState} = usePanelFormButtons<unknown, TUI>();

    const {user} = useAuth();
    const engine = permissionEngine((user?.accessControl ?? []) as IAccessControl[]);
    const canPost = !resource || engine.can(resource, 'post');
    const canPut = !resource || engine.can(resource, 'put');
    const canDelete = !resource || engine.can(resource, 'delete');

    const deleteRef = useRef<IDialogActions>(null);
    const saveRef = useRef<IDialogActions>(null);

    const methods = useForm<TForm>({
        disabled: (!dialogMode && isFormDisabled) || isSaving,
        mode: "onSubmit",
        defaultValues: emptyValues as DefaultValues<TForm>,
    });

    const handleCloseDialog = React.useCallback(() => {
        if (dialogRef) {
            closeDialog(dialogRef)
        }
        if (floatingPanelMode) {
            console.log("Removing floating panel");
            console.log("Floating panel UUID", floatingPanelUUID);
            const panel = dockviewApi?.getPanel(floatingPanelUUID as string) as IDockviewPanel;
            console.log("Panel", panel);
            dockviewApi?.removePanel(panel);
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
            if (selectedId) {
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
                    if (!dialogMode) {
                        methods.reset(emptyValues);
                    }
                    setFormState('init');
                }
            }
        } finally {
            if (closePanelOnSave) {
                handleCloseDialog();
            }
            closeDialog(saveRef);
        }
    };

    useEffect(() => {
        if (selectedId && entity) {
            methods.reset(mapEntityToForm(entity));
            if (dialogMode) return;
            setFormState('selected');
        } else if (!selectedId) {
            methods.reset(emptyValues);
            if (dialogMode) return;
            setFormState('init');
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

            if ((event.ctrlKey && event.key === "F7" || event.key == "Enter") && isFormDisabled) {
                handleNew();
            }

            if (event.key === "Enter" && isFormDisabled && !!selectedId) {
                handleEdit();
            }

            if (event.ctrlKey && event.key === "F10" && !isFormDisabled) {
                event.preventDefault();
                methods.handleSubmit(onSubmit as SubmitHandler<TForm>)();
                handleCloseDialog();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleCancel, handleNew, handleEdit, isFormDisabled, selectedId, methods, onSubmit, handleCloseDialog]);

    return (
       <Box sx={{width: '100%', height: '100%'}}>
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
                            hideNew={dialogMode || !canPost}
                            hideEdit={dialogMode || !canPut}
                            hideDelete={(!selectedId && dialogMode) || disabledBasicButtons || !canDelete || disableDeleteButton}
                            hideSave={disabledBasicButtons || (!canPost && !canPut)}
                            overrideButtonState={dialogMode}
                            isLoading={isSaving}
                        />
                        <Box sx={{display: 'flex', flexDirection: 'row', gap: 1, flexWrap: 'wrap'}}>
                            {extraButtons?.map((button, index) => {
                                if (React.isValidElement(button) && (button.props as {isSubmit?: boolean}).isSubmit) {
                                    return React.cloneElement(button as React.ReactElement<{isLoading?: boolean}>, {
                                        key: index,
                                        isLoading: isSaving
                                    });
                                }
                                return (
                                    <React.Fragment key={index}>
                                        {button}
                                    </React.Fragment>
                                );
                            })}
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
