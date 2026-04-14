import type {FunctionComponent} from "react";
import type {IDockviewPanelProps} from "dockview";
import CapPanel from "@features/panels/contacts/cap/CapPanel";
import ProvincePanel from "@features/panels/contacts/province/ProvincePanel";
import NationsPanel from "@features/panels/contacts/nations/NationsPanel";
import ContactsPanel from "@features/panels/contacts/contacts/ContactsPanel";
import SeaportsPanel from "@features/panels/contacts/seaports/SeaportsPanel";
import WeightsPanel from "@features/panels/leathers/weights/WeightsPanel";
import SpeciesPanel from "@features/panels/leathers/species/SpeciesPanel";
import LeathersPanel from "@features/panels/leathers/leathers/LeathersPanel";
import ThicknessesPanel from "@features/panels/leathers/thicknesses/ThicknessesPanel";
import TypesPanel from "@features/panels/leathers/types/TypesPanel";
import FlayingPanel from "@features/panels/leathers/flaying/FlayingPanel";
import OriginsPanel from "@features/panels/leathers/origins/OriginsPanel";
import TanningStagesPanel from "@features/panels/leathers/tanning-stages/TanningStagesPanel";
import BatchesPanel from "@features/panels/production/batches/BatchesPanel";
import CustomerOrdersPanel from "@features/panels/orders/customer-orders/CustomerOrdersPanel";
import ProductsPanel from "@features/panels/products/products/ProductsPanel";
import ProductCategoriesPanel from "@features/panels/products/product-categories/ProductCategoriesPanel";
import ProductTypesPanel from "@features/panels/products/product-types/ProductTypesPanel";
import ArticlesPanel from "@features/panels/products/articles/ArticlesPanel";
import MachineryPanel from "@features/panels/production/machinery/MachineryPanel";
import ArticleTypesPanel from "@features/panels/products/article-types/ArticleTypesPanel";
import DeliveryNotesPanel from "@features/panels/shipping-invoicing/delivery-notes/DeliveryNotesPanel";
import ReasonsPanel from "@features/panels/shipping-invoicing/reasons/ReasonsPanel";
import SelectionPanel from "@features/panels/products/selection/SelectionPanel";
import SubcontractingNotReturnedPanel from "@features/panels/shipping-invoicing/subcontracting-not-returned/SubcontractingNotReturnedPanel";
import ProcessesPanel from "@features/panels/production/processes/ProcessesPanel";
import WorkingsPanel from "@features/panels/production/workings/WorkingsPanel";
import CurrenciesExchangePanel from "@features/panels/commercial/currenciesExchange/CurrenciesExchangePanel";
import ArticleColorsPanel from "@features/panels/products/article-colors/ArticleColorsPanel";
import ArticleClassesPanel from "@features/panels/products/article-classes/ArticleClassesPanel";
import DeliveryNotesRowsPanel from "@features/panels/shipping-invoicing/delivery-notes/delivery-notes-row/DeliveryNotesRowsPanel";
import OrderRowsPanel from "@features/panels/orders/customer-orders/order-rows/OrderRowsPanel";
import LotsBatchesPanel from "@features/panels/warehouse/lots-batches/LotsBatchesPanel";
import PaymentTypesPanel from "@features/panels/commercial/payment-types/PaymentTypesPanel";
import ShipmentConditionsPanel from "@features/panels/commercial/shipment-conditions/ShipmentConditionsPanel";
import UsersPanel from "@features/panels/user-management/users/UsersPanel";
import OrganizationManagementPanel from "@features/panels/user-management/organization/OrganizationManagementPanel";
import UserAccessPanel from "@features/panels/user-management/permission (legacy)/UserAccessPanel";
import WorkAreaPanel from "@features/panels/user-management/work-area/WorkAreaPanel";
import ArticleInternalColorsPanel from "@features/panels/products/article-internal-colors/ArticleInternalColorsPanel";
import ArticlePrintsPanel from "@features/panels/products/article-prints/ArticlePrintsPanel";
import PalletsPanel from "@features/panels/warehouse/pallets/PalletsPanel";
import BatchDataPanel from "@features/panels/production/batches/batch-data/BatchDataPanel";

