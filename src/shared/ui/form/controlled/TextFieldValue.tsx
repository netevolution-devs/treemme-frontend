import {TextField} from "@mui/material";

interface TextFieldValueProps {
    label: string;
    value: string | number | undefined;
    isFilled?: boolean;
    precision?: number;
}

const TextFieldValue = ({label, value, isFilled, precision}: TextFieldValueProps) => {
    let displayValue: string | number = "";

    if (isFilled && value !== undefined) {
        if (typeof value === "number" && precision !== undefined) {
            displayValue = value.toFixed(precision);
        } else {
            displayValue = value;
        }
    }
    return (
        <TextField
            label={label}
            value={displayValue}
            sx={{pb: 2}}
            slotProps={{
                inputLabel: {
                    shrink: isFilled
                }
            }}
            disabled
        />
    )
}

export default TextFieldValue