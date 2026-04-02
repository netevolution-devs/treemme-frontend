import type {FunctionComponent} from "react";
import type {IDockviewPanelProps} from "dockview";
import CapPanel from "@features/panels/contacts/cap/CapPanel.tsx";
import ProvincePanel from "@features/panels/contacts/province/ProvincePanel.tsx";
import NationsPanel from "@features/panels/contacts/nations/NationsPanel.tsx";
import ContactsPanel from "@features/panels/contacts/contacts/ContactsPanel.tsx";
import SeaportsPanel from "@features/panels/contacts/seaports/SeaportsPanel.tsx";
import WeightsPanel from "@features/panels/leathers/weights/WeightsPanel.tsx";
import SpeciesPanel from "@features/panels/leathers/species/SpeciesPanel.tsx";
import LeathersPanel from "@features/panels/leathers/leathers/LeathersPanel.tsx";
import ThicknessesPanel from "@features/panels/leathers/thicknesses/ThicknessesPanel.tsx";
import TypesPanel from "@features/panels/leathers/types/TypesPanel.tsx";
import FlayingPanel from "@features/panels/leathers/flaying/FlayingPanel.tsx";
import OriginsPanel from "@features/panels/leathers/origins/OriginsPanel.tsx";
import TanningStagesPanel from "@features/panels/leathers/tanning-stages/TanningStagesPanel.tsx";
import BatchesPanel from "@features/panels/production/batches/BatchesPanel.tsx";
import CustomerOrdersPanel from "@features/panels/orders/customer-orders/CustomerOrdersPanel.tsx";
import ProductsPanel from "@features/panels/products/products/ProductsPanel.tsx";
import ProductCategoriesPanel from "@features/panels/products/product-categories/ProductCategoriesPanel.tsx";
import ProductTypesPanel from "@features/panels/products/product-types/ProductTypesPanel.tsx";
import ArticlesPanel from "@features/panels/products/articles/ArticlesPanel.tsx";
import MachineryPanel from "@features/panels/production/machinery/MachineryPanel.tsx";
import ArticleTypesPanel from "@features/panels/products/article-types/ArticleTypesPanel.tsx";
import DeliveryNotesPanel from "@features/panels/shipping-invoicing/delivery-notes/DeliveryNotesPanel.tsx";
import ReasonsPanel from "@features/panels/shipping-invoicing/reasons/ReasonsPanel.tsx";
import SelectionPanel from "@features/panels/products/selection/SelectionPanel.tsx";
import SubcontractingNotReturnedPanel from "@features/panels/shipping-invoicing/subcontracting-not-returned/SubcontractingNotReturnedPanel.tsx";
import ProcessesPanel from "@features/panels/production/processes/ProcessesPanel.tsx";
import WorkingsPanel from "@features/panels/production/workings/WorkingsPanel.tsx";
import CurrenciesExchangePanel from "@features/panels/commercial/currenciesExchange/CurrenciesExchangePanel.tsx";
import ArticleColorsPanel from "@features/panels/products/article-colors/ArticleColorsPanel.tsx";
import ArticleClassesPanel from "@features/panels/products/article-classes/ArticleClassesPanel.tsx";

import DeliveryNotesRowsPanel from "@features/panels/shipping-invoicing/delivery-notes/delivery-notes-row/DeliveryNotesRowsPanel.tsx";
import OrderRowsPanel from "@features/panels/orders/customer-orders/order-rows/OrderRowsPanel.tsx";
import LotsBatchesPanel from "@features/panels/warehouse/lots-batches/LotsBatchesPanel.tsx";

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
    | 'currenciesExchange'
    | 'articleColors'
    | 'articleClasses'
    | 'lotsBatches'
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
    products:           () => <ProductsPanel/>,
    articles:           (props) => <ArticlesPanel {...props}/>,
    selection:          (props) => <SelectionPanel {...props}/>,
    productCategories:  () => <ProductCategoriesPanel/>,
    productTypes:       () => <ProductTypesPanel/>,
    articleTypes:       (props) => <ArticleTypesPanel {...props}/>,
    articleColors:      (props) => <ArticleColorsPanel {...props}/>,
    articleClasses:     (props) => <ArticleClassesPanel {...props}/>,
    // orders
    customerOrders: () => <CustomerOrdersPanel/>,
    // production
    batches:    (props) => <BatchesPanel {...props}/>,
    machinery:  () => <MachineryPanel/>,
    processes:  () => <ProcessesPanel />,
    workings:   () => <WorkingsPanel />,
    // ddt
    deliveryNotes:              () => <DeliveryNotesPanel />,
    deliveryNotesRows:          (props) => <DeliveryNotesRowsPanel {...props}/>,
    orderRows:                  (props) => <OrderRowsPanel {...props}/>,
    reasons:                    () => <ReasonsPanel />,
    subcontractingNotReturned:  () => <SubcontractingNotReturnedPanel />,
    currenciesExchange: () => <CurrenciesExchangePanel />,
    lotsBatches: () => <LotsBatchesPanel />,
    "not-implemented": () => <>To implement</>,
}