import type {SxProps, TableContainerProps, Theme} from "@mui/material";

export const getMrtContainerProps = (theme: Theme, overrideProps?: TableContainerProps): TableContainerProps => {
    const baseSx: SxProps<Theme> = {
        borderRadius: 1,
        overflowX: 'auto',
        overflowY: 'auto',
        minHeight: 320,
        scrollbarWidth: 'thin',
        scrollbarColor: `${theme.palette.text.disabled} transparent`,
    };

    return {
        sx: {
            ...baseSx,
            ...(overrideProps?.sx || {}),
        } as SxProps<Theme>,
    };
};