import {type AxiosInstance, type  AxiosRequestConfig, type  AxiosResponse, isAxiosError} from "axios";
import {customAxiosInstance} from "./customAxiosInstance";
import {DEFAULT_LANGUAGE_CODE} from "../../i18n";
import {useTranslation} from "react-i18next";
import type {ILanguageCode} from "@interfaces/ILanguageCode.ts";
import type {IGenericApiResponse} from "@api/interfaces/IGenericApiResponse.ts";

const DEFAULT_ENDPOINT = import.meta.env.VITE_API;

type TInit = string[][] | Record<string, string> | string | URLSearchParams | undefined

// Handle Axios specific error
const handleAxiosError = (error: unknown): void => {
    if (isAxiosError(error)) {
        console.error('Axios error:', error.response);
        throw error
    } else {
        console.error('Unknown error:', error);
    }
};

const useApi = (customInstance?: AxiosInstance) => {
    const axiosInstance = customInstance || customAxiosInstance;
    const {i18n} = useTranslation();
    const lang: ILanguageCode = (i18n.language || DEFAULT_LANGUAGE_CODE) as ILanguageCode;

    /**
     * Sends an asynchronous HTTP GET request to the specified endpoint.
     *
     * @template TResponseData - The expected type of the response data from the API.
     *
     * @param {string} route - The relative URL to which the GET request will be sent, appended to the base endpoint.
     * @param {AxiosRequestConfig<never>} [config] - Optional configuration object for customizing the request.
     *   This may include custom headers, timeout settings, and other Axios-specific configurations.
     *   If provided, custom headers will be merged with the authorization headers.
     * @param {string} [endpoint=DEFAULT_ENDPOINT] - The base endpoint URL to which the relative URL will be appended.
     *   This allows overriding the default endpoint (`DEFAULT_ENDPOINT`) if needed. Use this parameter to specify
     *   a different base URL for the HTTP request if required by the API structure or environment.
     *
     * @returns {Promise<AxiosResponse<IGenericApiResponse<TResponseData>>>} - A promise that resolves to the response from the API.
     *   The response is wrapped in an `AxiosResponse` object containing both the data and metadata about the HTTP response,
     *   typed to reflect the structure of the expected API response based on the provided generic type parameter.
     *
     * @throws {AxiosError} - Throws an error if the request fails for any reason, such as network issues or server errors.
     *   An unknown error will be thrown if the error handling function does not provide a specific message.
     *
     * @example
     * const response = await get<MyResponseType>('/example');
     */
    const get = async <TResponseData>(
        route: string,
        config?: AxiosRequestConfig<never> | undefined,
        endpoint: string = DEFAULT_ENDPOINT
    ): Promise<AxiosResponse<IGenericApiResponse<TResponseData>>> => {
        type IResponse = IGenericApiResponse<TResponseData>

        const separator = route.includes("?") ? "&" : "?";
        const url = endpoint + route + `${separator}lang=${lang}`;

        const customConfig: AxiosRequestConfig<never> = {
            ...config,
            headers: {
                ...config?.headers, // Merge custom headers from config
            }
        }

        try {
            return await axiosInstance.get<
                IResponse,
                Promise<AxiosResponse<IGenericApiResponse<TResponseData>>>
            >(
                url,
                customConfig
            );
        } catch (error) {
            handleAxiosError(error);
            throw new Error("An unknown error occurred");
        }
    };


    /**
     * Sends an asynchronous HTTP POST request to the specified endpoint.
     *
     * @template TPayload - The type of the payload data to be sent with the POST request.
     * @template TResponseData - The expected type of the response data from the API.
     *
     * @param {string} route - The relative URL to which the POST request will be sent, appended to the base endpoint.
     * @param {TPayload} data - The payload to be sent with the POST request.
     *   This parameter should contain the data that needs to be created or updated on the server.
     * @param {AxiosRequestConfig<TPayload>} [config] - Optional configuration object for customizing the request.
     *   This may include custom headers, timeout settings, and other Axios-specific configurations.
     *   If provided, custom headers will be merged with the authorization headers.
     * @param {string} [endpoint=DEFAULT_ENDPOINT] - The base endpoint URL to which the relative URL will be appended.
     *   This allows overriding the default endpoint (`DEFAULT_ENDPOINT`) if needed. Use this parameter to specify
     *   a different base URL for the HTTP request if required by the API structure or environment.
     *
     * @returns {Promise<AxiosResponse<IGenericApiResponse<TResponseData>>>} - A promise that resolves to the response from the API.
     *   The response is wrapped in an `AxiosResponse` object containing both the data and metadata about the HTTP response,
     *   typed to reflect the structure of the expected API response based on the provided generic type parameters.
     *
     * @throws {AxiosError} - Throws an error if the request fails for any reason, such as network issues or server errors.
     *   An unknown error will be thrown if the error handling function does not provide a specific message.
     *
     * @example
     * const response = await post<MyPayloadType, MyResponseType>('/example', { key: 'value' });
     */
    const post = async <TPayload, TResponseData>(
        route: string,
        data?: TPayload | undefined,
        config?: AxiosRequestConfig<TPayload> | undefined,
        endpoint: string = DEFAULT_ENDPOINT
    ): Promise<AxiosResponse<IGenericApiResponse<TResponseData>>> => {
        type IResponse = IGenericApiResponse<TResponseData>;

        const separator = route.includes("?") ? "&" : "?";
        const url = endpoint + route + `${separator}lang=${lang}`;


        const customConfig: AxiosRequestConfig<TPayload> = {
            ...config,
            headers: {
                ...config?.headers, // Merge custom headers from config
            },
        };
        try {
            return await axiosInstance.post<
                IResponse,
                Promise<AxiosResponse<IGenericApiResponse<TResponseData>>>
            >(
                url,
                data,
                customConfig
            );
        } catch (error) {
            handleAxiosError(error);
            throw new Error("An unknown error occurred");
        }
    };


    /**
     * Sends an asynchronous HTTP POST request with URL-encoded data to the specified endpoint.
     *
     * @template TResponseData - The expected type of the response data from the API.
     *
     * @param {string} route - The relative URL to which the POST request will be sent, appended to the base endpoint.
     * @param {TInit} [init] - The data to be sent with the POST request.
     *   This can be provided in various formats: an array of key-value pairs, an object, a string, or an instance of `URLSearchParams`.
     *   The provided data will be URL-encoded automatically.
     * @param {AxiosRequestConfig<TInit>} [config] - Optional configuration object for customizing the request.
     *   This may include custom headers, timeout settings, and other Axios-specific configurations.
     *   If provided, custom headers will be merged with the authorization headers.
     * @param {string} [endpoint=DEFAULT_ENDPOINT] - The base endpoint URL to which the relative URL will be appended.
     *   This allows overriding the default endpoint (`DEFAULT_ENDPOINT`) if needed. Use this parameter to specify
     *   a different base URL for the HTTP request if required by the API structure or environment.
     *
     * @returns {Promise<AxiosResponse<IGenericApiResponse<TResponseData>>>} - A promise that resolves to the response from the API.
     *   The response is wrapped in an `AxiosResponse` object containing both the data and metadata about the HTTP response,
     *   typed to reflect the structure of the expected API response based on the provided generic type parameter.
     *
     * @throws {AxiosError} - Throws an error if the request fails for any reason, such as network issues or server errors.
     *   An unknown error will be thrown if the error handling function does not provide a specific message.
     *
     * @example
     * const response = await postEncoded<MyResponseType>('/example', { key1: 'value1', key2: 'value2' });
     */
    const postEncoded = async <TResponseData>(
        route: string,
        init?: TInit | undefined,
        config?: AxiosRequestConfig<TInit> | undefined,
        endpoint: string = DEFAULT_ENDPOINT
    ): Promise<AxiosResponse<IGenericApiResponse<TResponseData>>> => {
        type IResponse = IGenericApiResponse<TResponseData>;

        const separator = route.includes("?") ? "&" : "?";
        const url = endpoint + route + `${separator}lang=${lang}`;


        const customConfig: AxiosRequestConfig<TInit> = {
            ...config,
            headers: {
                ...config?.headers, // Merge custom headers from config
            },
        };

        try {
            return await axiosInstance.post<
                IResponse,
                Promise<AxiosResponse<IGenericApiResponse<TResponseData>>>
            >(
                url,
                new URLSearchParams(init),
                customConfig
            );
        } catch (error) {
            handleAxiosError(error);
            throw new Error("An unknown error occurred");
        }
    };

    /**
     * Sends an asynchronous HTTP PUT request to the specified endpoint.
     *
     * @template TPayload - The type of the payload data to be sent with the PUT request.
     * @template TResponseData - The expected type of the response data from the API.
     *
     * @param {string} route - The relative URL to which the PUT request will be sent, appended to the base endpoint.
     * @param {TPayload} data - The payload to be sent with the PUT request.
     *   This parameter should contain the data that needs to be updated on the server.
     * @param {AxiosRequestConfig<TPayload>} [config] - Optional configuration object for customizing the request.
     *   This may include custom headers, timeout settings, and other Axios-specific configurations.
     *   If provided, custom headers will be merged with the authorization headers.
     * @param {string} [endpoint=DEFAULT_ENDPOINT] - The base endpoint URL to which the relative URL will be appended.
     *   This allows overriding the default endpoint (`DEFAULT_ENDPOINT`) if needed. Use this parameter to specify
     *   a different base URL for the HTTP request if required by the API structure or environment.
     *
     * @returns {Promise<AxiosResponse<IGenericApiResponse<TResponseData>>>} - A promise that resolves to the response from the API.
     *   The response is wrapped in an `AxiosResponse` object containing both the data and metadata about the HTTP response,
     *   typed to reflect the structure of the expected API response based on the provided generic type parameters.
     *
     * @throws {AxiosError} - Throws an error if the request fails for any reason, such as network issues or server errors.
     *   An unknown error will be thrown if the error handling function does not provide a specific message.
     *
     * @example
     * const response = await put<MyPayloadType, MyResponseType>('/example', { key: 'value' });
     */
    const put = async <TPayload, TResponseData>(
        route: string,
        data: TPayload,
        config?: AxiosRequestConfig<TPayload> | undefined,
        endpoint: string = DEFAULT_ENDPOINT
    ): Promise<AxiosResponse<IGenericApiResponse<TResponseData>>> => {
        type IResponse = IGenericApiResponse<TResponseData>;

        const separator = route.includes("?") ? "&" : "?";
        const url = endpoint + route + `${separator}lang=${lang}`;


        const customConfig: AxiosRequestConfig<TPayload> = {
            ...config,
            headers: {
                ...config?.headers, // Merge custom headers from config
            },
        };

        try {
            return await axiosInstance.put<
                IResponse,
                Promise<AxiosResponse<IGenericApiResponse<TResponseData>>>
            >(
                url,
                data,
                customConfig
            );
        } catch (error) {
            handleAxiosError(error);
            throw new Error("An unknown error occurred");
        }
    };

    /**
     * Sends an asynchronous HTTP PUT request with URL-encoded data to the specified endpoint.
     *
     * @template TResponseData - The expected type of the response data from the API.
     *
     * @param {string} route - The relative URL to which the PUT request will be sent, appended to the base endpoint.
     * @param {TInit} [init] - The data to be sent with the PUT request.
     *   This can be provided in various formats: an array of key-value pairs, an object, a string, or an instance of `URLSearchParams`.
     *   The provided data will be URL-encoded automatically.
     * @param {AxiosRequestConfig<TInit>} [config] - Optional configuration object for customizing the request.
     *   This may include custom headers, timeout settings, and other Axios-specific configurations.
     *   If provided, custom headers will be merged with the authorization headers.
     * @param {string} [endpoint=DEFAULT_ENDPOINT] - The base endpoint URL to which the relative URL will be appended.
     *   This allows overriding the default endpoint (`DEFAULT_ENDPOINT`) if needed. Use this parameter to specify
     *   a different base URL for the HTTP request if required by the API structure or environment.
     *
     * @returns {Promise<AxiosResponse<IGenericApiResponse<TResponseData>>>} - A promise that resolves to the response from the API.
     *   The response is wrapped in an `AxiosResponse` object containing both the data and metadata about the HTTP response,
     *   typed to reflect the structure of the expected API response based on the provided generic type parameter.
     *
     * @throws {AxiosError} - Throws an error if the request fails for any reason, such as network issues or server errors.
     *   An unknown error will be thrown if the error handling function does not provide a specific message.
     *
     * @example
     * const response = await putEncoded<MyResponseType>('/example', { key1: 'value1', key2: 'value2' });
     */
    const putEncoded = async <TResponseData>(
        route: string,
        init?: TInit,
        config?: AxiosRequestConfig<TInit> | undefined,
        endpoint: string = DEFAULT_ENDPOINT
    ): Promise<AxiosResponse<IGenericApiResponse<TResponseData>>> => {
        type IResponse = IGenericApiResponse<TResponseData>;

        const separator = route.includes("?") ? "&" : "?";
        const url = endpoint + route + `${separator}lang=${lang}`;


        const customConfig: AxiosRequestConfig<TInit> = {
            ...config,
            headers: {
                ...config?.headers, // Merge custom headers from config
            },
        };

        try {
            return await axiosInstance.put<
                IResponse,
                Promise<AxiosResponse<IGenericApiResponse<TResponseData>>>
            >(
                url,
                new URLSearchParams(init),
                customConfig
            );
        } catch (error) {
            handleAxiosError(error);
            throw new Error("An unknown error occurred");
        }
    };

    /**
     * Sends an asynchronous HTTP DELETE request to the specified endpoint.
     *
     * @template TResponseData - The expected type of the response data from the API.
     *
     * @param {string} route - The relative URL to which the DELETE request will be sent, appended to the base endpoint.
     * @param {AxiosRequestConfig<never>} [config] - Optional configuration object for customizing the request.
     *   This may include custom headers, timeout settings, and other Axios-specific configurations.
     *   If provided, custom headers will be merged with the authorization headers.
     * @param {string} [endpoint=DEFAULT_ENDPOINT] - The base endpoint URL to which the relative URL will be appended.
     *   This allows overriding the default endpoint (`DEFAULT_ENDPOINT`) if needed. Use this parameter to specify
     *   a different base URL for the HTTP request if required by the API structure or environment.
     *
     * @returns {Promise<AxiosResponse<IGenericApiResponse<TResponseData>>>} - A promise that resolves to the response from the API.
     *   The response is wrapped in an `AxiosResponse` object containing both the data and metadata about the HTTP response,
     *   typed to reflect the structure of the expected API response based on the provided generic type parameter.
     *
     * @throws {AxiosError} - Throws an error if the request fails for any reason, such as network issues or server errors.
     *   An unknown error will be thrown if the error handling function does not provide a specific message.
     *
     * @example
     * const response = await DELETE<MyResponseType>('/example');
     */
    const DELETE = async <TResponseData>(
        route: string,
        config?: AxiosRequestConfig<never> | undefined,
        endpoint: string = DEFAULT_ENDPOINT
    ): Promise<AxiosResponse<IGenericApiResponse<TResponseData>>> => {
        type IResponse = IGenericApiResponse<TResponseData>;

        const separator = route.includes("?") ? "&" : "?";
        const url = endpoint + route + `${separator}lang=${lang}`;


        const customConfig: AxiosRequestConfig<never> = {
            ...config,
            headers: {
                ...config?.headers, // Merge custom headers from config
            },
        };

        try {
            return await axiosInstance.delete<
                IResponse,
                Promise<AxiosResponse<IGenericApiResponse<TResponseData>>>
            >(
                url,
                customConfig
            );
        } catch (error) {
            handleAxiosError(error);
            throw new Error("An unknown error occurred");
        }
    };

    return {
        get,
        post,
        postEncoded,
        put,
        putEncoded,
        DELETE,
    };
};

export default useApi;
