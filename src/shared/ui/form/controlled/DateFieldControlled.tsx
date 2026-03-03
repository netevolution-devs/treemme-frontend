import { Controller, type FieldValues, useFormContext } from "react-hook-form";
import type { ControlledFieldProps } from "@ui/form/controlled/ControlledFieldProps.ts";
import { useTranslation } from "react-i18next";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import ErrorFormHelperText from "@ui/form/ErrorFormHelperText.tsx";
import "dayjs/locale/it";

const DateFieldControlled = <TFieldValues extends FieldValues>({
                                                                   name,
                                                                   label,
                                                                   required = false,
                                                                   showHelperRow = true,
                                                               }: ControlledFieldProps<TFieldValues>) => {
    const { t } = useTranslation(["common"]);
    const {
        control,
        formState: { disabled }
    } = useFormContext<TFieldValues>();

    const formattedLabel = required && label ? `${label} *` : label;

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="it">
            <Controller
                name={name}
                control={control}
                rules={{
                    required: { value: required, message: t("common:form.error.required") },
                }}
                render={({ field: { onChange, value, onBlur, ref }, fieldState: { error } }) => {
                    return (
                        <DatePicker
                            label={formattedLabel}
                            value={value ? dayjs(value) : null}
                            onChange={(newValue) => {
                                onChange(newValue ? newValue.format("YYYY-MM-DD") : "");
                            }}
                            disabled={disabled}
                            slotProps={{
                                textField: {
                                    onBlur,
                                    inputRef: ref,
                                    size: "small",
                                    fullWidth: true,
                                    error: !!error,
                                    helperText: error?.message ?? (showHelperRow ? " " : ""),
                                    slotProps: {
                                        formHelperText: {
                                            // @ts-expect-error component prop is not correctly typed in MUI
                                            component: ({ children }) => (
                                                <ErrorFormHelperText isError={!!error}>
                                                    {children}
                                                </ErrorFormHelperText>
                                            ),
                                        },
                                    }
                                },
                            }}
                        />
                    );
                }}
            />
        </LocalizationProvider>
    );
};

export default DateFieldControlled;
