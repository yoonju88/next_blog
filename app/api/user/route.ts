import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/firebase/server";
import { addUserPoints, useUserPoints, getUserPoints } from '../../account/action';

export async function POST(req: NextRequest) {
    try {
        const { action, amount } = await req.json();
        const token = req.headers.get("authorization")?.replace("Bearer ", "");
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const decodedToken = await auth.verifyIdToken(token);
        const userId = decodedToken.uid;

        if (action === "addPoints") {
            const user = await addUserPoints(userId, amount);
            return NextResponse.json({ success: true, points: user.points });
        }

        if (action === "usePoints") {
            const user = await useUserPoints(userId, amount);
            return NextResponse.json({ success: true, points: user.points });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    } catch (error: any) {
        console.error("User API error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const token = req.headers.get("authorization")?.replace("Bearer ", "");
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const decodedToken = await auth.verifyIdToken(token);
        const userId = decodedToken.uid;

        const user = await getUserPoints(userId);
        return NextResponse.json({ success: true, user });
    } catch (error: any) {
        console.error("User API GET error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}