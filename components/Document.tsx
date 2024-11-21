"use client";
import React, { FormEvent, useEffect, useState, useTransition } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { toast } from "sonner";
import Editor from "./Editor";
import useOwner from "@/lib/useOwner";
import DelteDocument from "./DeleteDocument";
import { Smile } from "lucide-react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import InviteUser from "./InviteUser";

const Document = ({ id }: { id: string }) => {
    if (!id) {
        return <div>Invalid Document ID</div>; // Guard against invalid IDs
    }

    const [data, loading, error] = useDocumentData(doc(db, "documents", id));
    const [input, setInput] = useState("");
    const [isUpdating, startTransition] = useTransition();
    const isOwner = useOwner();
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    useEffect(() => {
        if (data) {
            setInput(data.title);
        }
    }, [data]);

    // Update document title
    const updateTitle = async (e: FormEvent) => {
        e.preventDefault();

        if (input.trim()) {
            startTransition(async () => {
                try {
                    // Update document in Firestore
                    await updateDoc(doc(db, "documents", id), {
                        title: input,
                    });

                    toast.success("Title updated successfully!");
                } catch (error) {
                    toast.error("Failed to update title. Try again!");
                }
            });
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !isUpdating) {
            e.preventDefault();
            updateTitle(e);
        }
    };

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        setInput((prevInput) => prevInput + emojiData.emoji); // Append emoji
        setShowEmojiPicker(false); // Hide emoji picker
    };

    return (
        <>
            <div className="w-full flex-1 h-full bg-white p-5">
                <div className="flex max-w-5xl mx-auto justify-between pb-5">
                    <form
                        onSubmit={updateTitle}
                        className="relative flex flex-1 space-x-2"
                    >
                        {/* Input for updating title */}
                        <div className="relative flex-1">
                            <Input
                                value={input}
                                className="w-full"
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <Button
                                type="button"
                                onClick={() =>
                                    setShowEmojiPicker((prev) => !prev)
                                }
                                className="absolute top-1/2 -translate-y-1/2 right-0 select-none"
                                variant="secondary"
                            >
                                <Smile />
                            </Button>
                        </div>

                        <Button
                            disabled={isUpdating}
                            type="submit"
                            className="select-none"
                        >
                            {isUpdating ? "Updating..." : "Update Title"}
                        </Button>
                    </form>
                    <div className="flex gap-1 px-1">
                        {isOwner && (
                            <>
                                <InviteUser />
                                <DelteDocument />
                            </>
                        )}
                        {showEmojiPicker && (
                            <div className="absolute top-full mt-3 z-10 right-1/4">
                                {/* Emoji Picker Component */}
                                <EmojiPicker onEmojiClick={handleEmojiClick} />
                            </div>
                        )}
                    </div>
                </div>
                <hr className="pb-5" />

                {/* Collaborative Editor */}
                <Editor />
            </div>
        </>
    );
};

export default Document;
