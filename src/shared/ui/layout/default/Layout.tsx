import {Outlet, useLocation} from "react-router";
import {Box, Stack} from "@mui/material";
import MenuToolbar from "@ui/layout/menu/MenuToolbar.tsx";
import PanelContainerPage from "@features/panels/PanelContainerPage.tsx";
import {useEffect} from "react";
import {useMenuStore} from "@ui/layout/default/layoutStore.ts";

const Layout = () => {
    const location = useLocation();
    const {showMenu} = useMenuStore();
    const isAppRoute = location.pathname === "/app";

    useEffect(() => {
        if (isAppRoute) {
            showMenu();
        }
    }, [isAppRoute, showMenu]);

    return (
        <Box sx={{display: "flex", width: "100%"}}>
            <Stack sx={{flexGrow: 1}}>
                <MenuToolbar />
                <Box sx={{ display: isAppRoute ? 'block' : 'none' }}>
                    <PanelContainerPage />
                </Box>
                <Box sx={{ display: !isAppRoute ? 'block' : 'none' }}>
                    <Outlet/>
                </Box>
            </Stack>
        </Box>
    );
};

export default Layout;
