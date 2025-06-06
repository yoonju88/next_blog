import { PropertyStatus } from "./propertyStatus";
import { SkinType } from "./skinType"
import { CategoryType } from "./categoryType"


export type Property = {
    id: string;
    name?: string;
    subTitle?: string;
    price?: number;
    costPrice?: number;
    category?: CategoryType;
    subCategory?: string;
    origin?: string;
    manufacturer?: string;
    volume?: number;
    description?: string;
    status?: PropertyStatus;
    brand?: string;
    ingredients?: string;
    skinType?: SkinType;
    skinBenefit?: string;
    howToUse?: string;
    expireDate?: string;
    stockQuantity?: number;
    images?: string[];
}

export type CreateProperty = {
    name: string;
    subTitle: string;
    price: number;
    costPrice: number;
    category: CategoryType;
    subCategory: string;
    origin: string;
    manufacturer: string;
    volume: number;
    description: string;
    status: PropertyStatus;
    brand: string;
    ingredients: string;
    skinType: SkinType;
    skinBenefit: string;
    howToUse: string;
    expireDate: string;
    stockQuantity: number;
}