import {AppBar, Box, Toolbar} from "@mui/material";
import UiControls from "@ui/UiControls.tsx";
import {Typography, IconButton, Breadcrumbs, Link} from "@mui/material";
import {useLocation, useNavigate} from "react-router";
import {useTranslation} from "react-i18next";
import {useBackofficeNavBarItemList} from "./navbar/defaultNavBarItemList.ts";
import type {INavBarItem} from "../model/NavBarInterfaces.ts";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {useLayout} from "@ui/layout/default/LayoutContext.tsx";

interface Props {
    hidden?: boolean;
}

const TopBar = ({hidden}: Props) => {
    const location = useLocation();
    const {t} = useTranslation(["common"]);
    const navigate = useNavigate();

    const backofficeNavBarItemList = useBackofficeNavBarItemList();

    const {enableBackNavigation, setEnableBackNavigation, setBackPath, pageName, backPath} = useLayout();

    const handleBack = () => {
        navigate(backPath);
        setEnableBackNavigation(false);
        setBackPath("");
    }

    const path = location.pathname;

    const currentTitle = (() => {
        const findInTree = (items: readonly INavBarItem[]) => {
            for (const item of items) {
                if (item.to === path) return item.primaryNameKey;
                if (item.subMenus?.length) {
                    const exactSub = item.subMenus.find(sub => sub.to === path);
                    if (exactSub) return exactSub.primaryNameKey;

                    const startsWithSub = item.subMenus.find(sub => path.startsWith(sub.to));
                    if (startsWithSub) return startsWithSub.primaryNameKey;
                }
            }
            return items.find(it => path.startsWith(it.to))?.primaryNameKey;
        };

        const key = findInTree(backofficeNavBarItemList);
        return key ? t(key) : undefined;
    })();;

    return (
        <AppBar position="sticky" sx={{
            display: hidden ? "none" : "block",
            borderBottom: '1px solid',
            borderColor: theme => theme.palette.divider,
            height: 55
        }} elevation={0}>
            <Toolbar sx={{alignItems: "center", justifyContent: "space-between",}} variant="dense">
                <Box sx={{minWidth: 0, overflow: "hidden", display: 'flex', alignItems: 'center', height: 45}}>
                    {enableBackNavigation ? (
                        <>
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={handleBack}
                                aria-label="go back"
                            >
                                <ArrowBackIcon/>
                            </IconButton>
                            <Breadcrumbs>
                                <Link
                                    title={currentTitle}
                                    underline="hover"
                                    noWrap
                                    color="inherit"
                                    onClick={() => handleBack()}
                                    sx={{cursor: "pointer"}}
                                >
                                    {currentTitle}
                                </Link>
                                <Typography noWrap title={pageName} sx={{color: 'text.primary'}}>
                                    {pageName}
                                </Typography>
                            </Breadcrumbs>
                        </>
                    ) : (
                        <Typography variant="h6" noWrap title={currentTitle}>
                            {currentTitle}
                        </Typography>
                    )}
                </Box>
                <Box sx={{justifyContent: "end"}}>
                    <UiControls showLogoutButton={false} showLanguageSelector={false}/>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default TopBar;
