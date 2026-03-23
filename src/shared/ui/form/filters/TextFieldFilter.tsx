import { TextField, type TextFieldProps, IconButton, InputAdornment } from "@mui/material";
import { useEffect, useState, type ChangeEvent } from "react";
import ClearIcon from "@mui/icons-material/Clear";

interface TextFieldFilterProps extends Omit<TextFieldProps, 'onChange' | 'value'> {
    value: string | undefined;
    onFilterChange: (newValue: string | undefined) => void;
}

const TextFieldFilter = ({ value, onFilterChange, ...props }: TextFieldFilterProps) => {
    const [localValue, setLocalValue] = useState<string>(value ?? "");
    const [prevValue, setPrevValue] = useState<string | undefined>(value);

    if (value !== prevValue) {
        setLocalValue(value ?? "");
        setPrevValue(value);
    }

    useEffect(() => {
        if (localValue === (value ?? "")) return;

        const handler = setTimeout(() => {
            onFilterChange(localValue || undefined);
        }, 500);

        return () => clearTimeout(handler);
    }, [localValue, onFilterChange, value]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setLocalValue(event.target.value);
    };

    const handleClear = () => {
        setLocalValue("");
        onFilterChange(undefined);
    };

    const handleBlur = () => {
        const trimmed = localValue.trim();
        if (trimmed !== localValue) {
            setLocalValue(trimmed);
        }
        onFilterChange(trimmed || undefined);
    };

    return (
        <TextField
            {...props}
            value={localValue}
            onChange={handleChange}
            onBlur={handleBlur}
            size="small"
            variant="outlined"
            slotProps={{
                input: {
                    endAdornment: (
                        <InputAdornment
                            position="end"
                            style={{
                                visibility: localValue ? "visible" : "hidden",
                                pointerEvents: localValue ? "auto" : "none"
                            }}
                        >
                            <IconButton
                                aria-label="clear filter"
                                onClick={handleClear}
                                edge="end"
                                size="small"
                            >
                                <ClearIcon fontSize="small" />
                            </IconButton>
                        </InputAdornment>
                    ),
                },
            }}
        />
    );
};

export default TextFieldFilter;