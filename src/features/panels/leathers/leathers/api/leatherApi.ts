import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {ILeather} from "@features/panels/leathers/leathers/api/ILeather";
import type {ILeatherForm} from "@features/panels/leathers/leathers/LeathersForm";

type ILeatherPayload = ILeatherForm;

export const leatherApi = createPanelApi<ILeather, ILeatherPayload>({
    baseEndpoint: "/leather",
    queryKey: "LEATHER"
});