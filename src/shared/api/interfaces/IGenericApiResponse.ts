export interface IGenericApiResponse<TData> {
    status: "ok" | "ko",
    status_code: number,
    error: string,
    locale: string,
    pagination: number[],
    data: TData
}
