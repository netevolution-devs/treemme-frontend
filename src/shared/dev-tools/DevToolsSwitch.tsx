import {Box, FormControlLabel, Switch, Typography} from "@mui/material";

interface Props {
    title: string;
    description: string;
    value: boolean;
    onChange: () => void;
}

const DevToolsSwitch = ({title, description, value, onChange}: Props) => {
    return (
        <FormControlLabel
            control={
                <Switch
                    checked={value}
                    onChange={onChange}
                    color="primary"
                />
            }
            label={
                <Box>
                    <Typography variant="body2">{title}</Typography>
                    <Typography variant="caption" color="text.secondary" component={"div"}>{description}</Typography>
                </Box>
            }
        />
    )
}

export default DevToolsSwitch;
