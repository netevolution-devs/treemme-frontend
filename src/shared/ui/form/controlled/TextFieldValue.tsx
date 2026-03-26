import {TextField} from "@mui/material";
import {alpha} from "@mui/material/styles";

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
            sx={{mb: 0.5}}
            slotProps={{
                inputLabel: {
                    shrink: isFilled
                },
                input: {
                    sx: {
                        backgroundColor: theme => alpha(theme.palette.primary.main, 0.1),
                    }
                }
            }}
            disabled
        />
    )
}

export default TextFieldValue