import {useTranslation} from "react-i18next";
import {TextField} from "@mui/material";
import ErrorFormHelperText from "@ui/form/ErrorFormHelperText.tsx";
import {Controller, type FieldValues, useFormContext} from "react-hook-form";
import type {ControlledFieldProps} from "@ui/form/controlled/ControlledFieldProps.ts";

const NumberField = <TFieldValues extends FieldValues>({
                                                                   name,
                                                                   label,
                                                                   required = false,
                                                                   showHelperRow = true,
                                                               }: ControlledFieldProps<TFieldValues>) => {
    const {t} = useTranslation(["common"])
    const {
        control,
        formState: {disabled}
    } = useFormContext<TFieldValues>();

    const formattedLabel = required && label ? `${label} *` : label

    return (
        <Controller
            name={name}
            control={control}
            rules={{
                required: {value: required, message: t("common:form.error.required")},
                pattern: {
                    value: /^\d+$/,
                    message:  t("common:form.error.only-numbers")
                }
            }}
            render={({field, fieldState: {error}}) => (
                <TextField
                    label={formattedLabel}
                    {...field}
                    onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        field.onChange(value);
                    }}
                    helperText={error?.message ?? (showHelperRow ? " " : "")}
                    error={!!error}
                    slotProps={{
                        input: {
                            inputMode: "numeric"
                        },
                        formHelperText: {
                            component: ({children}) =>
                                <ErrorFormHelperText isError={!!error} children={children}/>
                        },
                        htmlInput: {maxLength: 255}
                    }}
                    disabled={disabled}
                />
            )}
        />
    )
}

export default NumberField;
