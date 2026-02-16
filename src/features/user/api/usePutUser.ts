import QUERY_KEY_STRINGS from "@api/QueryKeyStrings.ts";
import useApi from "@api/useApi.ts";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import type {IApiUserPayloadUpdate} from "../model/UserInterfaces.ts";
import {type IApiUserProfile, type IUserProfile, UserProfileAdapter} from "@features/profile/model/IUserProfile.ts";

const usePutUser = () => {
    const {put} = useApi();

    const queryClient = useQueryClient();

    async function doPutUser(data: IApiUserPayloadUpdate): Promise<IUserProfile> {
        const url = `/modify/user/${data.code}`;
        const response = await put<IApiUserPayloadUpdate, IApiUserProfile>(url, data.payload as never);
        return UserProfileAdapter(response.data.data);
    }

    return useMutation({
        mutationKey: [QUERY_KEY_STRINGS.USER.CREATE],
        mutationFn: doPutUser,
        onSuccess: (updatedUser) => {
            queryClient.setQueryData(
                [QUERY_KEY_STRINGS.USER.LIST],
                (oldData: IUserProfile[] | undefined) => {
                    if (!oldData) {
                        return [updatedUser];
                    }
                    return oldData.map((user) =>
                        user.userCode === updatedUser.userCode ? updatedUser : user
                    );
                }
            );
        }
    });
};

export default usePutUser;
