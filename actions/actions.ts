"use server";

import { adminDb } from "@/firebase-admin";
import liveblocks from "@/lib/liveblocks";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define the possible return types of createNewDocument
export type CreateDocumentResponse =
  | { docId: string }
  | Response;

export async function createNewDocument(): Promise<CreateDocumentResponse> {
  // Get the authenticated user (session claims)
  await auth.protect();
  const { userId, sessionClaims } = await auth();
  const user = await currentUser();
  // If no user is authenticated, throw an error or return a message
  if (!userId) {
    return NextResponse.json(
      { error: "Error: No signed in user" },
      { status: 401 }
    );
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

  return { docId: docRef.id }; // Return an object with docId on success
}

export async function deleteDocument(roomId: string) {
  auth.protect();

  console.log("deleteDocument", roomId);
  try {
    // Delete the document reference itself
    await adminDb.collection("documents").doc(roomId).delete();

    const query = await adminDb
      .collectionGroup("rooms")
      .where("roomId", "==", roomId)
      .get();

    const batch = adminDb.batch();

    // Delete the room reference in the user's collection for every user in the room
    query.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    // Delete the room in Liveblocks
    await liveblocks.deleteRoom(roomId);

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export async function inviteUserToDocument(roomId: string, email: string) {
  auth.protect();
  const { sessionClaims } = await auth();

  if (sessionClaims?.email === email) {
    return {
      success: false,
      message: "Cannot invite yourself to a document.",
    };
  }

  console.log("inviteUserToDocument", roomId, email);

  try {
    await adminDb
      .collection("users")
      .doc(email)
      .collection("rooms")
      .doc(roomId)
      .set({
        userId: email,
        role: "editor",
        createdAt: new Date(),
        roomId,
      });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export async function removeUserFromDocument(roomId: string, email: string) {
  auth.protect();

  console.log("Remove user from Document", roomId, email);

  try {
    await adminDb
      .collection("users")
      .doc(email)
      .collection("rooms")
      .doc(roomId)
      .delete();

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}
