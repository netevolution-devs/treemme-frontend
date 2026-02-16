import React from "react";
import {Controller, type FieldValues, useFormContext} from "react-hook-form";
import type {ControlledFieldProps} from "@ui/form/controlled/ControlledFieldProps.ts";
import {useTranslation} from "react-i18next";
import {TextField} from "@mui/material";
import ErrorFormHelperText from "@ui/form/ErrorFormHelperText.tsx";

const TextFieldControlled = <TFieldValues extends FieldValues>({
                                                                   name,
                                                                   label,
                                                                   required = false,
                                                                   TextFieldProps,
                                                                   showHelperRow = true,
                                                                   maxLength = 255,
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
                maxLength: {value: maxLength, message: t("common:form.error.too-long")},
            }}
            render={({field, fieldState: {error}}) => {
                const {onBlur, ...restField} = field;
                const composedOnBlur = (e: React.FocusEvent) => {
                    TextFieldProps?.onBlur?.(e as never);
                    onBlur();
                };
                return (
                    <TextField
                        {...TextFieldProps}
                        {...restField}
                        onBlur={composedOnBlur}
                        label={formattedLabel}
                        fullWidth
                        error={!!error}
                        helperText={error?.message ?? (showHelperRow ? " " : "")}
                        slotProps={{
                            formHelperText: {
                                component: ({children}) =>
                                    <ErrorFormHelperText isError={!!error} children={children}/>
                            },
                            htmlInput: {maxLength: maxLength}
                        }}
                        disabled={disabled}
                    />
                )
            }}
        />
    )
}

export default TextFieldControlled;
