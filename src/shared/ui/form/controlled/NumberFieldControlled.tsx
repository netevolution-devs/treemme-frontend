import { useTranslation } from "react-i18next";
import { TextField } from "@mui/material";
import { Controller, type FieldValues, useFormContext, type Path, type PathValue } from "react-hook-form";
import type { ControlledFieldProps } from "@ui/form/controlled/ControlledFieldProps.ts";

interface NumberFieldProps<TFieldValues extends FieldValues> extends ControlledFieldProps<TFieldValues> {
    precision?: number;
    step?: number;
    maxWidth?: number | string;
}

const NumberFieldControlled = <TFieldValues extends FieldValues>({
                                                                     name,
                                                                     label,
                                                                     required = false,
                                                                     showHelperRow = true,
                                                                     precision = 2,
                                                                     step = 1,
                                                                     maxWidth = '100%',
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

            const newValue = e.key === 'ArrowUp' ? currentValue + step : currentValue - step;

            setValue(
                name as Path<TFieldValues>,
                toFixedString(newValue) as PathValue<TFieldValues, Path<TFieldValues>>,
                { shouldValidate: true }
            );
        }
    };

    return (
        <Controller
            name={name}
            control={control}
            rules={{
                required: { value: required, message: t("common:form.error.required") },
            }}
            render={({ field: { onChange, onBlur, value, ...field }, fieldState: { error } }) => {
                const displayValue = typeof value === 'number'
                    ? toFixedString(value)
                    : (value as string ?? "");

                return (
                    <TextField
                        {...field}
                        value={displayValue}
                        label={formattedLabel}
                        size="small"
                        disabled={disabled}
                        error={!!error}
                        onKeyDown={handleKeyDown}
                        onBlur={() => {
                            if (displayValue !== "") {
                                onChange(toFixedString(displayValue));
                            }
                            onBlur();
                        }}
                        onChange={(e) => {
                            const val = e.target.value.replace(',', '.');
                            if (val === "" || val === "-" || /^-?\d*\.?\d*$/.test(val)) {
                                onChange(val);
                            }
                        }}
                        placeholder={toFixedString(0)}
                        helperText={error?.message ?? (showHelperRow ? " " : "")}
                        slotProps={{
                            input: { inputMode: "decimal" },
                            htmlInput: { maxLength: 255 },
                            inputLabel: { shrink: !!displayValue || undefined }
                        }}
                        sx={{
                            maxWidth,
                        }}
                    />
                );
            }}
        />
    );
};

export default NumberFieldControlled;