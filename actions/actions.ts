"use server";

import { adminDb } from "@/firebase-admin";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function createNewDocument() {
    // Get the authenticated user (session claims)
    await auth.protect()
    const { userId, sessionClaims } = await auth();
    const user = await currentUser();
    // If no user is authenticated, throw an error or return a message
    if (!userId) {
        return NextResponse.json({ error: 'Error: No signed in user' }, { status: 401 })
        throw new Error("Please Sign In first.");
    }
    if (!user) {
        return new Response("Unauthorized", { status: 401 });
    }
    const docCollectionRef = adminDb.collection("documents");
    const docRef = await docCollectionRef.add({
        title: "New Doc",
    });
    // Create room for the authenticated user in the database
    await adminDb
        .collection("users")
        .doc(sessionClaims?.email!) // Log the email if needed
        .collection("rooms")
        .doc(docRef.id)
        .set({
            userId: sessionClaims?.email, // You can log sessionClaims?.email here too
            role: "owner",
            createdAt: new Date(),
            roomId: docRef.id,
        });

    return {
        docId: docRef.id,
    };
}
