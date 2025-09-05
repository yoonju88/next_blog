import { SkinType } from "./skinType"
import { CategoryType } from "./categoryType"

export type PropertyStatus = 'available' | 'sold' | 'reserved'

export type Property = {
    id: string;
    name: string;
    subTitle: string;
    price: number;
    costPrice: number;
    category: string;
    subCategory: string;
    origin: string;
    manufacturer: string;
    volume: number;
    description: string;
    status: PropertyStatus;
    brand: string;
    ingredients: string;
    skinType: string;
    skinBenefit: string;
    howToUse: string;
    expireDate: string;
    stockQuantity: number;
    created?: string;
    updated?: string;
    images: string[];
    salePrice?: number;
    saleRate?: number;
    onSale?: boolean;
    weight?: number;
    soldQuantity?: number;
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
    created: string;
    updated: string;
    weight?: number;
}

export type UpdatePropertyInput =
    Partial<Omit<Property, "id" | "images" | "soldQuantity">> & {
        id: string;
        images?: string[];
        soldQuantity?: number;
    };