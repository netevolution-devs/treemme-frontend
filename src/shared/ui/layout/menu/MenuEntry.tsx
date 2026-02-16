import {Button, Menu, MenuItem, Box, Typography} from "@mui/material";
import PopupState, {bindMenu, bindTrigger} from "material-ui-popup-state";
import {useTranslation} from "react-i18next";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import type {IMenuEntry} from "@ui/layout/menu/MenuEntries.ts";

interface MenuEntryProps {
    entry: IMenuEntry;
    isSubMenu?: boolean;
    onClick?: (key: string) => void;
}

const MenuEntry = ({entry, isSubMenu = false, onClick}: MenuEntryProps) => {
    const {t} = useTranslation(["menu"]);

    if (!entry.subMenu || entry.subMenu.length === 0) {
        return (
            <MenuItem
                onClick={() => {
                    if (onClick && entry.i18nKey) {
                        onClick(entry.i18nKey);
                    }
                }}
            >
                {t(entry.i18nKey || "")}
            </MenuItem>
        );
    }

    return (
        <PopupState variant="popover" popupId={entry.i18nKey}>
            {(popupState) => (
                <Box component="div" sx={{display: 'inline-block'}}>
                    {isSubMenu ? (
                        <MenuItem
                            {...bindTrigger(popupState)}
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                minWidth: '180px',
                                '&:hover': {backgroundColor: 'action.hover'}
                            }}
                        >
                            <Typography variant="inherit">{t(entry.i18nKey || "")}</Typography>
                            <ChevronRightIcon fontSize="small" sx={{ml: 2}}/>
                        </MenuItem>
                    ) : (
                        <Button {...bindTrigger(popupState)} color="inherit" variant={"text"}>
                            {t(entry.i18nKey || "")}
                        </Button>
                    )}

                    <Menu
                        {...bindMenu(popupState)}
                        anchorOrigin={{
                            vertical: isSubMenu ? 'top' : 'bottom',
                            horizontal: isSubMenu ? 'right' : 'left'
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