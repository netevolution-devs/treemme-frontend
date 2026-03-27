import {forwardRef, memo, useEffect} from "react";
import type {IDialogActions} from "@ui/dialog/IDialogActions.ts";
import BaseDialog from "@ui/dialog/BaseDialog.tsx";
import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {ICurrenciesExchangeStoreState} from "@features/panels/commercial/currenciesExchange/CurrenciesExchangePanel.tsx";
import {currencyChangeApi} from "@features/panels/commercial/currenciesExchange/api/currencyChangeApi.ts";
import {Stack, Typography} from "@mui/material";
import GenericForm from "@features/panels/shared/GenericForm.tsx";
import CustomButton from "@features/panels/shared/CustomButton.tsx";
import DateFieldControlled from "@ui/form/controlled/DateFieldControlled.tsx";
import AddIcon from '@mui/icons-material/Add';
import dayjs from "dayjs";
import NumberFieldControlled from "@ui/form/controlled/NumberFieldControlled.tsx";
import {useWatch} from "react-hook-form";

type Props = { currencyId?: number, currencyValue?: number | null, onChangeValue?: (val: number | null) => void };

export type ICurrenciesExchangeForm = {
    date: string;
    change_value: number | null;
    currency_id: number | null;
}

const FormValueWatcher = memo(({ onChangeValue }: { onChangeValue?: ((val: number | null) => void) | undefined }) => {
    const watchedChangeValue = useWatch<ICurrenciesExchangeForm>({ name: 'change_value' });

    useEffect(() => {
        if (onChangeValue) {
            onChangeValue(watchedChangeValue as number | null);
        }
    }, [watchedChangeValue, onChangeValue]);

    return null;
});

const CurrenciesExchangeFormDialog = forwardRef<IDialogActions, Props>(({currencyId, currencyValue = null, onChangeValue}, ref) => {
    const {t} = useTranslation(["form", "common"]);

    const {useStore} = usePanel<unknown, ICurrenciesExchangeStoreState>();
    const selectedCurrencyId = useStore((state) => state.uiState.selectedCurrencyId);

    const {mutateAsync: createExchange, isPending} = currencyChangeApi.usePost({invalidateQueries: ['CURRENCY', 'LIST']});

    return (
        <BaseDialog ref={ref} sx={{p: 2}}>
            <Typography variant={"h5"} sx={{mb: 2}}>{t("common:button.add")}</Typography>

            <GenericForm<ICurrenciesExchangeForm>
                dialogMode
                dialogRef={ref}
                disabledBasicButtons
                bypassConfirm
                selectedId={selectedCurrencyId}
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
                create={(payload) => createExchange({
                    date: payload.date,
                    change_value: payload.change_value,
                    currency_id: selectedCurrencyId as number ?? currencyId
                })}
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
                renderFields={() => (
                    <Stack gap={2}>
                        <FormValueWatcher onChangeValue={onChangeValue} />

                        <DateFieldControlled<ICurrenciesExchangeForm>
                            name={"date"}
                            label={t("currencies.date")}
                            required
                        />
                        <NumberFieldControlled<ICurrenciesExchangeForm>
                            name={"change_value"}
                            label={t("currencies.change_value")}
                            required
                            precision={3}
                        />
                    </Stack>
                )}
            />
        </BaseDialog>
    )
});

export default CurrenciesExchangeFormDialog;
