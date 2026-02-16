import {AppBar, Avatar, Box, Toolbar} from "@mui/material";
import {MenuEntries} from "@ui/layout/menu/MenuEntries.ts";
import MenuEntry from "@ui/layout/menu/MenuEntry.tsx";

const MenuToolbar = () => {

    const handlePanelOpen = (menu: string) => {
        console.log(`Panel ${menu} opened`);
    }

    // TODO: implement profile routing
    const handleProfileNavigation = () => {
        console.log('Profile navigation clicked');
    }

    return (
        <AppBar>
            <Toolbar disableGutters sx={{px: 1}} variant="dense" >
                <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flex: 1}}>
                    <Box>
                    {MenuEntries.map((entry) => (
                        <MenuEntry
                            key={entry.i18nKey}
                            entry={entry}
                            onClick={handlePanelOpen}
                        />
                    ))}
                    </Box>
                    <Box>
                        <Avatar
                            sx={{width: 35, height: 35}}
                            onClick={handleProfileNavigation}
                        />
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    )
}

export default MenuToolbar;