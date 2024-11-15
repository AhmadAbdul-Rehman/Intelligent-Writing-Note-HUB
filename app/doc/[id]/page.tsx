"use client";
import Document from "@/components/Document";
import React from "react";

const DocumentPage = ({ params: { id } }: { params: { id: string } }) => {
    return(
        <div className="flex flex-1 min-h-screen">
            <Document id={id} />
        </div>
    )
};

export default DocumentPage;
