import {Controller, type FieldValues, useFormContext} from "react-hook-form";
import type {ControlledFieldProps} from "@ui/form/controlled/ControlledFieldProps";
import {useTranslation} from "react-i18next";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import ErrorFormHelperText from "@ui/form/ErrorFormHelperText";
import "dayjs/locale/it";

const DateFieldControlled = <TFieldValues extends FieldValues>({
                                                                   name,
                                                                   label,
                                                                   required = false,
                                                                   showHelperRow = false,
                                                               }: ControlledFieldProps<TFieldValues>) => {
    const {t} = useTranslation(["common"]);
    const {
        control,
        formState: {disabled}
    } = useFormContext<TFieldValues>();

    const formattedLabel = required && label ? `${label} *` : label;

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="it">
            <Controller
                name={name}
                control={control}
                rules={{
                    required: {value: required, message: t("common:form.error.required")},
                }}
                render={({field: {onChange, value, onBlur, ref}, fieldState: {error}}) => {
                    return (
                        <DatePicker
                            label={formattedLabel}
                            value={value ? dayjs(value) : null}
                            onChange={(newValue) => {
                                onChange(newValue ? newValue.format("YYYY-MM-DD") : null);
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
                                    sx: {
                                        "& .MuiPickersInputBase-root": {
                                            paddingTop: "0 !important",
                                            paddingBottom: "0 !important",
                                            minHeight: "unset",
                                        },
                                        "& .MuiPickersSectionList-root": {
                                            paddingTop: "4px !important",
                                            paddingBottom: "4px !important",
                                        },
                                        "& .MuiInputAdornment-root": {
                                            height: "auto",
                                            maxHeight: "none",
                                        },
                                    },
                                    slotProps: {
                                        formHelperText: {
                                            component: ({children}) => (
                                                <ErrorFormHelperText isError={!!error}>
                                                    {children}
                                                </ErrorFormHelperText>
                                            ),
                                        },
                                    }
                                },
                                openPickerButton: {
                                    size: "small",
                                    sx: {
                                        padding: "0px",
                                        "& .MuiSvgIcon-root": {
                                            fontSize: "1.2rem",
                                        },
                                    },
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