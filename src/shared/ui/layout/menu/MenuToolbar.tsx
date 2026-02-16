import {AppBar, Toolbar} from "@mui/material";
import {MenuEntries} from "@ui/layout/menu/MenuEntries.ts";
import MenuEntry from "@ui/layout/menu/MenuEntry.tsx";

const MenuToolbar = () => {
    return (
        <AppBar>
            <Toolbar>
                {MenuEntries.map((entry) => (
                    <MenuEntry
                        key={entry.i18nKey}
                        entry={entry}
                    />
                ))}
            </Toolbar>
        </AppBar>
    )
}

export default MenuToolbar;