import {Box, Stack} from "@mui/material";
import FormButtons from "@features/panels/shared/FormButtons.tsx";
import {FormProvider, useForm} from "react-hook-form";
import type {IProvince} from "@features/panels/contacts/province/api/IProvince.ts";
import {useTranslation} from "react-i18next";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled.tsx";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IProvinceStoreState} from "@features/panels/contacts/province/ProvincePanel.tsx";

type IProvinceForm = Omit<IProvince, 'id'>;

const ProvinceForm = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IProvinceStoreState>();
    const isFormDisabled = useStore(state => state.uiState.isFormDisabled);
    const setUIState = useStore(state => state.setUIState);

    const methods = useForm<IProvinceForm>({disabled: isFormDisabled});

    const handleNew = () => {
        console.log("new");
        setUIState({isFormDisabled: false});
    }

    const handleEdit = () => {
        console.log("edit");
    }

    const handleDelete = () => {
        console.log("delete");
    }

    const handleSave = () => {
        console.log("save");
    }

    return (
        <Box>
            <FormProvider {...methods}>
                <FormButtons
                    onNew={handleNew}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onSave={handleSave}
                />
                <Stack sx={{mt: 3}}>
                    <TextFieldControlled<IProvinceForm>
                        name="single"
                        label={t("province.sigla")}
                    />
                    <TextFieldControlled<IProvinceForm>
                        name="province"
                        label={t("province.province")}
                    />
                </Stack>
            </FormProvider>
        </Box>
    )
}

export default ProvinceForm;