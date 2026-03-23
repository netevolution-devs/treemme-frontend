import {SvgIcon, type SvgIconProps} from '@mui/material';

/**
 * Custom SVG Icons for Leather ERP/Software.
 * All icons follow the Material UI 24x24px grid pattern.
 * Use 'currentColor' to ensure they respect MUI color props.
 */

/** 1. CONTACTS: Stylized person/address book icon */
export const TMContactsIcon = (props: SvgIconProps) => (
    <SvgIcon {...props}>
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </SvgIcon>
);

/** 2. LEATHER (PELLAMI): Custom hide/skin shape specific to the industry */
export const TMLeatherIcon = (props: SvgIconProps) => (
    <SvgIcon {...props}>
        <path d="M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16z" />
    </SvgIcon>
);

/** 3. PRODUCTS: 3D Box/Stack icon */
export const TMProductsIcon = (props: SvgIconProps) => (
    <SvgIcon {...props}>
        <path d="M12 3L2 8l10 5 10-5-10-5zM2 12l10 5 10-5M2 17l10 5 10-5" />
    </SvgIcon>
);

/** 4. ORDERS: Document with checkmark/list */
export const TMOrdersIcon = (props: SvgIconProps) => (
    <SvgIcon {...props}>
        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z" />
    </SvgIcon>
);

/** 5. WAREHOUSE (MAGAZZINO): Shelving/Storage units */
export const TMWarehouseIcon = (props: SvgIconProps) => (
    <SvgIcon {...props}>
        <path d="M20 13H4v-2h16v2zm0-6H4V5h16v2zm0 12H4v-2h16v2zM22 3H2v18h20V3z" />
    </SvgIcon>
);

/** 6. PRODUCTION: Industrial Gear/Factory feel */
export const TMProductionIcon = (props: SvgIconProps) => (
    <SvgIcon {...props}>
        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
    </SvgIcon>
);

/** 7. BILLING (DDT & FATTURE): Document with arrow/transaction indicator */
export const TMBillingIcon = (props: SvgIconProps) => (
    <SvgIcon {...props}>
        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm3.31 15.3l-1.07-1.07L15 17.54V13h-2v4.54l-1.24-1.24L10.69 17.3l3.31 3.31 3.31-3.31zM13 9V3.5L18.5 9H13z" />
    </SvgIcon>
);

/** 8. SALES (COMMERCIALE): Trending up chart icon */
export const TMCommercialIcon = (props: SvgIconProps) => (
    <SvgIcon {...props}>
        <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z" />
    </SvgIcon>
);

/** 9. ANALYSIS (ANALISI): Bar chart inside a square frame */
export const TMAnalysisIcon = (props: SvgIconProps) => (
    <SvgIcon {...props}>
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
    </SvgIcon>
);

/** 10. SYSTEM (SISTEMA): Layout/Dashboard grid icon */
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