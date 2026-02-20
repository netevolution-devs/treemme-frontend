import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.tsx";
import type {ICap} from "@features/panels/contacts/cap/api/ICap.ts";

interface ICapStorePayload extends Omit<ICap, 'id' | 'province'> {
    province_id: number,
}

export const capApi = createPanelApi<ICap, ICapStorePayload>({
    baseEndpoint: '/town',
    queryKey: 'CAP'
})