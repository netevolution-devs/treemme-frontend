import {PanelProvider, useCurrentPanelStore} from "@ui/panel/store/PanelContext.tsx";

type OrdersFilter = { status: string; date: string };
const defaultFilters: OrdersFilter = { status: '', date: '' };

export const CapPanel = () => (
    <PanelProvider kind="contatti-cap">
        <CapContent />
    </PanelProvider>
);

const CapContent = () => {
    const { filters, setFilters, selected } = useCurrentPanelStore(defaultFilters);

    return (
        <div>
            <input
                value={filters.status}
                onChange={(e) => setFilters({ status: e.target.value })}
            />
            <p>Istanze selezionate: {Object.keys(selected).length}</p>
        </div>
    );
};