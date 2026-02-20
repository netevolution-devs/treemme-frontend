import {Box, Stack} from "@mui/material";
import FormButtons from "@features/panels/shared/FormButtons.tsx";
import {FormProvider, useForm} from "react-hook-form";
import type {ICap} from "@features/panels/contacts/cap/api/ICap.ts";
import {useTranslation} from "react-i18next";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled.tsx";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {ICapStoreState} from "@features/panels/contacts/cap/CapPanel.tsx";
import {useEffect, useRef} from "react";
import {usePanelFormButtons} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import type {IDialogActions} from "@shared/ui/dialog/IDialogActions.ts";
import {openDialog} from "@shared/ui/dialog/dialogHelper.ts";
import DeleteConfirmDialog from "@shared/ui/dialog/confirm/DeleteConfirmDialog.tsx";
import SaveConfirmDialog from "@shared/ui/dialog/confirm/SaveConfirmDialog.tsx";
import {capApi} from "@features/panels/contacts/cap/api/capApi.ts";
import {provinceApi} from "@features/panels/contacts/province/api/proviceApi.ts";
import SelectFieldControlled from "@ui/form/controlled/SelectFieldController.tsx";

export type ICapForm = Omit<ICap, 'id'> & {province_id: number};

const CapForm = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, ICapStoreState>();
    const {
        isFormDisabled,
        buttonsState,
        selectedCapId
    } = useStore(state => state.uiState);

    const setUIState = useStore(state => state.setUIState);
    const {setFormState} = usePanelFormButtons<unknown, ICapStoreState>();

    const deleteRef = useRef<IDialogActions>(null);
    const saveRef = useRef<IDialogActions>(null);

    // API CAP
    const { useGetDetail, usePost, usePut, useDelete } = capApi;
    const {data: cap} = useGetDetail(selectedCapId);
    const {mutateAsync: createCap, isPending: isPosting} = usePost();
    const {mutateAsync: updateCap, isPending: isPutting} = usePut();
    const {mutateAsync: deleteCap, isPending: isDeleting} = useDelete();

    // API Province per la Select
    const {useGetList: useGetProvinces} = provinceApi;
    const {data: provinces} = useGetProvinces();

    const isPending = isPosting || isPutting;

    const methods = useForm<ICapForm>({
        disabled: isFormDisabled,
        mode: "onSubmit",
        defaultValues: {
            cap: '',
            name: '',
            province_id: 0
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
        if (selectedCapId) {
            await deleteCap(selectedCapId);
            setUIState({selectedCapId: null});
        }
    }

    const handleCancel = () => {
        if (selectedCapId && !isFormDisabled) {
            methods.reset({
                cap: cap?.cap || '',
                name: cap?.name || '',
                province_id: cap?.province.id || 0
            });
            setFormState('selected');
        } else {
            setUIState({ selectedCapId: null });
            methods.reset({ cap: '', name: '', province_id: 0 });
            setFormState('cancel');
        }
    }

    const onSubmit = (data: ICapForm) => {
        if (!data.cap || !data.name || !data.province_id) return;
        openDialog(saveRef);
    }

    const onConfirmSave = async () => {
        const data = methods.getValues();
        const payload = {
            cap: data.cap,
            name: data.name,
            province_id: data.province_id,
        };

        if (selectedCapId) {
            await updateCap({
                id: selectedCapId,
                payload: payload
            })
        } else {
            await createCap(payload)
        }

        setUIState({selectedCapId: null});
    }

    useEffect(() => {
        if (selectedCapId && cap) {
            methods.reset({
                cap: cap.cap,
                name: cap.name,
                province_id: cap.province.id
            });
            setFormState('selected');
        } else if (selectedCapId === null) {
            methods.reset({cap: '', name: '', province_id: 0});
            setFormState('cancel');
        }
    }, [selectedCapId, cap])

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
                    <Stack sx={{mt: 3}} spacing={2}>
                        <SelectFieldControlled<ICapForm>
                            name="province_id"
                            label={t("province.name")}
                            options={provinces?.map(p => ({
                                value: p.id,
                                label: `${p.acronym} - ${p.name}`
                            })) || []}
                            showHelperRow={false}
                        />
                        <TextFieldControlled<ICapForm>
                            name="cap"
                            label={t("cap.code")}
                            showHelperRow={false}
                        />
                        <TextFieldControlled<ICapForm>
                            name="name"
                            label={t("cap.name")}
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

export default CapForm;