import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.ts";
import type {ICap} from "@features/panels/contacts/cap/api/ICap.ts";
import type {ICapForm} from "@features/panels/contacts/cap/CapForm.tsx";

type ICapPayload = ICapForm;

export const capApi = createPanelApi<ICap, ICapPayload>({
    baseEndpoint: '/town',
    queryKey: 'CAP'
})