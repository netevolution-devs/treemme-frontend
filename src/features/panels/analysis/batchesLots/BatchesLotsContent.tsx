import {useState} from "react";
import BatchesChronology from "@features/panels/production/batches/chronology/BatchesCronology";
import WarehouseMovementsList from "@features/panels/production/batches/movements/WarehouseMovementsList";
import GenericTabContent from "@features/panels/shared/GenericTabContent";
import BatchesForm from "@features/panels/production/batches/BatchesForm";
import BatchesLotsCostsList from "@features/panels/analysis/batchesLots/BatchesLotsCostsList";
import BatchesLotsSalesList from "@features/panels/analysis/batchesLots/BatchesLotsSalesList";

import {useTranslation} from "react-i18next";

const BatchesLotsContent = () => {
    const {t} = useTranslation(["form"]);
    const [tabIndex, setTabIndex] = useState(0);

    return (
        <>
            <GenericTabContent
                value={tabIndex}
                onChange={(_, newValue) => setTabIndex(newValue)}
                tabs={[
                    {label: t("batches.tabs.batch"), component: <BatchesForm disableFunctions/>},
                    {label: t("batches.tabs.movements"), component: <WarehouseMovementsList/>},
                    {label: t("batches.tabs.chronology"), component: <BatchesChronology/>},
                    {label: t("batches.tabs.costs"), component: <BatchesLotsCostsList/>},
                    {label: t("batches.tabs.sales"), component: <BatchesLotsSalesList/>}
                ]}
            />
        </>
    )
}

export default BatchesLotsContent;