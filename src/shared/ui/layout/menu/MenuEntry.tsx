import { Button, Menu, MenuItem, Typography, Box } from "@mui/material";
import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state";
import { useTranslation } from "react-i18next";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import type {IMenuEntry} from "@ui/layout/menu/MenuEntries.ts";

interface MenuEntryProps {
    entry: IMenuEntry;
    isSubMenu?: boolean;
}

const MenuEntry = ({ entry, isSubMenu = false }: MenuEntryProps) => {
    const { t } = useTranslation(["menu"]);

    if (!entry.subMenu || entry.subMenu.length === 0) {
        return (
            <MenuItem
                onClick={() => {

                }}
            >
                {t(entry.i18nKey || "")}
            </MenuItem>
        );
    }

    return (
        <PopupState variant="popover" popupId={entry.i18nKey}>
            {(popupState) => (
                <Box component="div" sx={{ display: 'inline-block' }}>
                    {isSubMenu ? (
                        <MenuItem
                            {...bindTrigger(popupState)}
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                minWidth: '180px',
                                '&:hover': { backgroundColor: 'action.hover' }
                            }}
                        >
                            <Typography variant="inherit">{t(entry.i18nKey || "")}</Typography>
                            <ChevronRightIcon fontSize="small" sx={{ ml: 2 }} />
                        </MenuItem>
                    ) : (
                        <Button
                            {...bindTrigger(popupState)}
                            color="inherit"
                            variant="contained"
                            sx={{ mx: 0.5, whiteSpace: 'nowrap' }}
                        >
                            {t(entry.i18nKey || "")}
                        </Button>
                    )}

                    {entry?.subMenu && entry.subMenu.length > 0 && (
                        <Menu
                            {...bindMenu(popupState)}
                            anchorOrigin={{
                                vertical: isSubMenu ? 'top' : 'bottom',
                                horizontal: isSubMenu ? 'right' : 'left'
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left'
                            }}
                            disableScrollLock
                        >
                            {entry?.subMenu.map((subEntry, index) => (
                                <MenuEntry
                                    key={`${subEntry.i18nKey}-${index}`}
                                    entry={subEntry}
                                    isSubMenu={true}
                                />
                            ))}
                        </Menu>
                    )}
                </Box>
            )}
        </PopupState>
    );
};

export default MenuEntry;