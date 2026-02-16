import {useMemo, useState} from "react";
import NavItem from "./NavItem.tsx";
import {Collapse, List, ListItem, useTheme} from "@mui/material";
import {useLocation, useNavigate} from "react-router";
import type {INavBarItem} from "../../model/NavBarInterfaces.ts";
import PermissionGuard from "@features/routing/PermissionGuard.tsx";
import {handleTopItemClick} from "@ui/layout/logic/handleNavItemClick.ts";

interface Props {
    entryObj: Required<INavBarItem>
    isNavBarOpen: boolean,
    index: number
    selectedIndex: number | undefined
    expanded?: boolean
}

const NavItemList = ({isNavBarOpen, entryObj, selectedIndex, index, expanded = false}: Props) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [wasManuallyClosed, setWasManuallyClosed] = useState<boolean>(false);

    const selectedSubIndex = useMemo(() => {
        if (selectedIndex !== index || location.pathname === "/") {
            return undefined;
        }
        const subIndex = entryObj.subMenus?.findIndex(subEntry => subEntry.to === location.pathname);
        return subIndex !== undefined && subIndex >= 0 ? subIndex : undefined;
    }, [location.pathname, entryObj.subMenus, selectedIndex, index]);

    // Derive isExpanded from location and other dependencies
    const isExpanded = useMemo(() => {
        if (location.pathname === "/") {
            return false;
        }
        const isSubMenuActive = entryObj.subMenus?.some(subEntry => subEntry.to === location.pathname);
        if (isSubMenuActive) {
            return true;
        }
        if (selectedIndex !== index) {
            return !wasManuallyClosed && expanded;
        }
        return !wasManuallyClosed && expanded;
    }, [location.pathname, entryObj.subMenus, selectedIndex, index, expanded, wasManuallyClosed]);

    const handleExpand = () => {
        const nextExpandedState = !isExpanded;
        if (!nextExpandedState) {
            setWasManuallyClosed(true);
        } else {
            setWasManuallyClosed(false);
        }
    };

    const handleSubListItemClick = (to: string) => {
        handleTopItemClick({to, navigate});
    };

    return (
        <PermissionGuard {...entryObj.permissionGuardProps}>
            <ListItem slots={{root: "span"}}>
                <List disablePadding={true} sx={{mb: 1.5}}>
                    <NavItem
                        entryObj={entryObj}
                        index={index}
                        selectedIndex={selectedIndex}
                        onClick={handleExpand}
                        isExpanded={isExpanded}
                        isNavBarOpen={isNavBarOpen}
                        isExpandable={true}
                        isSubItem={false}
                        sx={{
                            borderBottomLeftRadius: isExpanded ? isNavBarOpen ? "8px" : 0 : "8px",
                            borderBottomRightRadius: isExpanded ? 0 : "8px",
                        }}
                    />
                    <Collapse
                        in={isExpanded}
                        sx={{
                            ml: isNavBarOpen ? 4 : 0,
                            mr: 0.1,
                            borderBottomLeftRadius: isNavBarOpen ? 0 : "8px",
                            borderBottomRightRadius: isNavBarOpen ? 0 : "8px",
                            border: isNavBarOpen ? "none" : "1px solid",
                            borderLeft: isNavBarOpen ? "2px solid" : "1px solid",
                            borderRight: "none",
                            borderColor: theme.palette.divider,
                        }}>
                        {entryObj.subMenus?.map((subEntryObj, subIndex) => (
                            <NavItem
                                key={`${subEntryObj.primaryNameKey}-${subIndex}`}
                                entryObj={subEntryObj}
                                index={subIndex}
                                selectedIndex={selectedSubIndex}
                                onClick={() => handleSubListItemClick(subEntryObj.to)}
                                isNavBarOpen={isNavBarOpen}
                                isSubItem={true}
                                sx={entryObj.subMenus.length === subIndex + 1 ? {
                                    borderBottomRightRadius: "8px",
                                    borderBottomLeftRadius: isNavBarOpen ? 0 : "8px"
                                } : {}}
                            />
                        ))}
                    </Collapse>
                </List>
            </ListItem>
        </PermissionGuard>
    );
};

export default NavItemList;
