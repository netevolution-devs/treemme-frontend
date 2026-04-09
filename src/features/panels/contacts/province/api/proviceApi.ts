import type { IProvince } from "./IProvince";
import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";

export const provinceApi = createPanelApi<IProvince>({
    baseEndpoint: "/province",
    queryKey: "PROVINCE"
});