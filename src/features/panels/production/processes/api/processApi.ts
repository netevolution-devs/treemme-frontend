import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {IProcess} from "@features/panels/production/processes/api/IProcess";
import useApi from "@api/useApi";

export const processApi = {
    ...createPanelApi<IProcess>({
        baseEndpoint: "/production",
        queryKey: "PROCESS"
    }),
    useGetDailyPrint: () => {
        const {get} = useApi();
        return async (date: string) => {
            const response = await get<Blob>("/production/daily-print", {
                params: {date},
                responseType: "blob",
            });
            const blob = new Blob([response.data as unknown as BlobPart], {type: "application/pdf"});
            const url = window.URL.createObjectURL(blob);
            window.open(url, "_blank");
        };
    },
}