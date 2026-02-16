import {useMemo, useState} from "react";
import {
    Avatar,
    Box,
    Chip,
    Divider,
    Drawer as MuiDrawer,
    IconButton,
    List,
    ListItemButton,
    Skeleton,
    Typography,
    useTheme,
    styled,
    type Theme,
    type CSSObject,
} from "@mui/material";
import {useLocation, useNavigate} from "react-router";
import {useBackofficeNavBarItemList} from "./defaultNavBarItemList.ts";
import NavItem from "./NavItem.tsx";
import NavItemList from "./NavItemList.tsx";
import {useAuth} from "@features/auth/model/AuthContext.tsx";
import {MenuSharp} from "@mui/icons-material";
import CloseIcon from '@mui/icons-material/Close';
import {handleTopItemClick} from "@ui/layout/logic/handleNavItemClick.ts";
import type {INavBarItem} from "@ui/layout/model/NavBarInterfaces.ts";

const drawerWidth = 280;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
})(({theme}) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    variants: [
        {
            props: ({open}) => open,
            style: {
                ...openedMixin(theme),
                "& .MuiDrawer-paper": openedMixin(theme),
            },
        },
        {
            props: ({open}) => !open,
            style: {
                ...closedMixin(theme),
                "& .MuiDrawer-paper": closedMixin(theme),
            },
        },
    ],
}));

const NavBar = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const {user, isLoading: isLoadingUser} = useAuth();

    // Initialize from localStorage directly (runs once on mount)
    const [open, setOpen] = useState(() => localStorage.getItem("default-drawer-open") === "true");

    const handleDrawerToggle = () => {
        const newOpen = !open;
        setOpen(newOpen);
        localStorage.setItem("default-drawer-open", newOpen ? "true" : "false");
    };

    const backofficeNavBarItemList = useBackofficeNavBarItemList();

    // Derive selectedIndex directly from location - no need for state/effect
    const selectedIndex = useMemo(() => {
        const idx = backofficeNavBarItemList.findIndex((entry) => location.pathname.startsWith(entry.to));
        return idx >= 0 ? idx : undefined;
    }, [location.pathname, backofficeNavBarItemList]);


    // Pair each item with its original index, then group by "group"
    const groupedItems = useMemo(() => {
        const pairs = backofficeNavBarItemList.map((entry, index) => ({entry, index}));
        const map = new Map<string, { entry: INavBarItem, index: number }[]>();
        for (const p of pairs) {
            const key = p.entry.group ?? "menu.group._default";
            if (!map.has(key)) map.set(key, []);
            map.get(key)!.push(p);
        }
        return Array.from(map.entries());
    }, [backofficeNavBarItemList]);

    return (
        <Drawer
            variant="permanent"
            open={open}
            sx={{
                display: {xs: "none", lg: "block"}, // solo desktop
            }}
            slotProps={{
                paper: {
                    sx: {
                        // background: theme.palette.background.layout || theme.palette.background.paper,
                        border: 0,
                        color: theme.palette.text.primary,
                    },
                },
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: open ? "space-between" : "center",
                    p: 2,
                    height: 54,
                }}
            >
                {open && (
                    <Typography variant="h6" fontWeight={700} noWrap>
                        ATELIERS Veneti
                    </Typography>
                )}
                <IconButton color="inherit" onClick={handleDrawerToggle} size="small">
                    {open ? <CloseIcon fontSize="small"/> : <MenuSharp/>}
                </IconButton>
            </Box>

            <Divider/>

            {/* Menu Items */}
            <List sx={{flex: 1, px: 1, flexGrow: 1}}>
                {groupedItems.map(([groupKey, itemsInGroup]) => (
                    <Box key={groupKey}>
                        {itemsInGroup.map(({entry, index}) => (
                            entry.subMenus && entry.subMenus.length > 0 ? (
                                <NavItemList
                                    key={`list-${index}-${entry.primaryNameKey}`}
                                    isNavBarOpen={open}
                                    entryObj={entry as Required<INavBarItem>}
                                    index={index}
                                    selectedIndex={selectedIndex}
                                    expanded={entry.alwaysOpen ?? false}
                                />
                            ) : (
                                <NavItem
                                    key={`item-${index}-${entry.primaryNameKey}`}
                                    entryObj={entry}
                                    index={index}
                                    selectedIndex={selectedIndex}
                                    onClick={() => handleTopItemClick({
                                        to: entry.to,
                                        navigate
                                    })}
                                    isNavBarOpen={open}
                                />
                            )
                        ))}
                    </Box>
                ))}
            </List>

            {/* User block at bottom */}
            <Box
                sx={{
                    p: 1,
                    borderTop: `1px solid ${theme.palette.divider}`,
                }}
                onClick={() => navigate("/profile")}
            >
                {isLoadingUser && <Skeleton variant="rectangular" height={56}/>}
                {!isLoadingUser && user && (
                    <ListItemButton
                        sx={{
                            p: 1.5,
                            borderRadius: 2,
                            // justifyContent: open ? "initial" : "center",
                            bgcolor: theme.palette.mode === "dark"
                                ? theme.palette.background.default
                                : theme.palette.action.selected,
                            "&:hover": {
                                bgcolor: theme.palette.action.hover,
                            },
                        }}
                    >
                        <Avatar
                            sx={{
                                width: open ? 36 : 24,
                                height: open ? 36 : 24,
                                mr: open ? 1.5 : 0,
                            }}
                        >
                            {user.name[0].toUpperCase()}
                        </Avatar>
                        {open && (
                            <Box>
                                <Typography variant="body2" fontWeight={600}>
                                    {user.name}
                                </Typography>
                                <Chip
                                    label={user.roles[0].role.name}
                                    size="small"
                                    color="primary"
                                    sx={{height: 20}}
                                />
                            </Box>
                        )}
                    </ListItemButton>
                )}
            </Box>
        </Drawer>
    );
};

export default NavBar;
