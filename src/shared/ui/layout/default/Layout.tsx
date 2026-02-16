import {Outlet} from "react-router";
import TopBar from "./TopBar.tsx";
import {Box, Stack} from "@mui/material";
import NavBar from "./navbar/NavBar.tsx";
import {useLayout} from "./LayoutContext.tsx";

const Layout = () => {
    const {showNavBar, showTopBar, topBarComponent} = useLayout();
    return (
        <Box sx={{display: "flex", width: "100%"}}>
            {showNavBar && <NavBar/>}
            <Stack sx={{flexGrow: 1}}>
                {showTopBar && (
                    <>
                        {topBarComponent ? topBarComponent : <TopBar/>}
                    </>
                )}
                <Outlet/>
            </Stack>
        </Box>
    );
};

export default Layout;
