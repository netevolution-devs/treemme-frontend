import type {AxiosError, AxiosResponse} from 'axios';
import type {IGenericApiError} from "@api/interfaces/IGenericApiError";
import {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {customAxiosInstance} from "./customAxiosInstance";
import {useSnackbar} from "@api/ResponseMessageContext";

let isInterceptorConfigured = false;

const useAxiosInstance = () => {
    const {showMessage} = useSnackbar();
    const {t} = useTranslation('common');

    useEffect(() => {
        if (isInterceptorConfigured) {
            return;
        }

        const handleResponse = async (response: AxiosResponse) => {
            if (import.meta.env.DEV) {
                try {
                    const {devResponseInterceptor} = await import('@shared/dev-tools/devResponseInterceptor');
                    return devResponseInterceptor(response);
                } catch {
                    return response;
                }
            }
            return response;
        };

        const handleGenericError = (error: AxiosError<IGenericApiError>): Promise<never> => {
            if (error.code === "ERR_NETWORK") {
                showMessage({
                    message: t('common:toast.network-error'),
                    type: "error",
                    data: undefined,
                    queryKey: undefined,
                });
                return Promise.reject(error);
            }

            if (error.response) {
                const status = error.response.status;

                if (status === 403) {
                    showMessage({
                        message: t('common:toast.permission-denied'),
                        type: "error",
                        data: undefined,
                        queryKey: undefined,
                    });
                    return Promise.reject(error);
                }

                if (status >= 500) {
                    showMessage({
                        message: t('common:toast.server-error'),
                        type: "error",
                        data: undefined,
                        queryKey: undefined,
                    });
                    return Promise.reject(error);
                }

                if (error.response.data?.error) {
                    showMessage({
                        message: error.response.data.error,
                        type: "error",
                        data: undefined,
                        queryKey: undefined,
                    });
                    return Promise.reject(error);
                }
            }

            // Timeout
            if (error.code === "ECONNABORTED") {
                showMessage({
                    message: t('common:toast.request-timeout'),
                    type: "error",
                    data: undefined,
                    queryKey: undefined,
                });
                return Promise.reject(error);
            }

            return Promise.reject(error);
        };

        customAxiosInstance.interceptors.response.use(
            handleResponse,
            handleGenericError
        );

        isInterceptorConfigured = true;
    }, []);
};

export default useAxiosInstance;
