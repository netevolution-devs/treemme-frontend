import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.ts";
import type {IMeasurementUnit} from "@features/panels/shared/api/measurement-unit/IMeasurementUnit.ts";

export const measurementUnitApi = createPanelApi<IMeasurementUnit>({
    baseEndpoint: "/measurement-unit",
    queryKey: "MEASUREMENT_UNIT"
});