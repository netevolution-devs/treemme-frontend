import QUERY_KEY_STRINGS from "@api/QueryKeyStrings.ts";
import useApi from "@api/useApi.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {IApiUserPayload} from "../model/UserInterfaces.ts";
import {type IApiUserProfile, type IUserProfile, UserProfileAdapter} from "@features/profile/model/IUserProfile.ts";

const usePostUser = () => {
    const { postEncoded: post } = useApi();

    const url = `/api/user`; 
    const queryClient = useQueryClient();

    async function doPostUser(data: IApiUserPayload): Promise<IUserProfile> {
        const response = await post<IApiUserProfile>(url, data as never);
        return UserProfileAdapter(response.data.data);
    }

    return useMutation({
        mutationKey: [QUERY_KEY_STRINGS.USER.CREATE],
        mutationFn: doPostUser,
        onSuccess: (newUser) => {
            queryClient.setQueryData(
                [QUERY_KEY_STRINGS.USER.LIST],
                (oldData: IUserProfile[] | undefined) => {
                    if (!oldData) {
                        return [newUser];
                    }
                    return [newUser, ...oldData];
                }
            );
        }
    });
};

export default usePostUser;
