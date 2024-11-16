"use client";
import React, { useEffect, useState } from "react";
import { useRoom } from "@liveblocks/react/suspense";
import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { Button } from "./ui/button";
import { MoonIcon, SunIcon } from "lucide-react";

const Editor = () => {
    const room = useRoom();
    const [doc, setDoc] = useState<Y.Doc>();
    const [provider, setProvider] = useState<LiveblocksYjsProvider>();
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
    
    }, [room])
    

    const style = `hover:text-white ${
        darkMode
            ? "text-gray-300 bg-gray-700 hover:bg-gray-500 hover:text-gray-200"
            : "text-gray-200 bg-gray-400 hover:bg-gray-300 hover:text-gray-700"
    }`;
    return (
        <div className="max-w-6xl mx-auto ">
            <div className="flex items-center gap-2 justify-end mb-10">
                {/* TranslateDocument Ai */}
                {/* ChatToDocument Ai */}

                {/* Dark Mode */}
                <Button
                    className={style}
                    onClick={() => setDarkMode(!darkMode)}
                >
                    {darkMode ? <SunIcon /> : <MoonIcon />}
                </Button>
            </div>

            {/* Block NOte */}
            
        </div>
    );
};

export default Editor;
