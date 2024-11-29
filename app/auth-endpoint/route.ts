import { adminDb } from "@/firebase-admin";
import liveblocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    auth.protect();

    const { sessionClaims } = await auth();
    const { room } = await req.json();

    if (!sessionClaims?.email) {
        return NextResponse.json(
            { message: "Unauthorized: Email is missing from session claims." },
            { status: 401 }
        );
    }

    const session = liveblocks.prepareSession(sessionClaims.email, {
        userInfo: {
            name: sessionClaims.fullName || "Unknown User", // Use default value if null/undefined
            email: sessionClaims.email, // Already checked above
            avatar: sessionClaims.image || "", // Provide a fallback for avatar
        },
    });

    const usersInRoom = await adminDb
        .collectionGroup("rooms")
        .where("userId", "==", sessionClaims.email)
        .get();

    const userInRoom = usersInRoom.docs.find((doc) => doc.id === room);

    if (userInRoom?.exists) {
        session.allow(room, session.FULL_ACCESS);
        const { body, status } = await session.authorize();

        return new Response(body, { status });
    } else {
        return NextResponse.json(
            { message: "You are not in this room." },
            { status: 403 }
        );
    }
}
