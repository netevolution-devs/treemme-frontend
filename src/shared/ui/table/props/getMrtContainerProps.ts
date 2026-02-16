import type {SxProps, TableContainerProps, Theme} from "@mui/material";

export const getMrtContainerProps = (theme: Theme, overrideProps?: TableContainerProps): TableContainerProps => {
    const baseSx: SxProps<Theme> = {
        borderRadius: 1,
        overflowX: 'auto',
        borderBottom: `1px solid ${theme.palette.tableColors.border}`,
        scrollbarWidth: 'thin',
        scrollbarColor: `${theme.palette.primary.main} ${theme.palette.background.default}`,
    };

    return {
        sx: {
            ...baseSx,
            ...(overrideProps?.sx || {}),
        } as SxProps<Theme>,
    };
};