/* eslint-disable react-hooks/exhaustive-deps */
import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useState,
    type ForwardedRef,
    type ReactNode,
} from "react";
import {Dialog, useMediaQuery, useTheme, type SxProps} from "@mui/material";
import type {Theme} from "@emotion/react";
import type {IDialogActions} from "./IDialogActions";

interface BaseDialogProps {
    children: ReactNode;
    isDialogOpen?: (open: boolean) => void;
    sx?: SxProps<Theme> | undefined;
    fullscreen?: boolean | undefined;
    onClose?: () => void;
    minHeight?: number | string;
    minWidth?: number;
    onKeyDown?: (event: React.KeyboardEvent) => void;
}

function BaseDialogWrapper({
                               children,
                               isDialogOpen,
                               sx,
                               fullscreen = false,
                               onClose,
                               minHeight,
                               minWidth = 800,
                               onKeyDown,
                           }: BaseDialogProps,
                           ref: ForwardedRef<IDialogActions>
) {
    const [open, setOpen] = useState<boolean>(false);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    useImperativeHandle(ref, () => ({
        getStatus: open,
        open: () => setOpen(true),
        close: () => setOpen(false),
    }));

    useEffect(() => {
        isDialogOpen?.(open);
    }, [open]);

    const handleClose = () => {
        onClose?.();
        setOpen(false);
    }

    return (
        <Dialog
            fullScreen={isSmallScreen || fullscreen}
            open={open}
            onClose={() => handleClose()}
            onKeyDown={onKeyDown}
            slotProps={{
                paper: {
                    sx: {
                        minWidth: minWidth ? minWidth : 0,
                        borderRadius: isSmallScreen || fullscreen ? 0 : 4,
                        minHeight: minHeight ? minHeight : 0,
                        maxHeight: '90vh',
                        display: 'flex',
                        flexDirection: 'column',
                        ...sx
                    },
                },
            }}
            sx={{m: 2}}
        >
            {children}
        </Dialog>
    );
}

export default forwardRef(BaseDialogWrapper);
