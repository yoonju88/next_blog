'use client'

import { useAuth } from "@/context/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/firebase/client"
import PickCalenderDate from '@/components/account/pickCalenderDate'

interface UpdateProfileFormProps {
    initialData: {
        displayName: string;
        lastName: string;
        firstName: string;
        address: {
            street: string;
            city: string;
            state: string;
            zipCode: string;
            country: string;
        };
        phoneNumber: string;
        birthDate: string;
        userPoint?: number;
        userEmail?: string;
    }
}

const defaultFormData = {
    displayName: '',
    lastName: '',
    firstName: '',
    address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
    },
    phoneNumber: '',
    birthDate: '',
    userPoint: 0,
    userEmail: ''
}

export default function UpdateProfileForm({ initialData }: UpdateProfileFormProps) {
    const auth = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({ ...defaultFormData, ...initialData })
    const [userData, setUserData] = useState<any>(null)

    useEffect(() => {
        const fetchUserData = async () => {
            if (!auth?.user) return;

            try {
                const userRef = doc(db, 'users', auth.user.uid);
                const docSnap = await getDoc(userRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setUserData(data);
                    // 기존 데이터가 있으면 폼 데이터 업데이트
                    setFormData(prev => ({
                        ...prev,
                        displayName: data.displayName || prev.displayName,
                        lastName: data.lastName || prev.lastName,
                        firstName: data.firstName || prev.firstName,
                        address: data.address || prev.address,
                        phoneNumber: data.phoneNumber || prev.phoneNumber,
                        birthDate: data.birthDate || prev.birthDate,
                        userPoint: data.points || 0,
                        userEmail: data.email || ''
                    }));
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, [auth?.user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!auth) return

        setIsLoading(true)
        try {
            await auth.updateUserProfile(formData)
            toast.success("프로필이 성공적으로 업데이트되었습니다!")
        } catch (error) {
            toast.error("프로필 업데이트 중 오류가 발생했습니다.")
            console.error("Profile update error:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1]
            setFormData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [addressField]: value
                }
            }))
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }))
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="displayName">Name</Label>
                <Input
                    id="displayName"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    placeholder=""
                />
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Last Name"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="lastName">First Name</Label>
                    <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="First Name"
                    />
                </div>
            </div>
            <div className="space-y-2 mt-6">
                <Label>Adress</Label>
                <div className="space-y-2 mt-4">
                    <Label>Street</Label>
                    <Input
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleChange}
                        placeholder="Street Address"
                    />
                    <div className="grid grid-cols-2 gap-2 mt-2">
                        <div className="space-y-2">
                            <Label>City</Label>
                            <Input
                                name="address.city"
                                value={formData.address.city}
                                onChange={handleChange}
                                placeholder="City"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>State</Label>
                            <Input
                                name="address.state"
                                value={formData.address.state}
                                onChange={handleChange}
                                placeholder="State"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                            <Label>
                                Zip Code
                            </Label>
                            <Input
                                name="address.zipCode"
                                value={formData.address.zipCode}
                                onChange={handleChange}
                                placeholder="Zip Code"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Country</Label>
                            <Input
                                name="address.country"
                                value={formData.address.country}
                                onChange={handleChange}
                                placeholder="Country"
                            />
                        </div>

                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-6">
                <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="Phone Number"
                    />
                </div>
                <div className="space-y-2">
                    <PickCalenderDate
                        onDateSelect={(date) => {
                            setFormData(prev => ({
                                ...prev,
                                birthDate: date.toISOString().split('T')[0]
                            }))
                        }}
                    />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="userPoint">Point</Label>
                <Input
                    id="userPoint"
                    name="userPoint"
                    value={formData.userPoint}
                    disabled
                />
            </div>
            <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Update Profile"}
            </Button>
        </form>
    )
} 