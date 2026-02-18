import {Box, Stack} from "@mui/material";
import FormButtons from "@features/panels/shared/FormButtons.tsx";
import {FormProvider, useForm} from "react-hook-form";
import type {IProvince} from "@features/panels/contacts/province/api/IProvince.ts";
import {useTranslation} from "react-i18next";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled.tsx";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IProvinceStoreState} from "@features/panels/contacts/province/ProvincePanel.tsx";
import usePostProvince from "@features/panels/contacts/province/api/usePostProvince.tsx";

export type IProvinceForm = Omit<IProvince, 'id'>;

const ProvinceForm = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IProvinceStoreState>();
    const isFormDisabled = useStore(state => state.uiState.isFormDisabled);
    const buttonsState = useStore(state => state.uiState.buttonsState);
    const setUIState = useStore(state => state.setUIState);

    const {mutateAsync: createProvince} = usePostProvince();

    const methods = useForm<IProvinceForm>({
        disabled: isFormDisabled,
        mode: "onSubmit",
        defaultValues: {
            acronym: '',
            name: ''
        }
    });

    const handleNew = () => {
        console.log("new");
        setUIState({isFormDisabled: false});
        setUIState({buttonsState: {...buttonsState, new: false, save: true}});
    }

    const handleEdit = () => {
        console.log("edit");
    }

    const handleDelete = () => {
        console.log("delete");
    }

    const onSubmit = async (data: IProvinceForm) => {
        if (!data.acronym || !data.name) return;
        await createProvince({
            name: data.name,
            acronym: data.acronym,
        })
        setUIState({isFormDisabled: true, buttonsState: {...buttonsState, new: true, save: false}});
        methods.reset();
    }

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
        </Box>
    )
}

export default ProvinceForm;