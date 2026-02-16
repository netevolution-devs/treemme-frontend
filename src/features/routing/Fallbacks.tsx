import {Box, Button, CircularProgress, Stack, Typography} from "@mui/material";
import {Link} from "react-router";

export const GenericFallbackElement = () => (
    <Stack sx={{alignItems: 'center', p: 4, gap: 2}}>
        <Typography variant="h6">Access restricted</Typography>
        <Typography variant="body2">You may not have the required permissions.</Typography>
        <Button component={Link} to="/login" variant="outlined">Go to Login</Button>
    </Stack>
);


export const AuthFetchingScreen = () => (
    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', p: 6, minHeight: 600, height: "100dvh"}}>
        <CircularProgress color={"primary"}/>
    </Box>
);
