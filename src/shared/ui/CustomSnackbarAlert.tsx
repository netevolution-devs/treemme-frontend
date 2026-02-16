import {forwardRef} from 'react';
import {type CustomContentProps as NOTISTACKCustomContentProps, SnackbarContent} from 'notistack';
import {Alert} from "@mui/material";


const CustomSnackbarAlert = forwardRef<HTMLDivElement, NOTISTACKCustomContentProps>(({
                                                                                         message,
                                                                                         id,
                                                                                         variant: severity,
                                                                                         ...customContentProps
                                                                                     }: NOTISTACKCustomContentProps, ref) => {
    //Remove incompatible props to prevent overlap
    const {
        autoHideDuration,
        anchorOrigin,
        hideIconVariant,
        iconVariant,
        persist,
        ...restCustomContentProps
    } = customContentProps;
    void autoHideDuration
    void anchorOrigin
    void hideIconVariant
    void iconVariant
    void persist

    return (
        <SnackbarContent ref={ref} id={String(id)} role="alert"  {...restCustomContentProps}>
            <Alert severity={severity === "default" ? "info" : severity} variant={"filled"}>
                {message}
            </Alert>
        </SnackbarContent>
    );
});


export default CustomSnackbarAlert;
