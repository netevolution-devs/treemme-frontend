import { Controller, type FieldValues, useFormContext } from "react-hook-form";
import type { ControlledFieldProps } from "@ui/form/controlled/ControlledFieldProps";
import { useTranslation } from "react-i18next";
import { Autocomplete, TextField, Box, Chip } from "@mui/material";
import ErrorFormHelperText from "@ui/form/ErrorFormHelperText";

interface MultiSelectFieldProps<TFieldValues extends FieldValues> extends ControlledFieldProps<TFieldValues> {
    options: { value: string | number; label: string }[];
    minWidth?: number | string;
    deactivated?: boolean;
}

const MultiSelectFieldControlled = <TFieldValues extends FieldValues>({
                                                                          name,
                                                                          label,
                                                                          required = false,
                                                                          showHelperRow = false,
                                                                          options = [],
                                                                          TextFieldProps,
                                                                          minWidth = 150,
                                                                          deactivated = false,
                                                                      }: MultiSelectFieldProps<TFieldValues>) => {
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
                const selectedValues = typeof value === 'string' && value ? value.split(',') : [];
                const selectedOptions = options.filter(opt => selectedValues.includes(String(opt.value)));

                return (
                    <Autocomplete
                        multiple
                        sx={{ minWidth, width: "100%" }}
                        options={options}
                        disabled={disabled || deactivated}
                        value={selectedOptions}
                        noOptionsText={t("common:search.no-options")}
                        getOptionLabel={(option) => (option.label || "").toUpperCase()}
                        isOptionEqualToValue={(option, val) => String(option.value) === String(val?.value)}
                        onChange={(_, newValue) => {
                            const stringValue = newValue.map(opt => opt.value).join(',');
                            onChange(stringValue || null);
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
                                    sx={{ mb: 1.2 }}
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
                                            sx: {
                                                textTransform: "uppercase",
                                                backgroundColor: "transparent",
                                            },
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
                        renderTags={(tagValue, getTagProps) =>
                            tagValue.map((option, index) => {
                                const { key, ...tagProps } = getTagProps({ index });
                                return (
                                    <Chip
                                        key={key}
                                        color={"primary"}
                                        sx={{fontSize: 12, p: 0, m: 0}}
                                        label={option.label.toUpperCase()}
                                        size="small"
                                        {...tagProps}
                                    />
                                );
                            })
                        }
                        renderOption={(props, option) => {
                            const { key, ...otherProps } = props;
                            return (
                                <Box component="li" key={key} {...otherProps} sx={{ textTransform: "uppercase" }}>
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

export default MultiSelectFieldControlled;