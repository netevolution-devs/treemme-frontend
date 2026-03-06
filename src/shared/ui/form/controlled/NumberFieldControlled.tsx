import { useTranslation } from "react-i18next";
import { TextField, InputAdornment, Typography } from "@mui/material";
import { Controller, type FieldValues, useFormContext, type Path, type PathValue, type RegisterOptions } from "react-hook-form";
import type { ControlledFieldProps } from "@ui/form/controlled/ControlledFieldProps.ts";

interface NumberFieldProps<TFieldValues extends FieldValues> extends ControlledFieldProps<TFieldValues> {
    precision?: number;
    step?: number;
    maxWidth?: number | string;
    min?: number;
    max?: number;
    startAdornment?: React.ReactNode;
}

const NumberFieldControlled = <TFieldValues extends FieldValues>({
                                                                     name,
                                                                     label,
                                                                     required = false,
                                                                     showHelperRow = true,
                                                                     precision = 2,
                                                                     step = 1,
                                                                     maxWidth = '100%',
                                                                     min = 0,
                                                                     max,
                                                                     startAdornment,
                                                                 }: NumberFieldProps<TFieldValues>) => {
    const { t } = useTranslation(["common"]);
    const { control, setValue, getValues, formState: { disabled } } = useFormContext<TFieldValues>();

    const formattedLabel = required && label ? `${label} *` : label;

    const toFixedString = (val: string | number | null | undefined): string => {
        if (val === null || val === undefined || val === "") return "";
        const num = typeof val === "string" ? parseFloat(val) : val;
        return isNaN(num) ? "" : num.toFixed(precision);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
            const rawValue = getValues(name);
            const currentValue = !rawValue || isNaN(parseFloat(String(rawValue)))
                ? 0
                : parseFloat(String(rawValue));

            let newValue = e.key === 'ArrowUp' ? currentValue + step : currentValue - step;

            if (newValue < min) newValue = min;
            if (max !== undefined && newValue > max) newValue = max;

            setValue(
                name as Path<TFieldValues>,
                toFixedString(newValue) as PathValue<TFieldValues, Path<TFieldValues>>,
                { shouldValidate: true, shouldDirty: true }
            );
        }
    };

    const rules: RegisterOptions<TFieldValues, Path<TFieldValues>> = {
        required: { value: required, message: t("common:form.error.required") },
        min: { value: min, message: `${t("common:form.error.min")} ${min}` },
    };

    if (max !== undefined) {
        rules.max = { value: max, message: `${t("common:form.error.max")} ${max}` };
    }

    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field: { onChange, onBlur, value, ...field }, fieldState: { error } }) => {
                const displayValue = (value === undefined || value === null)
                    ? ""
                    : (typeof value === 'number' ? toFixedString(value) : value);

                const getHelperText = () => {
                    if (error) return error.message;
                    return showHelperRow ? " " : "";
                };

                return (
                    <TextField
                        {...field}
                        value={displayValue}
                        label={formattedLabel}
                        size="small"
                        fullWidth
                        disabled={disabled}
                        error={!!error}
                        onKeyDown={handleKeyDown}
                        onBlur={() => {
                            if (displayValue !== "" && displayValue !== "-") {
                                let num = parseFloat(String(displayValue));
                                if (!isNaN(num)) {
                                    if (num < min) num = min;
                                    if (max !== undefined && num > max) num = max;
                                    onChange(toFixedString(num));
                                }
                            } else if (displayValue === "-") {
                                onChange("");
                            }
                            onBlur();
                        }}
                        onChange={(e) => {
                            const val = e.target.value.replace(',', '.');
                            const regex = min >= 0 ? /^\d*\.?\d*$/ : /^-?\d*\.?\d*$/;

                            if (val === "" || (min < 0 && val === "-") || regex.test(val)) {
                                if (val !== "" && val !== "-" && max !== undefined && parseFloat(val) > max) return;

                                onChange(val);
                            }
                        }}
                        placeholder={toFixedString(0)}
                        helperText={getHelperText()}
                        InputProps={{
                            startAdornment: startAdornment ? (
                                <InputAdornment position="start">
                                    <Typography color="textSecondary">
                                        {startAdornment}
                                    </Typography>
                                </InputAdornment>
                            ) : undefined,
                            endAdornment: max !== undefined ? (
                                <InputAdornment position="end">
                                    <Typography color="textSecondary">
                                        / {max}
                                    </Typography>
                                </InputAdornment>
                            ) : undefined,
                        }}
                        slotProps={{
                            htmlInput: {
                                maxLength: 255,
                                min: min,
                                max: max,
                                inputMode: "decimal"
                            },
                            inputLabel: { shrink: (displayValue !== "" || !!startAdornment) || undefined },
                            formHelperText: {
                                sx: {
                                    textAlign: 'left',
                                    fontFamily: 'monospace'
                                }
                            }
                        }}
                        sx={{
                            maxWidth
                        }}
                    />
                );
            }}
        />
    );
};

export default NumberFieldControlled;