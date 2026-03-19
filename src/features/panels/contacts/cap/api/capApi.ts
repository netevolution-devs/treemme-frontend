import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.ts";
import type {ICap} from "@features/panels/contacts/cap/api/ICap.ts";

interface ICapPayload extends Omit<ICap, 'id' | 'province'> {
    province_id: number,
}

export const capApi = createPanelApi<ICap, ICapPayload>({
    baseEndpoint: '/town',
    queryKey: 'CAP'
})