export interface IProfile {
    userCode: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string | undefined;
    address?: string | undefined;
    fiscalCode?: string | undefined;
    companyCode?: string | undefined;
}

export interface IApiProfile {
    user_code: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string | undefined;
    address?: string | undefined;
    fiscal_code?: string | undefined;
    company: {
        company_code: string;
    } | undefined;
}

export function ProfileAdapter(apiProfile: IApiProfile): IProfile {
    return {
        userCode: apiProfile.user_code,
        firstName: apiProfile.first_name,
        lastName: apiProfile.last_name,
        email: apiProfile.email,
        phone: apiProfile.phone,
        address: apiProfile.address,
        fiscalCode: apiProfile.fiscal_code,
        companyCode: apiProfile.company?.company_code,
    };
}

export function ProfileArrayAdapter(apiUsers: IApiProfile[]): IProfile[] {
    return apiUsers.map(ProfileAdapter);
}