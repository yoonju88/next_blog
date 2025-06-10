"use client"
import { auth, db } from "@/firebase/client"
import { removeToken, setToken } from "./actions"
import {
    signInWithPopup,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    type User,
    updateProfile
} from "firebase/auth"
import { createContext, useState, useEffect, useContext } from "react"
import { doc, setDoc, getDoc } from "firebase/firestore"

interface ParsedToken {
    isAdmin?: boolean;
    // ... 기타 클레임
}

interface UserProfile {
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
    userPoint? :number;
    userEmail?:string;

}

// Context에서 관리할 데이터의 구조를 정의
type AuthContextType = {
    currentUser: User | null;
    logout: () => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    customClaims: ParsedToken | null;
    loginWithEmail: (email: string, password: string) => Promise<void>;
    updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
}
//인증 관련 데이터를 저장할 Context
// 초기값은 null로 설정되어 있으며, AuthContext.Provider를 사용해 데이터를 전달
const AuthContext = createContext<AuthContextType | null>(null)
// currentUser: null,
// logout: async () => { },
// loginWithGoogle: async () => { },
// customClaims: null,

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [customClaims, setCustomClaims] = useState<ParsedToken | null>(null)

    // Firebase 인증 상태 변화를 감지하고, currentUser를 업데이트
    useEffect(() => {
        const unsuscribe = auth.onAuthStateChanged(async (user) => {
            setCurrentUser(user ?? null)
            if (user) {
                const tokenResult = await user.getIdTokenResult()
                const token = tokenResult.token;
                const refreshToken = user.refreshToken;
                const claims = tokenResult.claims as ParsedToken
                setCustomClaims(claims ?? null)
                if (token && refreshToken) {
                    await setToken({
                        token,
                        refreshToken
                    });
                }
            } else {
                await removeToken()
            }
        })
        return () => unsuscribe()
    }, [])

    const logout = async () => {
        await auth.signOut();
    }

    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider()
        try {
            const result = await signInWithPopup(auth, provider)
            const user = result.user;

            const userRef = doc(db, 'users', user.uid)
            const docSnap = await getDoc(userRef)

            if (!docSnap.exists()) {
                // 새로운 사용자일 경우 정보 저장
                await setDoc(userRef, {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    createdAt: new Date(),
                    isAdmin: false,
                    cart: [],
                    address: { // 주소 필드 추가 (초기값은 비워둡니다)
                        street: '',
                        city: '',
                        state: '',
                        zipCode: '',
                        country: '',
                    },
                    points: 0, // 초기 적립 포인트 0
                })
                console.log('New user created in Firestore:', user.uid);
            } else {
                // 기존 사용자일 경우 정보 업데이트 (필요하다면)
                // 예: 마지막 로그인 시간 업데이트
                await setDoc(userRef, { lastLoginAt: new Date() }, { merge: true });
                console.log('Existing user logged in:', user.uid);
            }
        } catch (error: unknown) { // 에러 타입 지정
            let errorMessage: string;
            if (error instanceof Error) {
                // Error 객체이거나 Error를 상속받은 객체 (FirebaseError 포함)
                errorMessage = error.message;
            } else if (typeof error === 'object' && error !== null && 'message' in error && typeof (error as any).message === 'string') {
                // 'message' 속성을 가진 일반 객체인 경우 (TypeScript가 추론하지 못할 때)
                errorMessage = (error as any).message; // 'any'로 캐스팅하여 안전하게 접근
            } else if (typeof error === 'string') {
                // 에러 자체가 문자열인 경우
                errorMessage = error;
            } else {
                // 그 외 알 수 없는 형태의 에러
                errorMessage = 'An unexpected error occurred during Google sign-in.';
            }
            console.error('Error signing in with Google:', errorMessage);
            throw error;
        }
    }

    const loginWithEmail = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password)
    }

    const updateUserProfile = async (data: Partial<UserProfile>) => {
        if (!currentUser) {
            throw new Error('No user is currently logged in');
        }

        try {
            const userRef = doc(db, 'users', currentUser.uid);
            
            // Firestore 문서 업데이트
            await setDoc(userRef, {
                ...data,
                updatedAt: new Date()
            }, { merge: true });

            // Firebase Auth 프로필 업데이트 (displayName과 photoURL만 가능)
            if (data.displayName || data.photoURL) {
                await updateProfile(currentUser, {
                    displayName: data.displayName,
                    photoURL: data.photoURL
                });
            }

            console.log('User profile updated successfully');
        } catch (error) {
            console.error('Error updating user profile:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                logout,
                loginWithGoogle,
                customClaims,
                loginWithEmail,
                updateUserProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used with au AuthProvider')
    }
    return context;
}