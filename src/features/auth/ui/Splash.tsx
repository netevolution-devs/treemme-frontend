import {Box, useTheme} from "@mui/material";

const Splash = () => {
    const theme = useTheme();
    const isSmallScreen = theme.breakpoints.down('sm');

    return (
        <Box
            sx={{
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', pb: 4}}>
                <img src={"/imgs/watermark.png"} alt={"logo"} style={{ maxWidth: isSmallScreen ? 400 : "auto", height: "auto", scale: "125%" }}/>
            </Box>
        </Box>
    )
}

export default Splash;
