import type {IDockviewPanelProps} from "dockview";
import {useState} from "react";
import {ButtonStateDisabled} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import GenericPanel from "@features/panels/shared/GenericPanel";
import WeeklyOrdersList from "./WeeklyOrdersList";
import {getCurrentWeekFilters} from "./weeklyOrdersFilters";

export interface IWeeklyOrdersUIState extends IPanelUIState {
    selectedAverageId?: string | null;
}

export interface IWeeklyOrdersFilters {
    filterStartDate?: string | undefined;
    filterEndDate?: string | undefined;
    filterClientId?: number | undefined;
    filterDateField?: "order_date" | "delivery_date_confirmed" | undefined;
    filterInternal?: "true" | "false" | "all" | undefined;
}

const WeeklyOrdersPanel = (props: IDockviewPanelProps) => {
    const [initialFilters] = useState(getCurrentWeekFilters);
    const initialUI: IWeeklyOrdersUIState = {
        isFormDisabled: true,
        buttonsState: ButtonStateDisabled,
    };

    return (
        <GenericPanel<IWeeklyOrdersFilters, IWeeklyOrdersUIState>
            kind={"weeklyOrders"}
            uuid={props.api.id}
            initialState={{
                filters: {...initialFilters, filterDateField: "order_date", filterInternal: "false"},
                uiState: initialUI,
            }}
            listComponent={<WeeklyOrdersList/>}
        />
    );
};

export default WeeklyOrdersPanel;
