import type {TPanelKind} from "@features/panels/PanelRegistry";
import type {MenuIconKey} from "@ui/layout/menu/MenuIcons";
import type {IPermissionCheck} from "@features/authz/permission.utils";

export interface IMenuEntry {
    i18nKey: string;
    subMenu?: IMenuEntry[];
    component?: TPanelKind;
    icon?: MenuIconKey;
    permissionCheck?: IPermissionCheck;
}

export const MenuEntries: IMenuEntry[] = [
    {
        i18nKey: "menu.contacts.self",
        permissionCheck: {resource: "contatti", action: "get"},
        icon: "CONTACTS",
        subMenu: [
            {
                i18nKey: "menu.contacts.contacts",
                component: "contacts",
                permissionCheck: {resource: "contatti - contatti", action: "get"}
            },
            {
                i18nKey: "menu.contacts.cap",
                component: "cap",
                permissionCheck: {resource: "contatti - cap", action: "get"}
            },
            {
                i18nKey: "menu.contacts.nations",
                component: "nations",
                permissionCheck: {resource: "contatti - nazioni", action: "get"}
            },
            {
                i18nKey: "menu.contacts.provinces",
                component: "province",
                permissionCheck: {resource: "contatti - province", action: "get"}
            },
            {
                i18nKey: "menu.contacts.seaports",
                component: "seaports",
                permissionCheck: {resource: "contatti - porti marittimi", action: "get"}
            }
        ]
    },
    {
        i18nKey: "menu.leathers.self",
        icon: "LEATHERS",
        permissionCheck: {resource: "pellami", action: "get"},
        subMenu: [
            {i18nKey: "menu.leathers.leathers", component: "leathers", permissionCheck: {resource: "pellami - pellami", action: "get"}},
            {i18nKey: "menu.leathers.weights", component: "weights", permissionCheck: {resource: "pellami - pesi", action: "get"}},
            {i18nKey: "menu.leathers.species", component: "species", permissionCheck: {resource: "pellami - specie", action: "get"}},
            // {i18nKey: "menu.leathers.sizes", component: "sizes" },
            {i18nKey: "menu.leathers.thicknesses", component: "thicknesses", permissionCheck: {resource: "pellami - spessori", action: "get"}},
            {i18nKey: "menu.leathers.types", component: "types", permissionCheck: {resource: "pellami - tipologie", action: "get"}},
            {i18nKey: "menu.leathers.flaying", component: "flaying", permissionCheck: {resource: "pellami - scuoiature", action: "get"}},
            {i18nKey: "menu.leathers.origins", component: "origins", permissionCheck: {resource: "pellami - provenienze", action: "get"}},
            {i18nKey: "menu.leathers.tanning-stages", component: "tanningStages", permissionCheck: {resource: "pellami - stati di lavorazione", action: "get"}},
        ]
    },
    {
        i18nKey: "menu.products.self",
        icon: "PRODUCTS",
        permissionCheck: {resource: "prodotti", action: "get"},
        subMenu: [
            // {i18nKey: "menu.products.products", component: "products", permissionCheck: {resource: "prodotti - prodotti", action: "get"}},
            {i18nKey: "menu.products.articles", component: "articles", permissionCheck: {resource: "prodotti - articoli", action: "get"}},
            {i18nKey: "menu.products.selection", component: "selection", permissionCheck: {resource: "prodotti - scelte", action: "get"}},
            // {i18nKey: "menu.products.search"},
            // {i18nKey: "menu.products.categories", component: "productCategories", permissionCheck: {resource: "prodotti - categorie", action: "get"}},
            // {i18nKey: "menu.products.products-types", component: "productTypes", permissionCheck: {resource: "prodotti - tipologie prodotti", action: "get"}},
            {i18nKey: "menu.products.article-types", component: "articleTypes", permissionCheck: {resource: "prodotti - tipologie articoli", action: "get"}},
            {i18nKey: "menu.products.article-colors", component: "articleColors"},
            {i18nKey: "menu.products.article-classes", component: "articleClasses"},
        ]
    },
    {
        i18nKey: "menu.orders.self",
        icon: "ORDERS",
        permissionCheck: {resource: "ordini", action: "get"},
        subMenu: [
            {i18nKey: "menu.orders.customer-orders", component: "customerOrders", permissionCheck: {resource: "ordini - ordini clienti", action: "get"}},
            // {i18nKey: "menu.orders.supplier-orders"},
            // {i18nKey: "menu.orders.search-customer-orders"},
            // {i18nKey: "menu.orders.supplier-schedule"},
            // {i18nKey: "menu.orders.search-supplier-orders"}
        ]
    },
    {
        i18nKey: "menu.warehouse.self",
        icon: "WAREHOUSE",
        permissionCheck: {resource: "magazzino", action: "get"},
        subMenu: [
            // {i18nKey: "menu.warehouse.movements"},
            // {i18nKey: "menu.warehouse.pallet-types"},
            {i18nKey: "menu.warehouse.lots-batches", component: "lotsBatches" },
            // {i18nKey: "menu.warehouse.search-lots-batches"},
            // {i18nKey: "menu.warehouse.subcontracting-lots"}
        ]
    },
    {
        i18nKey: "menu.production.self",
        icon: "PRODUCTION",
        permissionCheck: {resource: "produzione", action: "get"},
        subMenu: [
            {i18nKey: "menu.production.batches", component: "batches", permissionCheck: {resource: "produzione - lotti", action: "get"}},
            // {i18nKey: "menu.production.recipes"},
            {i18nKey: "menu.production.machinery", component: "machinery", permissionCheck: {resource: "produzione - macchinari", action: "get"}},
            // {i18nKey: "menu.production.progress"},
            {i18nKey: "menu.production.processes", component: "processes", permissionCheck: {resource: "produzione - produzione", action: "get"}},
            {i18nKey: "menu.production.workings", component: "workings", permissionCheck: {resource: "produzione - lavorazioni", action: "get"}},
            // {i18nKey: "menu.production.bom"},
            // {i18nKey: "menu.production.batch-selection"},
            // {i18nKey: "menu.production.pirovano-monitor"},
            // {i18nKey: "menu.production.pirovano-recipes"}
        ]
    },
    {
        i18nKey: "menu.shipping-invoicing.self",
        icon: "SHIPPING-INVOICING",
        permissionCheck: {resource: "ddt & fatture", action: "get"},
        subMenu: [
            {i18nKey: "menu.shipping-invoicing.delivery-notes", component: "deliveryNotes", permissionCheck: {resource: "ddt & fatture - documenti di trasporto", action: "get"}},
            {i18nKey: "menu.shipping-invoicing.reasons", component: "reasons", permissionCheck: {resource: "ddt & fatture - ragioni di trasporto", action: "get"}},
            // {i18nKey: "menu.shipping-invoicing.invoices"},
            // {i18nKey: "menu.shipping-invoicing.search"},
            {i18nKey: "menu.shipping-invoicing.subcontracting-not-returned", component: "subcontractingNotReturned", permissionCheck: {resource: "ddt & fatture - lotti conto lavoro", action: "get"}},
        ]
    },
    {
        i18nKey: "menu.commercial.self",
        icon: "COMMERCIAL",
        permissionCheck: {resource: "commerciale", action: "get"},
        subMenu: [
            // {i18nKey: "menu.commercial.customers"},
            // {i18nKey: "menu.commercial.suppliers"},
            // {i18nKey: "menu.commercial.batch-data"},
            // {i18nKey: "menu.commercial.product-costs"},
            // {i18nKey: "menu.commercial.price-list"},
            // {i18nKey: "menu.commercial.work-reports"},
            {i18nKey: "menu.commercial.currencies-exchange", component: "currenciesExchange"},
            {i18nKey: "menu.commercial.payment-types", component: "paymentTypes" },
            {i18nKey: "menu.commercial.shipment-conditions", component: "shipmentConditions" }
        ]
    },
    {
        i18nKey: "menu.analysis.self",
        icon: "ANALYSIS",
        permissionCheck: {resource: "analisi", action: "get"},
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
        permissionCheck: {resource: "sistema", action: "get"},
        subMenu: [
            // {i18nKey: "menu.system.info"},
            // {i18nKey: "menu.system.tools"},
            // {i18nKey: "menu.system.console"},
            {i18nKey: "menu.system.users", component: "users", permissionCheck: {resource: "sistema - permessi", action: "get"}},
            {i18nKey: "menu.system.organization", component: "organization-management", permissionCheck: {resource: "sistema - permessi", action: "get"}},
            {i18nKey: "menu.system.functionality", component: "functionality-management", permissionCheck: {resource: "sistema - permessi", action: "get"}},
            // {i18nKey: "menu.system.logout"},
        ]
    }
];