import type {SvgIconTypeMap, SxProps} from "@mui/material";
import type {OverridableComponent} from "@mui/material/OverridableComponent";
import type {IPermissionGuardProps} from "@features/routing/useHasPermission.ts";

export type MUINavIcon = OverridableComponent<SvgIconTypeMap> & {
    muiName: string;
}

export interface INavBarItem {
    primaryNameKey: string,
    secondaryNameKey?: string,
    to: string,
    icon: OverridableComponent<SvgIconTypeMap> & {
        muiName: string;
    },
    subMenus?: INavBarItem[],
    permissionGuardProps?: IPermissionGuardProps,
    // Optional group label key for sectioning
    group?: string,
    disabled?: boolean,
    alwaysOpen?: boolean,
}


export interface NabBarItemProps {
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
