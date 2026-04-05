import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {IMachine} from "@features/panels/production/machinery/api/IMachine";
import type {IMachineryForm} from "@features/panels/production/machinery/MachineryForm";

export const machineApi = createPanelApi<IMachine, IMachineryForm>({
    baseEndpoint: "/machine",
    queryKey: "MACHINE"
});