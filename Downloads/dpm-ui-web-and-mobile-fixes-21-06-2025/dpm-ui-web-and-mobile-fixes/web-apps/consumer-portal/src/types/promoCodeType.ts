export interface PromoCodeRequest {
    schemeType: number;
    promoCode?: string;
   domainEmail?: string;
}

export interface PromoCodeScheme {
    schemeCode: string;
    schemeName: string;
    virtualBranch: string | null;
}

export interface PromoCodeResponse {
    model: {
        schemes: PromoCodeScheme[]
    }
}