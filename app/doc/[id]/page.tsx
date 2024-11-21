"use client";
import Document from "@/components/Document";
import React from "react";

type Props = {
    params: Promise<{ id: string }>; // params is now a Promise
};

const DocumentPage = ({ params }: Props) => {
    const { id } = React.use(params); // Unwrap the Promise

    return (
        <div className="flex flex-1 min-h-screen">
            <Document id={id} />
        </div>
    );
};

export default DocumentPage;
