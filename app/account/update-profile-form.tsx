'use client'

import { useAuth } from "@/context/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/firebase/client"

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
            if (!auth?.currentUser) return;

            try {
                const userRef = doc(db, 'users', auth.currentUser.uid);
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
    }, [auth?.currentUser]);

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
                        placeholder=""
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="lastName">First Name</Label>
                    <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder=""
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
                        placeholder="거리 주소"
                    />
                    <div className="grid grid-cols-2 gap-2 mt-2">
                        <div className="space-y-2">
                            <Label>City</Label>
                            <Input
                                name="address.city"
                                value={formData.address.city}
                                onChange={handleChange}
                                placeholder="도시"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>State</Label>
                            <Input
                                name="address.state"
                                value={formData.address.state}
                                onChange={handleChange}
                                placeholder="주/도"
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
                                placeholder="우편번호"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Country</Label>
                            <Input
                                name="address.country"
                                value={formData.address.country}
                                onChange={handleChange}
                                placeholder="국가"
                            />
                        </div>

                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-6">
                <div className="space-y-2">
                    <Label htmlFor="phoneNumber">전화번호</Label>
                    <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="전화번호를 입력하세요"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="birthDate">생년월일</Label>
                    <Input
                        id="birthDate"
                        name="birthDate"
                        type="date"
                        value={formData.birthDate}
                        onChange={handleChange}
                    />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="userPoint">포인트</Label>
                <Input
                    id="userPoint"
                    name="userPoint"
                    value={formData.userPoint}
                    disabled
                />
            </div>
            <Button type="submit" disabled={isLoading}>
                {isLoading ? "저장 중..." : "프로필 업데이트"}
            </Button>
        </form>
    )
} 