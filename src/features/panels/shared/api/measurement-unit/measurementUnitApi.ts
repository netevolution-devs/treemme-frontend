import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {IMeasurementUnit} from "@features/panels/shared/api/measurement-unit/IMeasurementUnit";

export const measurementUnitApi = createPanelApi<IMeasurementUnit>({
    baseEndpoint: "/measurement-unit",
    queryKey: "MEASUREMENT_UNIT"
});