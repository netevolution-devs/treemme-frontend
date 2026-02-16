import {ListItemButton, ListItemIcon, ListItemText, type SxProps, Tooltip, useTheme} from "@mui/material";
import {createElement} from "react";
import {useTranslation} from "react-i18next";
import PermissionGuard from "@features/routing/PermissionGuard.tsx";
import {ExpandMore, ExpandLess} from "@mui/icons-material";
import type {INavBarItem} from "../../model/NavBarInterfaces.ts";

interface NavItemProps {
    entryObj: INavBarItem
    index: number
    selectedIndex: number | undefined
    onClick: () => void
    isNavBarOpen?: boolean
    isExpandable?: boolean
    isExpanded?: boolean
    isSubItem?: boolean
    sx?: SxProps
}

interface ListItemProps extends NavItemProps {
    primaryName: string,
    secondaryName: string,
}

const ListItem = ({
                      selectedIndex,
                      entryObj,
                      index,
                      onClick,
                      isNavBarOpen = true,
                      isExpandable = false,
                      isExpanded = false,
                      primaryName, secondaryName,
                      sx
                  }
                  : ListItemProps) => {
    const theme = useTheme();

    return (
        <ListItemButton
            onClick={onClick}
            sx={{...sx}}
            disabled={entryObj.disabled ?? false}
        >
            <ListItemIcon sx={{
                color: selectedIndex === index ? theme.palette.text.primary : "none",
                minWidth: isNavBarOpen ? 40 : 0,
                mr: isNavBarOpen ? 1 : 0,
                display: "flex",
                justifyContent: "center"
            }}>
                {createElement(entryObj.icon)}
            </ListItemIcon>
            {isNavBarOpen &&
                <ListItemText
                    primary={primaryName}
                    secondary={secondaryName}
                />
            }
            {isNavBarOpen && isExpandable && (isExpanded ? <ExpandLess/> : <ExpandMore/>)}
        </ListItemButton>
    )
}


const NavItem = (props: NavItemProps) => {
    const {
        selectedIndex,
        entryObj,
        index,
        isNavBarOpen = true,
        isExpandable = false,
        isExpanded = false,
        isSubItem = false,
    } = props
    const {t} = useTranslation(["common"])
    const theme = useTheme();

    const generalStyle: SxProps = {
        backgroundColor: selectedIndex === index
            ? theme.palette.mode === "dark"
                ? "primary.dark"
                : "primary.light"
            : "",
        px: isNavBarOpen ? 2 : 1.5,
        '&:hover': {
            backgroundColor: selectedIndex === index
                ? (theme.palette.mode === "dark" ? theme.palette.primary.dark : theme.palette.primary.light)
                : undefined
        },
    }

    const subItemStyle: SxProps = {
        ...generalStyle,
    }

    const itemStyle: SxProps = {
        ...generalStyle,
        borderRadius: 1,
        border: "1px solid",
        borderColor: theme.palette.divider,
        mb: 1.4,
    }


    const expandableStyle: SxProps = {
        ...generalStyle,
        border: "1px solid",
        borderBottom: isNavBarOpen
            ? "1px solid"
            : isExpanded
                ? "none"
                : "1px solid",
        borderColor: theme.palette.divider,
        borderRadius: 1,
        borderBottomRightRadius: isExpanded
            ? 0
            : isNavBarOpen
                ? "8px"
                : 0,
        borderBottomLeftRadius: isNavBarOpen
            ? "8px"
            : isExpanded
                ? 0
                : "8px",
        transition: theme.transitions.create(
            ["border-radius", "border-bottom-left-radius", "border-bottom-right-radius"],
            {
                //fast when opening, slow when closing
                duration: (isNavBarOpen && isExpanded) ? theme.transitions.duration.shortest : 1500,
                easing: isExpanded ? theme.transitions.easing.easeOut : theme.transitions.easing.sharp,
            }
        ),
    }

    const style = isExpandable
        ? expandableStyle
        : isSubItem
            ? subItemStyle
            : itemStyle;

    const primaryName = t(entryObj.primaryNameKey)
    const secondaryName = t(entryObj?.secondaryNameKey ?? "")

    return (
        <PermissionGuard {...entryObj.permissionGuardProps}>
            {isNavBarOpen ? (
                <ListItem {...{
                    ...props,
                    sx: {...style, ...props.sx},
                    primaryName, secondaryName
                }}/>
            ) : (
                <Tooltip
                    placement={"right"}
                    title={t(entryObj.primaryNameKey)}
                    children={
                        <div>
                            <ListItem {...{...props, sx: {...style, ...props.sx}, primaryName, secondaryName}}/>
                        </div>
                    }
                    slotProps={{
                        popper: {
                            modifiers: [
                                {
                                    name: "offset",
                                    options: {
                                        offset: [0, -8]
                                    }
                                }
                            ]
                        }
                    }}
                />
            )}
        </PermissionGuard>
    )
}

export default NavItem
