import {Button, Menu, MenuItem, Box, Typography} from "@mui/material";
import PopupState, {bindMenu, bindTrigger} from "material-ui-popup-state";
import {useTranslation} from "react-i18next";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import type {IMenuEntry} from "@ui/layout/menu/MenuEntries.ts";
import {MenuIconMap} from "@ui/layout/menu/MenuIcons.tsx";
// Import the icon map

interface MenuEntryProps {
    entry: IMenuEntry;
    isSubMenu?: boolean;
    onClick?: (key: IMenuEntry) => void;
}

const MenuEntry = ({entry, isSubMenu = false, onClick}: MenuEntryProps) => {
    const {t} = useTranslation(["menu"]);

    // Resolve the icon component if present in the entry config
    const IconComponent = entry.icon ? MenuIconMap[entry.icon] : null;

    // Case: Final Leaf Node (No Submenu)
    if (!entry.subMenu || entry.subMenu.length === 0) {
        return (
            <MenuItem
                onClick={() => {
                    if (onClick && entry.i18nKey) {
                        onClick(entry);
                    }
                }}
            >
                {/* Render icon in the final menu item if available */}
                {IconComponent && <IconComponent sx={{ fontSize: 18, mr: 1.5, opacity: 0.7 }} />}
                {t(entry.i18nKey || "")}
            </MenuItem>
        );
    }

    // Case: Parent Node (Has Submenu)
    return (
        <PopupState variant="popover" popupId={entry.i18nKey}>
            {(popupState) => (
                <Box component="div" sx={{display: 'inline-block'}}>
                    {isSubMenu ? (
                        /* Recursive sub-menu trigger */
                        <MenuItem
                            {...bindTrigger(popupState)}
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                minWidth: '200px',
                                '&:hover': {backgroundColor: 'action.hover'}
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {IconComponent && <IconComponent sx={{ fontSize: 18, mr: 1.5, opacity: 0.7 }} />}
                                <Typography variant="inherit">{t(entry.i18nKey || "")}</Typography>
                            </Box>
                            <ChevronRightIcon fontSize="small" sx={{ml: 2}}/>
                        </MenuItem>
                    ) : (
                        /* Top-level AppBar Button */
                        <Button
                            {...bindTrigger(popupState)}
                            color="inherit"
                            variant={"text"}
                            startIcon={IconComponent ? <IconComponent sx={{ fontSize: 20, mr: -0.7 }} /> : null}
                        >
                            {t(entry.i18nKey || "")}
                        </Button>
                    )}

                    <Menu
                        {...bindMenu(popupState)}
                        anchorOrigin={{
                            vertical: isSubMenu ? 'top' : 'bottom',
                            horizontal: isSubMenu ? 'right' : 'left'
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                    >
                        {entry.subMenu && entry.subMenu.map((subEntry, index) => (
                            <MenuEntry
                                key={`${subEntry.i18nKey}-${index}`}
                                entry={subEntry}
                                isSubMenu={true}
                                onClick={(key) => {
                                    onClick?.(key);
                                    popupState.close();
                                }}
                            />
                        ))}
                    </Menu>
                </Box>
            )}
        </PopupState>
    );
};

export default MenuEntry;