import type {ReactNode} from "react";
import {Fade, FormHelperText} from "@mui/material";

interface Props {
    children: ReactNode,
    isError: boolean
}

const ErrorFormHelperText = ({isError, children}: Props) => {
    return (
        <Fade in={isError}>
            <FormHelperText sx={{fontSize: "0.7rem", mt: 0.3}}>
                {children}
            </FormHelperText>
        </Fade>
    )
}
export default ErrorFormHelperText
