import {useTranslation} from "react-i18next";
import type {INation} from "@features/panels/contacts/nations/api/INation.ts";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {INationsStoreState} from "@features/panels/contacts/nations/NationsPanel.tsx";
import {usePanelFormButtons} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import {useEffect, useRef} from "react";
import type {IDialogActions} from "@ui/dialog/IDialogActions.ts";
import {nationsApi} from "@features/panels/contacts/nations/api/nationsApi.ts";
import {FormProvider, useForm} from "react-hook-form";
import {openDialog} from "@ui/dialog/dialogHelper.ts";
import {Box, Stack} from "@mui/material";
import FormButtons from "@features/panels/shared/FormButtons.tsx";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled.tsx";
import DeleteConfirmDialog from "@ui/dialog/confirm/DeleteConfirmDialog.tsx";
import SaveConfirmDialog from "@ui/dialog/confirm/SaveConfirmDialog.tsx";

export type INationForm = Omit<INation, "id">;

const NationsForm = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, INationsStoreState>();
    const {
        isFormDisabled,
        buttonsState,
        selectedNationId
    } = useStore(state => state.uiState);

    const setUIState = useStore(state => state.setUIState);
    const {setFormState} = usePanelFormButtons<unknown, INationsStoreState>();

    const deleteRef = useRef<IDialogActions>(null);
    const saveRef = useRef<IDialogActions>(null);

    const { useGetDetail, usePost, usePut, useDelete } = nationsApi;
    const {data: nation} = useGetDetail(selectedNationId);
    const {mutateAsync: createNation, isPending: isPosting} = usePost();
    const {mutateAsync: updateNation, isPending: isPutting} = usePut();
    const {mutateAsync: deleteNation, isPending: isDeleting} = useDelete();

    const isPending = isPosting || isPutting;

    const methods = useForm<INationForm>({
        disabled: isFormDisabled,
        mode: "onSubmit",
        defaultValues: {
            name: ''
        }
    });

    const handleNew = () => {
        setFormState('new');
    }

    const handleEdit = () => {
        setFormState('edit');
    }

    const handleDelete = () => {
        openDialog(deleteRef);
    }

    const onConfirmDelete = async () => {
        if (selectedNationId) {
            await deleteNation(selectedNationId);
            setUIState({selectedNationId: null});
        }
    }

    const handleCancel = () => {
        if (selectedNationId && !isFormDisabled) {
            methods.reset({ name: nation?.name || '' });
            setFormState('selected');
        } else {
            setUIState({ selectedNationId: null });
            methods.reset({ name: '' });
            setFormState('cancel');
        }
    }

    const onSubmit = (data: INationForm) => {
        if (!data.name) return;
        openDialog(saveRef);
    }

    const onConfirmSave = async () => {
        const data = methods.getValues();
        if (selectedNationId) {
            await updateNation({
                id: selectedNationId,
                payload: {
                    name: data.name,
                }
            })
        } else {
            await createNation({
                name: data.name,
            })
        }

        setUIState({selectedNationId: null});
    }

    useEffect(() => {
        if (selectedNationId && nation) {
            methods.reset({name: nation.name});
            setFormState('selected');
        } else if (selectedNationId === null) {
            methods.reset({name: ''});
            setFormState('cancel');
        }
    }, [selectedNationId, nation])

    return (
        <Box>
            <FormProvider {...methods}>
                <Stack
                    component="form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        methods.handleSubmit(onSubmit)(e);
                    }}
                    autoComplete="off"
                >
                    <FormButtons
                        onNew={handleNew}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onCancel={handleCancel}
                        buttonState={buttonsState}
                    />
                    <Stack sx={{mt: 3}}>
                        <TextFieldControlled<INationForm>
                            name="name"
                            label={t("nations.name")}
                        />
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
                isPending={isPending}
            />
        </Box>
    )
}

export default NationsForm;