import { Controller, type FieldValues, useFormContext } from "react-hook-form";
import type { ControlledFieldProps } from "@ui/form/controlled/ControlledFieldProps.ts";
import { useTranslation } from "react-i18next";
import { Autocomplete, TextField, Box } from "@mui/material";
import ErrorFormHelperText from "@ui/form/ErrorFormHelperText.tsx";

interface SelectFieldProps<TFieldValues extends FieldValues> extends ControlledFieldProps<TFieldValues> {
    options: { value: string | number; label: string }[];
    minWidth?: number;
}

const SelectFieldControlled = <TFieldValues extends FieldValues>({
                                                                     name,
                                                                     label,
                                                                     required = false,
                                                                     showHelperRow = true,
                                                                     options = [],
                                                                     TextFieldProps,
                                                                     minWidth = 150
                                                                 }: SelectFieldProps<TFieldValues>) => {
    const { t } = useTranslation(["common"]);
    const {
        control,
        formState: { disabled }
    } = useFormContext<TFieldValues>();

    const formattedLabel = required && label ? `${label} *` : label;

    return (
        <Controller
            name={name}
            control={control}
            rules={{
                required: { value: required, message: t("common:form.error.required") },
            }}
            render={({ field: { onChange, value, onBlur, ref }, fieldState: { error } }) => {
                const selectedOption = options.find(opt => opt.value === value) || null;

                return (
                    <Autocomplete
                        sx={{ minWidth }}
                        options={options}
                        disabled={disabled}
                        value={selectedOption}
                        getOptionLabel={(option) => option.label || ""}
                        isOptionEqualToValue={(option, val) => option.value === val?.value}
                        onChange={(_, newValue) => {
                            onChange(newValue ? newValue.value : 0);
                        }}
                        onBlur={onBlur}
                        renderInput={(params) => {
                            const { InputLabelProps, InputProps, inputProps, ...restParams } = params;

                            return (
                                <TextField
                                    {...restParams}
                                    {...TextFieldProps}
                                    inputRef={ref}
                                    label={formattedLabel}
                                    size="small"
                                    fullWidth
                                    error={!!error}
                                    helperText={error?.message ?? (showHelperRow ? " " : "")}
                                    slotProps={{
                                        ...TextFieldProps?.slotProps,
                                        inputLabel: {
                                            ...(TextFieldProps?.slotProps?.inputLabel as object | undefined),
                                            className: InputLabelProps?.className ?? "",
                                        },
                                        input: {
                                            ...(InputProps as object | undefined),
                                            ...(TextFieldProps?.slotProps?.input as object | undefined),
                                        },
                                        htmlInput: {
                                            ...inputProps,
                                            ...(TextFieldProps?.slotProps?.htmlInput as object | undefined),
                                        },
                                        formHelperText: {
                                            ...(TextFieldProps?.slotProps?.formHelperText as object | undefined),
                                            component: (({ children }: { children: React.ReactNode }) =>
                                                    <ErrorFormHelperText isError={!!error}>{children}</ErrorFormHelperText>
                                            ) as React.ElementType,
                                        },
                                    }}
                                />
                            );
                        }}
                        renderOption={(props, option) => {
                            const { key, ...otherProps } = props;
                            return (
                                <Box component="li" key={key} {...otherProps}>
                                    {option.label}
                                </Box>
                            );
                        }}
                    />
                );
            }}
        />
    );
};

export default SelectFieldControlled;