"use client";
import React from "react";
import { useMyPresence, useOthers } from "@liveblocks/react/suspense";
import FollowPointer from "./FollowPointer";

const LiveCursorProvider = ({ children }: { children: React.ReactNode }) => {
    const [, updateMyPresence] = useMyPresence(); // Omit `myPresence`
    const others = useOthers();

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        const cursor = { x: Math.floor(e.pageX), y: Math.floor(e.pageY) };
        updateMyPresence({ cursor });
    };
    const handlePointerLeave = () => {
        updateMyPresence({ cursor: null });
    };

    return (
        <div
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
        >
            {others
                .filter((other) => other.presence.cursor !== null)
                .map(({ connectionId, presence, info }) => (
                    <FollowPointer
                        key={connectionId}
                        info={info}
                        x={presence.cursor!.x}
                        y={presence.cursor!.y}
                    />
                ))}
            {children}
        </div>
    );
};

export default LiveCursorProvider;
