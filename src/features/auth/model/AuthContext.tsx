import {
    createContext,
    type ReactNode,
    useContext,
    useEffect,
} from "react";
import useGetWhoAmI from "../api/useGetWhoAmI";
import usePostLogout from "../api/usePostLogout";
import {useNavigate} from "react-router";
import type {IUser} from "@features/user/model/UserInterfaces.ts";
import {getDevFlags} from "@shared/dev-tools/DevTools.tsx";
import {mockUser} from "@shared/dev-tools/mock/UserMock.ts";

type AuthContextType = {
    user: IUser | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (userData: IUser) => void;
    logout: () => void;
    refetch: () => void;
    userCode: string | null;
    setUserCode: (userCode: string | null) => void;
}

const authContext = createContext<AuthContextType | undefined>(undefined);

const USER_CODE_STORAGE_KEY = "auth.userCode";

const readStoredUserCode = () => {
    if (typeof window === "undefined") {
        return null;
    }
    const value = window.sessionStorage.getItem(USER_CODE_STORAGE_KEY);
    return value && value.length > 0 ? value : null;
};

const writeStoredUserCode = (value: string | null) => {
    if (typeof window === "undefined") {
        return;
    }
    if (!value) {
        window.sessionStorage.removeItem(USER_CODE_STORAGE_KEY);
        return;
    }
    window.sessionStorage.setItem(USER_CODE_STORAGE_KEY, value);
};

function useAuth() {
    const context = useContext(authContext);
    if (!context) {
        throw new Error('useAuth must be used within an authProvider');
    }
    return context;
}

function AuthProvider({children}: { children: ReactNode }) {
    const navigate = useNavigate();
    const isDev = import.meta.env.DEV;
    const skipAuth = isDev && getDevFlags().skipAuth;

    const {data: whoami, isSuccess, isLoading: isWhoamiLoading, error, refetch} = useGetWhoAmI();
    const {mutate: logoutMutation} = usePostLogout();

    const login = () => {
        refetch();
    }

    const logout = () => {
        logoutMutation();
    }

    // TODO: remove mock user implementation and make dev tools less invasive when whoAmI works
    const authData = skipAuth ? {
        isLoading: false,
        user: mockUser,
        isAuthenticated: true,
    } : {
        isLoading: isWhoamiLoading,
        user: whoami ?? null,
        isAuthenticated: Boolean(whoami),
    };

    const {isLoading, user, isAuthenticated} = authData;
    const storedUserCode = readStoredUserCode();
    const userCode = user?.userCode ?? storedUserCode ?? "";

    const setUserCode = (value: string | null) => {
        writeStoredUserCode(value);
    };


    useEffect(() => {
        if (skipAuth) return;

        const wantsTotpSetup = typeof whoami?.otpEnabled !== "undefined" && whoami?.otpEnabled;

        if (isSuccess && whoami && wantsTotpSetup) {
            navigate("/login/otp/setup");
            return;
        }
        if (error) {
            logout();
            return;
        }
        if (isSuccess && whoami && storedUserCode) {
            writeStoredUserCode(null);
        }
    }, [isSuccess, error, whoami, navigate, storedUserCode]);

    return (
        <authContext.Provider value={{
            user,
            login,
            logout,
            refetch,
            isAuthenticated,
            isLoading,
            userCode,
            setUserCode
        }}>
            {children}
        </authContext.Provider>
    )
}

export {
    AuthProvider,
    useAuth
}
