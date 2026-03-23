import type {TPanelKind} from "@features/panels/PanelRegistry.tsx";
import type {MenuIconKey} from "@ui/layout/menu/MenuIcons.tsx";

export interface IMenuEntry {
    i18nKey: string;
    subMenu?: IMenuEntry[];
    component?: TPanelKind;
    icon?: MenuIconKey;
}

export const MenuEntries: IMenuEntry[] = [
    {
        i18nKey: "menu.contacts.self",
        icon: "CONTACTS",
        subMenu: [
            {i18nKey: "menu.contacts.contacts", component: "contacts"},
            {i18nKey: "menu.contacts.cap", component: "cap"},
            {i18nKey: "menu.contacts.nations", component: "nations"},
            {i18nKey: "menu.contacts.provinces", component: "province"},
            {i18nKey: "menu.contacts.seaports", component: "seaports"}
        ]
    },
    {
        i18nKey: "menu.leathers.self",
        icon: "LEATHERS",
        subMenu: [
            {i18nKey: "menu.leathers.leathers", component: "leathers"},
            {i18nKey: "menu.leathers.weights", component: "weights"},
            {i18nKey: "menu.leathers.species", component: "species"},
            // {i18nKey: "menu.leathers.sizes", component: "sizes" },
            {i18nKey: "menu.leathers.thicknesses", component: "thicknesses"},
            {i18nKey: "menu.leathers.types", component: "types"},
            {i18nKey: "menu.leathers.flaying", component: "flaying"},
            {i18nKey: "menu.leathers.origins", component: "origins"},
            {i18nKey: "menu.leathers.tanning-stages", component: "tanningStages"},
        ]
    },
    {
        i18nKey: "menu.products.self",
        icon: "PRODUCTS",
        subMenu: [
            {i18nKey: "menu.products.products", component: "products"},
            {i18nKey: "menu.products.articles", component: "articles"},
            {i18nKey: "menu.products.selection", component: "selection" },
            // {i18nKey: "menu.products.search"},
            {i18nKey: "menu.products.categories", component: "productCategories"},
            {i18nKey: "menu.products.products-types", component: "productTypes"},
            {i18nKey: "menu.products.article-types", component: "articleTypes"},
        ]
    },
    {
        i18nKey: "menu.orders.self",
        icon: "ORDERS",
        subMenu: [
            {i18nKey: "menu.orders.customer-orders", component: "customerOrders"},
            // {i18nKey: "menu.orders.supplier-orders"},
            // {i18nKey: "menu.orders.search-customer-orders"},
            // {i18nKey: "menu.orders.supplier-schedule"},
            // {i18nKey: "menu.orders.search-supplier-orders"}
        ]
    },
    {
        i18nKey: "menu.warehouse.self",
        icon: "WAREHOUSE",
        subMenu: [
            {i18nKey: "to-implement"},
            // {i18nKey: "menu.warehouse.movements"},
            // {i18nKey: "menu.warehouse.pallet-types"},
            // {i18nKey: "menu.warehouse.lots-batches"},
            // {i18nKey: "menu.warehouse.search-lots-batches"},
            // {i18nKey: "menu.warehouse.subcontracting-lots"}
        ]
    },
    {
        i18nKey: "menu.production.self",
        icon: "PRODUCTION",
        subMenu: [
            {i18nKey: "menu.production.batches", component: "batches"},
            // {i18nKey: "menu.production.recipes"},
            {i18nKey: "menu.production.machinery", component: "machinery"},
            // {i18nKey: "menu.production.progress"},
            {i18nKey: "menu.production.processes", component: "processes" },
            {i18nKey: "menu.production.workings", component: "workings" },
            // {i18nKey: "menu.production.bom"},
            // {i18nKey: "menu.production.batch-selection"},
            // {i18nKey: "menu.production.pirovano-monitor"},
            // {i18nKey: "menu.production.pirovano-recipes"}
        ]
    },
    {
        i18nKey: "menu.shipping-invoicing.self",
        icon: "SHIPPING-INVOICING",
        subMenu: [
            {i18nKey: "menu.shipping-invoicing.delivery-notes", component: "deliveryNotes"},
            {i18nKey: "menu.shipping-invoicing.reasons", component: "reasons"},
            // {i18nKey: "menu.shipping-invoicing.invoices"},
            // {i18nKey: "menu.shipping-invoicing.search"},
            { i18nKey: "menu.shipping-invoicing.subcontracting-not-returned", component: "subcontractingNotReturned" },
        ]
    },
    {
        i18nKey: "menu.commercial.self",
        icon: "COMMERCIAL",
        subMenu: [
            {i18nKey: "to-implement"},
            // {i18nKey: "menu.commercial.customers"},
            // {i18nKey: "menu.commercial.suppliers"},
            // {i18nKey: "menu.commercial.batch-data"},
            // {i18nKey: "menu.commercial.product-costs"},
            // {i18nKey: "menu.commercial.price-list"},
            // {i18nKey: "menu.commercial.work-reports"},
            // {i18nKey: "menu.commercial.currencies-exchange"}
        ]
    },
    {
        i18nKey: "menu.analysis.self",
        icon: "ANALYSIS",
        subMenu: [
            {i18nKey: "to-implement"},
            // {i18nKey: "menu.analysis.orders"},
            // {i18nKey: "menu.analysis.sales"},
            // {i18nKey: "menu.analysis.costs-revenues"},
            // {i18nKey: "menu.analysis.batches-lots"},
            // {i18nKey: "menu.analysis.subcontracting"},
            // {i18nKey: "menu.analysis.phone-traffic"},
            // {
            //     i18nKey: "menu.analysis.iso-quality.self",
            //     subMenu: [
            //         {i18nKey: "menu.analysis.iso-quality.order-fulfillment"},
            //     ]
            // },
        ]
    },
    {
        i18nKey: "menu.system.self",
        icon: "SYSTEM",
        subMenu: [
            {i18nKey: "to-implement"},
            // {i18nKey: "menu.system.info"},
            // {i18nKey: "menu.system.tools"},
            // {i18nKey: "menu.system.console"},
            // {i18nKey: "menu.system.access-management"},
            // {i18nKey: "menu.system.logout"},
        ]
    }
];