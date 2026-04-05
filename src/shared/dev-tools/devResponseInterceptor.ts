import type {AxiosResponse} from 'axios';
import {getDevFlags} from './DevTools';
import type {IApiUser} from "@features/user/model/UserInterfaces";

export const devResponseInterceptor = async (response: AxiosResponse) => {
    // This check helps with tree-shaking
    if (!import.meta.env.DEV) return response;

    const devFlags = getDevFlags();

    if (devFlags.apiDelay) await new Promise(resolve => setTimeout(resolve, 5000));

    if (devFlags.skipOtp && response.config.url?.includes('/api/whoami')) {
        if (response.data?.data) {
            const apiUser = response.data.data as IApiUser;
            response.data.data = {
                ...apiUser,
                totp_enabled: true,
            };
        }
    }

    return response;
};
