import useApi from "@api/useApi";

interface IClientOrderRowSummaryPrintParams {
    start_date?: string;
    end_date?: string;
}

const useGetClientOrderRowSummaryPrint = () => {
    const {get} = useApi();
    return async (clientId: number, params: IClientOrderRowSummaryPrintParams) => {
        const endpoint = `/client/${clientId}/client-order-row-summary-print`;
        const response = await get<Blob>(endpoint, {
            params,
            responseType: "blob",
        });
        const blob = new Blob([response.data as unknown as BlobPart], {type: "application/pdf"});
        const url = window.URL.createObjectURL(blob);
        window.open(url, "_blank");
    };
}

export default useGetClientOrderRowSummaryPrint;