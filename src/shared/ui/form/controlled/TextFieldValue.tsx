import {TextField} from "@mui/material";

interface TextFieldValueProps {
    label: string;
    value: string | number | undefined;
    isFilled?: boolean;
}

const TextFieldValue = ({label, value, isFilled}: TextFieldValueProps) => {
    return (
        <TextField
            label={label}
            value={isFilled ? value : ""}
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