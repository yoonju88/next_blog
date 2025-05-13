import { PropertyStatus } from "./propertyStatus";
import { SkinType } from "./skinType"
import { CategoryType } from "./categoryType"

export type Property = {
    id: string;
    name?: string;
    price?: number;
    category?: CategoryType;
    origin?: string;
    manufacturer?: string;
    volume?: number;
    description?: string;
    status?: PropertyStatus;
    brand?: string;
    ingredients?: string;
    keyIngredients?: string;
    skinType?: SkinType;
    howToUse?: string;
    expireDate?: string;
    stockQuantity?: number;
    images?: string[];
}

