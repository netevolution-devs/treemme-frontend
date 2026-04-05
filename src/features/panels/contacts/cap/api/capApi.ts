import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {ICap} from "@features/panels/contacts/cap/api/ICap";
import type {ICapForm} from "@features/panels/contacts/cap/CapForm";

type ICapPayload = ICapForm;

export const capApi = createPanelApi<ICap, ICapPayload>({
    baseEndpoint: '/town',
    queryKey: 'CAP'
})