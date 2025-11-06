import { DecodedIdToken } from 'firebase-admin/auth';
import { cookies } from 'next/headers'
import { auth } from '@/firebase/server';
import React from 'react'
import { redirect } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import UpdatePasswordForm from './update-password-form';
import DeleteAccountButton from './delete-account-button';
import UpdateProfileForm from './update-profile-form';
import { Input } from '@/components/ui/input';

export default async function Account() {
    const cookieStore = await cookies();
    const token = cookieStore.get("firebaseAuthToken")?.value
    //console.log(token)
    if (!token) { redirect('/') }

    let decodedToken: DecodedIdToken;
    try {
        decodedToken = await auth.verifyIdToken(token)
    } catch {
        redirect('/')
    }

    const user = auth.getUser(decodedToken.uid)
    const isPasswordProvider = (await user).providerData.find(
        (provider) => provider.providerId === "password"
    )

    return (
        <Card className='py-10 px-4 w-[450px] sm:w-[600px] border-foreground/20'>
            <CardHeader>
                <CardTitle className="text-3xl font-bold">
                    My Account
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" value={decodedToken.email} disabled />
                </div>
                <div>
                    {!!isPasswordProvider && (
                        <UpdatePasswordForm />
                    )}
                </div>
                <UpdateProfileForm
                    initialData={{
                        displayName: decodedToken.name || '',
                        lastName: decodedToken.lastName || '',
                        firstName: decodedToken.fistName || '',
                        address: decodedToken.address || {
                            street: '',
                            city: '',
                            state: '',
                            zipCode: '',
                            country: ''
                        },
                        phoneNumber: decodedToken.phone_number || '',
                        birthDate: decodedToken.birth_date || '',
                    }}
                    userId={(await user).uid}
                />
            </CardContent>
            <div className="border-foreground/20 border-t-1" />
            {!decodedToken.admin && (
                <CardFooter className='flex flex-col items-start'>
                    <h2 className='text-red-500 text-xl font-semibold mb-2'>Would you like to delete your account? </h2>
                    <DeleteAccountButton />
                </CardFooter>
            )}

        </Card>
    )
}
