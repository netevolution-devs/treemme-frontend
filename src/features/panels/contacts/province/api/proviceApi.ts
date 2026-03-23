import type { IProvince } from "./IProvince.ts";
import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.ts";

export const provinceApi = createPanelApi<IProvince>({
    baseEndpoint: "/province",
    queryKey: "PROVINCE"
});