const QUERY_KEY_STRINGS = {
    USER: {
        //Auth
        WHOAMI: "getWhoAmI" as const,
        LOGIN: "login" as const,
        LOGIN_OTP: "loginOTP" as const,
        CHANGE_PASSWORD: "changePassword" as const,
        VERIFY_DEVICE: "verifyDevice" as const,
        LOGOUT: "logout" as const,
        CONFIRM_ACCOUNT: "confirmAccount" as const,
        //Reset
        RESET_PASSWORD_REQUEST_CODE: "resetPasswordRequestCode" as const,
        RESET_PASSWORD_VERIFY_CODE: "resetPasswordVerifyCode" as const,
        RESET_PASSWORD_UPDATE: "resetPasswordUpdate" as const,
        //Register
        REGISTER: "register" as const,

        //CRUD
        LIST: "getUsers" as const,
        CREATE: "createUser" as const,
        DELETE: "deleteUser" as const,
        UPDATE: "updateUser" as const,
        DETAIL: "getUserDetail" as const,

        PROFILE: "getProfile" as const,
    },
    ROLE: {
        CREATE: "createRole" as const,
        DELETE: "deleteRole" as const,
        LIST: "getRoleList" as const,
    }
};
export default QUERY_KEY_STRINGS;