export type TPanelKind =
    | 'cap'
    | 'province'
    | 'nations'
    | 'contacts'
    | 'seaports'
    | 'weights'
    | 'species'
    | 'leathers'
    | 'thicknesses'
    | 'types'
    | 'flaying'
    | 'origins'
    | 'tanningStages'
    | 'batches'
    | 'customerOrders'
    | 'products'
    | 'productCategories'
    | 'productTypes'
    | 'articles'
    | 'machinery'
    | 'articleTypes'
    | 'deliveryNotes'
    | 'deliveryNotesRows'
    | 'orderRows'
    | 'reasons'
    | 'selection'
    | 'subcontractingNotReturned'
    | 'processes'
    | 'workings'
    | 'users'
    | 'user-access-management'
    | 'organization-management'
    | 'functionality-management'
    | 'currenciesExchange'
    | 'articleColors'
    | 'articleClasses'
    | 'lotsBatches'
    | 'paymentTypes'
    | 'shipmentConditions'
    | 'articleInternalColors'
    | 'articlePrints'
    | 'pallets'
    | 'batchData'
    | 'not-implemented';

export type DockviewComponents = Record<TPanelKind, FunctionComponent<IDockviewPanelProps>>;

export const PANEL_REGISTRY: DockviewComponents = {
    // contacts
    contacts:   (props) => <ContactsPanel {...props}/>,
    cap:        () => <CapPanel/>,
    province:   (props) => <ProvincePanel {...props}/>,
    nations:    (props) => <NationsPanel {...props}/>,
    seaports:   () => <SeaportsPanel/>,
    // leathers
    leathers:       (props) => <LeathersPanel {...props}/>,
    weights:        (props) => <WeightsPanel {...props}/>,
    species:        (props) => <SpeciesPanel {...props}/>,
    thicknesses:    (props) => <ThicknessesPanel {...props}/>,
    types:          (props) => <TypesPanel {...props}/>,
    flaying:        (props) => <FlayingPanel {...props}/>,
    tanningStages:  (props) => <TanningStagesPanel {...props}/>,
    origins:        (props) => <OriginsPanel {...props}/>,
    // products
    products:               () => <ProductsPanel/>,
    articles:               (props) => <ArticlesPanel {...props}/>,
    selection:              (props) => <SelectionPanel {...props}/>,
    productCategories:      () => <ProductCategoriesPanel/>,
    productTypes:           () => <ProductTypesPanel/>,
    articleTypes:           (props) => <ArticleTypesPanel {...props}/>,
    articleColors:          (props) => <ArticleColorsPanel {...props}/>,
    articleInternalColors:  (props) => <ArticleInternalColorsPanel {...props}/>,
    articleClasses:         (props) => <ArticleClassesPanel {...props}/>,
    articlePrints:          (props) => <ArticlePrintsPanel {...props}/>,
    // orders
    customerOrders: () => <CustomerOrdersPanel/>,
    orderRows:      (props) => <OrderRowsPanel {...props}/>,
    // warehouse
    lotsBatches:    () => <LotsBatchesPanel />,
    pallets:        () => <PalletsPanel />,
    // production
    batches:    (props) => <BatchesPanel {...props}/>,
    machinery:  () => <MachineryPanel/>,
    processes:  () => <ProcessesPanel />,
    workings:   () => <WorkingsPanel />,
    batchData:  (props) => <BatchDataPanel {...props}/>,
    // ddt
    deliveryNotes:              () => <DeliveryNotesPanel />,
    deliveryNotesRows:          (props) => <DeliveryNotesRowsPanel {...props}/>,
    reasons:                    () => <ReasonsPanel />,
    subcontractingNotReturned:  () => <SubcontractingNotReturnedPanel />,
    // commercial
    currenciesExchange: () => <CurrenciesExchangePanel />,
    paymentTypes:       (props) => <PaymentTypesPanel {...props}/>,
    shipmentConditions: (props) => <ShipmentConditionsPanel {...props}/>,
    // system
    "users": () => <UsersPanel />,
    "user-access-management": () => <UserAccessPanel />,
    "organization-management": () => <OrganizationManagementPanel />,
    "functionality-management": () => <WorkAreaPanel />,
    "not-implemented": () => <>To implement</>,
}