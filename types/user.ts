export interface Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface Preferences {
    categories?: string[];
    notifications?: boolean;
};

export interface UserProfile {
    displayName?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    photoURL?: string;
    phoneNumber?: string;
    birthDate?: string;
    address?: Address;
    points?: number;
    preferences?: Preferences;
}