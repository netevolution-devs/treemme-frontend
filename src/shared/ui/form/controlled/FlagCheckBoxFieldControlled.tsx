import { Controller, type FieldValues, useFormContext } from "react-hook-form";
import type { ControlledFieldProps } from "@ui/form/controlled/ControlledFieldProps";
import { Checkbox, FormControlLabel, FormGroup, FormHelperText, Box } from "@mui/material";
import ErrorFormHelperText from "@ui/form/ErrorFormHelperText";

interface FlagCheckBoxFieldProps<TFieldValues extends FieldValues> extends ControlledFieldProps<TFieldValues> {
    width?: number;
    disabled?: boolean;
}

const FlagCheckBoxFieldControlled = <TFieldValues extends FieldValues>({
                                                                           name,
                                                                           label,
                                                                           showHelperRow = false,
                                                                           width,
                                                                           disabled: customDisabled = false,
                                                                        }: FlagCheckBoxFieldProps<TFieldValues>) => {
    const {
        control,
        formState: { disabled }
    } = useFormContext<TFieldValues>();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => {
                return (
                    <Box sx={{ display: 'flex', flexDirection: 'column', mb: 0.4 }}>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={!!value}
                                        onChange={(e) => onChange(e.target.checked)}
                                        onBlur={onBlur}
                                        disabled={disabled || customDisabled}
                                        size="small"
                                    />
                                }
                                label={label}
                                sx={{
                                    '& .MuiFormControlLabel-label': {
                                        fontSize: '0.875rem',
                                    },
                                    width: width || "200px"
                                }}
                            />
                        </FormGroup>
                        {error ? (
                            <ErrorFormHelperText isError={!!error}>
                                {error.message}
                            </ErrorFormHelperText>
                        ) : (
                            showHelperRow && <FormHelperText sx={{ mt: 0, fontSize: "0.7rem" }}>{" "}</FormHelperText>
                        )}
                    </Box>
                );
            }}
        />
    );
};

export default FlagCheckBoxFieldControlled;
