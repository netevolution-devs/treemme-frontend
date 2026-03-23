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
                                                                   showHelperRow = false,
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
                const {onBlur, value, ...restField} = field;
                const composedOnBlur = (e: React.FocusEvent) => {
                    TextFieldProps?.onBlur?.(e as never);
                    onBlur();
                };

                const isShrink = !!value || value === 0;

                return (
                    <TextField
                        {...TextFieldProps}
                        {...restField}
                        value={value ?? ""}
                        onBlur={composedOnBlur}
                        label={formattedLabel}
                        fullWidth
                        size={"small"}
                        error={!!error}
                        helperText={error?.message ?? (showHelperRow ? " " : "")}
                        slotProps={{
                            formHelperText: {
                                component: ({children}) =>
                                    <ErrorFormHelperText isError={!!error} children={children}/>
                            },
                            htmlInput: {maxLength: maxLength},
                            inputLabel: {
                                shrink: isShrink,
                                ...TextFieldProps?.slotProps?.inputLabel
                            },
                            ...TextFieldProps?.slotProps
                        }}
                        sx={{mb: 1.2}}
                        disabled={disabled}
                    />
                )
            }}
        />
    )
}

export default TextFieldControlled;
