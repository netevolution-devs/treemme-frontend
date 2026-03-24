import {SvgIcon, type SvgIconProps} from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

/**
 * Custom SVG Icons for Leather ERP/Software.
 * All icons follow the Material UI 24x24px grid pattern.
 * Use 'currentColor' to ensure they respect MUI color props.
 */

/** CONTACTS: Stylized person/address book icon */
export const TMContactsIcon = (props: SvgIconProps) => (
    <PeopleAltIcon {...props}/>
);

/** LEATHER: Custom hide/skin shape specific to the industry */
export const TMLeatherIcon = (props: SvgIconProps) => (
    <SvgIcon
        {...props}
        viewBox="0 0 2048 2048"
    >
        <path
            fill="currentColor"
            d="M 826.112 150.303 C 850.025 149.6 877.113 150.209 901.243 150.19 L 1047.5 150.151 L 1153.52 150.191 C 1176.27 150.138 1211.18 147.665 1233.57 153.905 C 1239.31 155.504 1247.63 164.928 1250.27 170.53 C 1258.64 188.337 1263.17 208.452 1271.8 226.292 C 1299.31 286.571 1345.6 336.872 1404.68 366.867 C 1475.54 402.836 1557.3 401.073 1631.46 377.034 C 1653.08 370.519 1673.11 360.717 1694.16 352.712 C 1712.57 345.711 1730.32 352.088 1740.71 368.566 C 1749.67 382.774 1757.57 397.559 1765.96 412.019 C 1783.53 442.156 1800.85 472.432 1817.94 502.845 C 1837.45 537.436 1860.81 564.036 1819.78 592.892 C 1806.44 602.276 1789.91 616.09 1777.38 626.733 C 1737.5 661.184 1703.59 701.994 1677.03 747.511 C 1574.91 919.537 1594 1159.95 1723.39 1312.32 C 1745.23 1338.04 1769.04 1362.02 1794.6 1384.05 C 1808.6 1395.9 1824.58 1406.69 1837.77 1419.34 C 1847.99 1429.15 1850.18 1443.95 1844.68 1456.95 C 1837.2 1474.63 1827.95 1491.69 1819 1508.83 C 1804.01 1537.81 1788.78 1566.67 1773.31 1595.39 C 1734.34 1667.93 1741.13 1686.75 1653.45 1653.59 C 1456.47 1579.08 1260.8 1634.83 1142.76 1811.47 C 1132.12 1828.96 1123.56 1846.97 1114.62 1865.33 C 1109.08 1876.73 1102.08 1886.48 1089.6 1890.64 C 1074.02 1895.83 985.843 1895.88 967.749 1893.15 C 960.382 1892.04 950.676 1889.43 945.024 1884.56 C 931.761 1873.12 922.745 1845.31 913.653 1829.4 C 873.303 1758.22 812.667 1700.68 739.481 1664.11 C 650.362 1620.03 548.297 1609.69 452.151 1635.02 C 420.158 1643.17 389.821 1654.77 358.765 1665.53 C 345.768 1670.04 331.571 1672.52 319.175 1665.53 C 313.363 1662.35 307.376 1657.11 303.893 1651.39 C 288.954 1626.85 275.756 1600.51 262.501 1575.05 C 248.588 1548.46 235.063 1521.68 221.931 1494.7 C 211.909 1473.92 193.32 1444.55 210.046 1423.1 C 217.64 1413.36 228.069 1406.11 237.584 1398.3 C 291.123 1354.26 339.526 1302.28 373.666 1241.79 C 490.703 1034.44 446.676 759.203 254.644 612.69 C 243.036 603.834 224.063 590.209 214.588 579.645 C 210.784 575.453 208.08 570.382 206.72 564.887 C 201.565 544.595 216.144 525.049 225.867 508.031 L 253.757 459.254 C 270.232 430.477 286.016 401.212 302.682 372.57 C 324.311 335.399 354.961 353.476 385.081 366.06 C 446.461 391.706 509.356 402.487 575.088 387.865 C 659.134 369.169 731.002 309.601 769.532 233.314 C 774.962 222.571 779.761 211.52 783.902 200.217 C 793.919 173.403 793.858 156.609 826.112 150.303 z"
        />
    </SvgIcon>
);

/** PRODUCTS: inventory material icon */
export const TMProductsIcon = (props: SvgIconProps) => (
    <InventoryIcon {...props}/>
);

/** ORDERS: Document with checkmark/list */
export const TMOrdersIcon = (props: SvgIconProps) => (
    <SvgIcon {...props}>
        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z" />
    </SvgIcon>
);

/** WAREHOUSE (MAGAZZINO): Shelving/Storage units */
export const TMWarehouseIcon = (props: SvgIconProps) => (
    <SvgIcon {...props}>
        <path d="M20 13H4v-2h16v2zm0-6H4V5h16v2zm0 12H4v-2h16v2zM22 3H2v18h20V3z" />
    </SvgIcon>
);

/** PRODUCTION: Industrial Gear/Factory feel */
export const TMProductionIcon = (props: SvgIconProps) => (
    <SvgIcon {...props}>
        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
    </SvgIcon>
);

/** BILLING (DDT & FATTURE): Document with arrow/transaction indicator */
export const TMBillingIcon = (props: SvgIconProps) => (
    <SvgIcon {...props}>
        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm3.31 15.3l-1.07-1.07L15 17.54V13h-2v4.54l-1.24-1.24L10.69 17.3l3.31 3.31 3.31-3.31zM13 9V3.5L18.5 9H13z" />
    </SvgIcon>
);

/** SALES (COMMERCIALE): Trending up chart icon */
export const TMCommercialIcon = (props: SvgIconProps) => (
    <SvgIcon {...props}>
        <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z" />
    </SvgIcon>
);

/** ANALYSIS (ANALISI): Bar chart inside a square frame */
export const TMAnalysisIcon = (props: SvgIconProps) => (
    <SvgIcon {...props}>
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
    </SvgIcon>
);

/** SYSTEM (SISTEMA): Layout/Dashboard grid icon */
export const TMSystemIcon = (props: SvgIconProps) => (
    <SvgIcon {...props}>
        <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.24 2 14 2h-4c-.24 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.25.42.49.42h4c.24 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
    </SvgIcon>
);

// --- HELPER TYPES & MAPPING ---

export type MenuIconKey =
    | 'CONTACTS'
    | 'LEATHERS'
    | 'PRODUCTS'
    | 'ORDERS'
    | 'WAREHOUSE'
    | 'PRODUCTION'
    | 'SHIPPING-INVOICING'
    | 'COMMERCIAL'
    | 'ANALYSIS'
    | 'SYSTEM';

/**
 * Registry to map menu items to their respective icons dynamically.
 */
export const MenuIconMap: Record<MenuIconKey, React.ElementType<SvgIconProps>> = {
    "CONTACTS": TMContactsIcon,
    "LEATHERS": TMLeatherIcon,
    "PRODUCTS": TMProductsIcon,
    "ORDERS": TMOrdersIcon,
    "WAREHOUSE": TMWarehouseIcon,
    "PRODUCTION": TMProductionIcon,
    "SHIPPING-INVOICING": TMBillingIcon,
    "COMMERCIAL": TMCommercialIcon,
    "ANALYSIS": TMAnalysisIcon,
    "SYSTEM": TMSystemIcon,
};