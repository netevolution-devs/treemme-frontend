import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.ts";
import type {ILeather} from "@features/panels/leathers/leathers/api/ILeather.ts";
import type {ILeatherForm} from "@features/panels/leathers/leathers/LeathersForm.tsx";

type ILeatherPayload = ILeatherForm;

export const leatherApi = createPanelApi<ILeather, ILeatherPayload>({
    baseEndpoint: "/leather",
    queryKey: "LEATHER"
});