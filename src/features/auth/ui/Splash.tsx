import {Box} from "@mui/material";

const Splash = () => {
    return (
        <Box
            sx={{
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', pb: 4}}>
                {/* <img src={"/imgs/watermark.png"} alt={"logo"} style={{ maxWidth: 400, height: "auto", scale: "125%" }}/> */}
            </Box>
        </Box>
    )
}

export default Splash;
