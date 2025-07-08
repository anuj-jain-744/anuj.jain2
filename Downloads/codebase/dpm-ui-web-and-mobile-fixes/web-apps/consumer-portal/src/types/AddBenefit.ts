export interface PayloadAddBenefit {
    policyNo: string;
}

export interface AmountProps {
    totalAmount: number | undefined;
    subtotal?: number | undefined;
    vatAmount?: number | undefined;
}

export interface PremiumBreakdownProps {
    subtotal: number;
    vatAmount: number;
    totalAmount: number;
    driverData?:{
        benefitNameEn: string;
        benefitPrice: number;
        isSelected: boolean;
    }[]
}

export interface AddBenefitprops {
    benefitCategory: string;
    benefitCode: string;
    benefitId: string;
    benefitNameAr: string;
    benefitNameEn: string;
    benefitPrice: number;
    effectiveDate: string;
    expiryDate: string;
    vatAmount: number;
    isSelected?: boolean;
    mostPurchased?:number;
}

interface Vehicle {
    benefits: AddBenefitprops[];
    sequenceNo: string;
}

interface Model {
    smeProduct: boolean;
    vehicles: Vehicle[];
}

export interface ResponseAddBenefit {
    model: Model;
    status: string;
    endoRequestReferenceNo: string;
}
