import {TextField, type TextFieldProps} from "@mui/material";
import type {ChangeEvent} from "react";

interface TextFieldFilterProps extends Omit<TextFieldProps, 'onChange' | 'value'> {
    value: string | undefined;
    onFilterChange: (newValue: string | undefined) => void;
}

const TextFieldFilter = ({ value, onFilterChange, ...props }: TextFieldFilterProps) => {

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const val = event.target.value;
        onFilterChange(val || undefined);
    };

    return (
        <TextField
            {...props}
            value={value ?? ""}
            onChange={handleChange}
            size="small"
            variant="outlined"
            onBlur={(e) => onFilterChange(e.target.value.trim() || undefined)}
        />
    );
};

export default TextFieldFilter;