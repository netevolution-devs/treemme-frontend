import {TextField} from "@mui/material";
import {alpha} from "@mui/material/styles";
import {useMemo} from "react";

interface TextFieldValueProps {
    label: string;
    value: string | number | undefined;
    isFilled?: boolean;
    precision?: number;
}

const TextFieldValue = ({label, value, isFilled, precision}: TextFieldValueProps) => {
    const displayValue = useMemo(() => {
        if (value === undefined || value === null) return "";
        if (typeof value === "number" && precision !== undefined) {
            return value.toFixed(precision);
        }
        return value.toString().toUpperCase();
    }, [value, precision]);

    const shouldShrink = isFilled || (value !== undefined && value !== null && value !== "");

    return (
        <TextField
            label={label}
            value={displayValue}
            sx={{mb: 0.5}}
            slotProps={{
                inputLabel: {
                    shrink: shouldShrink
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