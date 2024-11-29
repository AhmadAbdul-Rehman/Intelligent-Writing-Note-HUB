import React from "react";
import Link from "next/link";
import { format } from "date-fns"; // Importing date-fns for date formatting
import { doc, Timestamp } from "firebase/firestore"; // Correct import for Firebase Timestamp
import { useDocumentData } from "react-firebase-hooks/firestore";
import { db } from "@/firebase";

interface DocCardProps {
    id: string;
    href: string;
    role: string;
    createdAt: Timestamp; // Firebase Timestamp type
}

const DocCards = ({ id, href, role, createdAt }: DocCardProps) => {
    // Format the Firebase Timestamp into a readable date string
    const formatTimestamp = (timestamp: Timestamp) => {
        const date = timestamp.toDate(); // Convert Firebase Timestamp to JavaScript Date
        return format(date, "MMMM dd, yyyy HH:mm"); // Format it to a readable string
    };

    const [data, loading, error] = useDocumentData(doc(db, "documents", id));

    // If loading or error, we can return a loading state or error message
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error fetching document</div>;

    return (
        <Link href={href} key={id}>
            <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-gray-800 truncate pb-2">
                    {data?.title}
                </h3>
                <p className="text-sm text-gray-500 pb-1">
                    {createdAt ? formatTimestamp(createdAt) : "No Date"}
                </p>
                <p className="text-sm text-gray-500">Role: {role}</p>
            </div>
        </Link>
    );
};

export default DocCards;
