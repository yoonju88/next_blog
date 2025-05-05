import { PropertyStatus } from "./propertyStatus";
import { SkinType } from "./skinType"

export type Property = {
    id: string;
    name: string;
    price: number;
    category: string;
    origin: string;
    manufacturer: string;
    volumes: number;
    description: string;
    status: PropertyStatus;
    brand: string;
    images?: string[];
    ingredients: string;
    keyIngredients: string;
    skinType: SkinType;
    howToUse: string;
    ExpireDate: Date | string;
}