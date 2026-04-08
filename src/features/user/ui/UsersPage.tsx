import useGetUserList from "@features/user/api/useGetUserList";
import BasePage from "@shared/ui/layout/BasePage";
import UsersTable from "./UsersTable";
import type {IUser} from "@features/user/model/UserInterfaces";

const UsersPage = () => {
    const {data: users, isLoading, isFetching} = useGetUserList({type: 'backoffice'});
    const loading = isLoading || isFetching;

    return(
        <BasePage isLoading={loading} fullwidth sx={{p: 0}}>
            <UsersTable 
                users={users as IUser[]}
                isLoading={loading}
            />
        </BasePage>
    )
}

export default UsersPage;
