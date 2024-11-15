import LiveBlocksProvider from "@/components/LiveBlocksProvider";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
    return <LiveBlocksProvider>{children}</LiveBlocksProvider>;
};

export default layout;
