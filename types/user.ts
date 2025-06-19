export interface UserProfile {
    displayName?: string;
    photoURL?: string;
    address?: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    phoneNumber?: string;
    birthDate?: string;
    preferences?: {
        categories?: string[];
        notifications?: boolean;
    };
    points?: number;
    email?: string;
}