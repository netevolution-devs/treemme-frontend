import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.tsx";
import type {IMachine} from "@features/panels/production/machinery/api/IMachine.ts";
import type {IMachineryForm} from "@features/panels/production/machinery/MachineryForm.tsx";

export const machineApi = createPanelApi<IMachine, IMachineryForm>({
    baseEndpoint: "/machine",
    queryKey: "MACHINE"
});