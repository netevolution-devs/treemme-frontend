import {forwardRef} from "react";
import type {IDialogActions} from "@ui/dialog/IDialogActions";
import BaseDialog from "@ui/dialog/BaseDialog";
import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import type {
    ICurrenciesExchangeStoreState
} from "@features/panels/commercial/currenciesExchange/CurrenciesExchangePanel";
import {currencyChangeApi} from "@features/panels/commercial/currenciesExchange/api/currencyChangeApi";
import {Stack, Typography} from "@mui/material";
import GenericForm from "@features/panels/shared/GenericForm";
import CustomButton from "@features/panels/shared/CustomButton";
import DateFieldControlled from "@ui/form/controlled/DateFieldControlled";
import AddIcon from '@mui/icons-material/Add';
import dayjs from "dayjs";
import NumberFieldControlled from "@ui/form/controlled/NumberFieldControlled";

type Props = {
    currencyId?: number,
    currencyValue?: number | null,
    onChangeValue?: (value: number) => void;
};

export type ICurrenciesExchangeForm = {
    date: string;
    change_value: number | null;
    currency_id: number | null;
}

const CurrenciesExchangeFormDialog = forwardRef<IDialogActions, Props>(({
                                                                            currencyId,
                                                                            currencyValue = null,
                                                                            onChangeValue
                                                                        }, ref) => {
    const {t} = useTranslation(["form", "common"]);

    const {useStore} = usePanel<unknown, ICurrenciesExchangeStoreState>();
    const selectedCurrencyId = useStore((state) => state.uiState.selectedCurrencyId);

    const {
        mutateAsync: createExchange,
        isPending
    } = currencyChangeApi.usePost({invalidateQueries: ['CURRENCY', 'LIST']});

    return (
        <BaseDialog ref={ref} sx={{p: 2}}>
            <Typography variant={"h5"} sx={{mb: 2}}>{t("common:button.add")}</Typography>

            <GenericForm<ICurrenciesExchangeForm>
                dialogMode
                dialogRef={ref}
                disabledBasicButtons
                bypassConfirm
                selectedId={null}
                entity={{
                    date: dayjs().format("YYYY-MM-DD"),
                    change_value: currencyValue ?? null,
                    currency_id: currencyId ?? null,
                }}
                emptyValues={{
                    date: dayjs().format("YYYY-MM-DD"),
                    change_value: currencyValue,
                    currency_id: currencyId ?? null,
                }}
                mapEntityToForm={(x) => ({
                    date: x.date,
                    change_value: x.change_value,
                    currency_id: currencyId ?? null,
                })}
                create={async (payload) => {
                    const result = await createExchange({
                        date: payload.date,
                        change_value: payload.change_value,
                        currency_id: currencyId ?? selectedCurrencyId as number
                    });
                    onChangeValue?.(payload.change_value as number);  // only fires after successful POST
                    return result;
                }}
                validateBeforeSave={(v) => !!v.date && !!v.change_value}
                extraButtons={[
                    <CustomButton
                        label={t("common:button.execute")}
                        color={"success"}
                        icon={<AddIcon/>}
                        isSubmit
                    />
                ]}
                isSaving={isPending}
                renderFields={() => <CurrenciesExchangeFormFields/>}
            />
        </BaseDialog>
    )
});

const CurrenciesExchangeFormFields = () => {
    const {t} = useTranslation(["form", "common"]);
    return (
        <Stack gap={2}>
            <DateFieldControlled<ICurrenciesExchangeForm> name={"date"} label={t("currencies.date")} required />
            <NumberFieldControlled<ICurrenciesExchangeForm> name={"change_value"} label={t("currencies.change_value")} required precision={4} />
        </Stack>
    )
}

export default CurrenciesExchangeFormDialog;
