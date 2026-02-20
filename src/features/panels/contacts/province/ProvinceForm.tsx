import {Box, Stack} from "@mui/material";
import FormButtons from "@features/panels/shared/FormButtons.tsx";
import {FormProvider, useForm} from "react-hook-form";
import type {IProvince} from "@features/panels/contacts/province/api/IProvince.ts";
import {useTranslation} from "react-i18next";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled.tsx";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IProvinceStoreState} from "@features/panels/contacts/province/ProvincePanel.tsx";
import {useEffect, useRef} from "react";
import {usePanelFormButtons} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import type {IDialogActions} from "@shared/ui/dialog/IDialogActions.ts";
import {openDialog} from "@shared/ui/dialog/dialogHelper.ts";
import DeleteConfirmDialog from "@shared/ui/dialog/confirm/DeleteConfirmDialog.tsx";
import SaveConfirmDialog from "@shared/ui/dialog/confirm/SaveConfirmDialog.tsx";
import {provinceApi} from "@features/panels/contacts/province/api/proviceApi.ts";

export type IProvinceForm = Omit<IProvince, 'id'>;

const ProvinceForm = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IProvinceStoreState>();
    const {
        isFormDisabled,
        buttonsState,
        selectedProvinceId
    } = useStore(state => state.uiState);

    const setUIState = useStore(state => state.setUIState);
    const {setFormState} = usePanelFormButtons<unknown, IProvinceStoreState>();

    const deleteRef = useRef<IDialogActions>(null);
    const saveRef = useRef<IDialogActions>(null);

    const { useGetDetail, usePost, usePut, useDelete } = provinceApi;
    const {data: province} = useGetDetail(selectedProvinceId);
    const {mutateAsync: createProvince, isPending: isPosting} = usePost();
    const {mutateAsync: updateProvince, isPending: isPutting} = usePut();
    const {mutateAsync: deleteProvince, isPending: isDeleting} = useDelete();

    const isPending = isPosting || isPutting;

    const methods = useForm<IProvinceForm>({
        disabled: isFormDisabled,
        mode: "onSubmit",
        defaultValues: {
            acronym: '',
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
        if (selectedProvinceId) {
            await deleteProvince(selectedProvinceId);
            setUIState({selectedProvinceId: null});
        }
    }

    const handleCancel = () => {
        if (selectedProvinceId && !isFormDisabled) {
            methods.reset({ acronym: province?.acronym || '', name: province?.name || '' });
            setFormState('selected');
        } else {
            setUIState({ selectedProvinceId: null });
            methods.reset({ acronym: '', name: '' });
            setFormState('cancel');
        }
    }

    const onSubmit = (data: IProvinceForm) => {
        if (!data.acronym || !data.name) return;
        openDialog(saveRef);
    }

    const onConfirmSave = async () => {
        const data = methods.getValues();
        if (selectedProvinceId) {
            await updateProvince({
                id: selectedProvinceId,
                payload: {
                    name: data.name,
                    acronym: data.acronym,
                }
            })
        } else {
            await createProvince({
                name: data.name,
                acronym: data.acronym,
            })
        }

        setUIState({selectedProvinceId: null});
    }

    useEffect(() => {
        if (selectedProvinceId && province) {
            methods.reset({acronym: province.acronym, name: province.name});
            setFormState('selected');
        } else if (selectedProvinceId === null) {
            methods.reset({acronym: '', name: ''});
            setFormState('cancel');
        }
    }, [selectedProvinceId, province])

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
                        <TextFieldControlled<IProvinceForm>
                            name="acronym"
                            label={t("province.acronym")}
                        />
                        <TextFieldControlled<IProvinceForm>
                            name="name"
                            label={t("province.name")}
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

export default ProvinceForm;