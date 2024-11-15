import { useCollection } from "react-firebase-hooks/firestore";
import { collectionGroup, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";

// Define the RoomDocument type, but do not include `id` here
interface RoomDocument {
  createdAt: string;
  role: "owner" | "editor";
  roomId: string;
  userId: string;
  title: string;
}

// Define the type that includes both document data and the document `id`
interface RoomDocumentWithId extends RoomDocument {
  id: string; // This will represent the Firestore document ID
}

export const useDocuments = () => {
  const { user } = useUser();
  const [groupedData, setGroupedData] = useState<{
    owner: RoomDocumentWithId[];
    editor: RoomDocumentWithId[];
  }>({
    owner: [],
    editor: [],
  });

  // Fetch documents from Firestore using the useCollection hook
  const [data] = useCollection(
    user &&
      query(
        collectionGroup(db, "rooms"),
        where("userId", "==", user.emailAddresses[0].toString())
      )
  );

  useEffect(() => {
    if (!data) return;

    // Group the documents into `owner` and `editor` based on the `role`
    const grouped = data.docs.reduce<{
      owner: RoomDocumentWithId[];
      editor: RoomDocumentWithId[];
    }>((acc, curr) => {
      const roomData = curr.data() as RoomDocument; // Get the room data
      const docWithId: RoomDocumentWithId = {
        id: curr.id, // Firestore document ID
        ...roomData,  // Spread the room data here
      };

      if (roomData.role === "owner") {
        acc.owner.push(docWithId);
      } else {
        acc.editor.push(docWithId);
      }
      
      return acc;
    }, {
      owner: [],
      editor: [],
    });

    setGroupedData(grouped);
  }, [data]);

  return groupedData;
};
