import RoomProvider from "@/components/RoomProvider";
import { auth } from "@clerk/nextjs/server";
import React from "react";

const DocLayout = async ({
    children,
    params: paramsPromise,
}: {
    children: React.ReactNode;
    params: Promise<{ id: string }>;
}) => {
    const { id } = await paramsPromise; // Unwrap the `params` Promise
    auth.protect();
    return <RoomProvider roomId={id}>{children}</RoomProvider>;
};

export default DocLayout;
