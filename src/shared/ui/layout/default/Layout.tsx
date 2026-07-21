import {Outlet, useLocation} from "react-router";
import {Box, Stack} from "@mui/material";
import MenuToolbar from "@ui/layout/menu/MenuToolbar";
import PanelContainerPage from "@features/panels/PanelContainerPage";
import {useLayoutEffect} from "react";
import {useMenuStore} from "@ui/layout/default/layoutStore";

const Layout = () => {
    const location = useLocation();
    const {showMenu, hideMenu} = useMenuStore();
    const isAppRoute = location.pathname === "/app";

    useLayoutEffect(() => {
        if (isAppRoute) {
            showMenu();
        } else {
            hideMenu();
        }
    }, [isAppRoute, showMenu, hideMenu]);

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
