import { DecodedIdToken } from 'firebase-admin/auth';
import { cookies } from 'next/headers'
import { auth } from '@/firebase/server';
import React from 'react'
import { redirect } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import UpdatePasswordForm from './update-password-form';
import DeleteAccountButton from './delete-account-button';

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
        <div className='max-w-md mx-auto '>
            <Card className='mt-10'>
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">
                        My Account
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Label>Email</Label>
                    <div>{decodedToken.email}</div>
                    {!!isPasswordProvider && (
                        <UpdatePasswordForm />
                    )}
                </CardContent>
                {!decodedToken.admin && (
                    <CardFooter className='flex flex-col items-start'>
                        <h2 className='text-red-500 text-2xl font-bold mb-2'>Danger Zone</h2>
                        <DeleteAccountButton />
                    </CardFooter>
                )}
            </Card>
        </div>
    )
}
