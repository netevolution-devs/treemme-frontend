import type {PropsWithChildren} from "react";
import {Box, type Breakpoint, Container, LinearProgress, type SxProps} from "@mui/material";

interface BasePageProps {
    maxWidth?: Breakpoint;
    isLoading?: boolean;
    fullwidth?: boolean;
    disablePaddingBottom?: boolean;
    disablePaddingRight?: boolean;
    sx?: SxProps | undefined;
}

const BasePage = ({
    children,
    maxWidth,
    isLoading,
    fullwidth = false,
    disablePaddingBottom = false,
    disablePaddingRight = false,
    sx
}: PropsWithChildren<BasePageProps>) => {

    return (
        <Box>
            <Container
                disableGutters
                maxWidth={fullwidth ? false : maxWidth || "lg"}
                sx={{
                    position: "relative",
                    pt: 2,
                    pb: disablePaddingBottom ? 0 : 3,
                    pr: disablePaddingRight ? 0 : 3,
                    pl: 3,
                    ...sx,
                }}
            >
                <Box sx={{height: 5}}>
                    {isLoading && (
                        <LinearProgress />
                    )}
                </Box>
                {children}
            </Container>
        </Box>
    );
};

export default BasePage;
