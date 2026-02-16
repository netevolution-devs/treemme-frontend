import {Outlet} from "react-router";
import {Box, Stack} from "@mui/material";
import MenuToolbar from "@ui/layout/menu/MenuToolbar.tsx";

const Layout = () => {
    return (
        <Box sx={{display: "flex", width: "100%"}}>
            <Stack sx={{flexGrow: 1}}>
                <MenuToolbar />
                <Outlet/>
            </Stack>
        </Box>
    );
};

export default Layout;
