"use client";
import React, { FormEvent, useEffect, useState, useTransition } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { toast, ToastContainer } from "react-toastify";

const Document = ({ id }: { id: string }) => {
    const [data, loading, error] = useDocumentData(doc(db, "documents", id));
    const [input, setInput] = useState("");
    const [isUpdating, startTransition] = useTransition();

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

                    toast.success("Title updated", {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        progress: undefined,
                        closeButton: false,
                    });
                } catch (error) {
                    toast.error("Failed to update title", {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        closeButton: false,
                        progress: undefined,
                    });
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

    return (
        <>
            <ToastContainer />
            <div className="w-full">
                <div className="flex max-w-5xl mx-auto justify-between pb-5">
                    <form
                        onSubmit={updateTitle}
                        className="flex flex-1 space-x-2"
                    >
                        {/* Input for updating title */}
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />

                        <Button
                            disabled={isUpdating}
                            type="submit"
                            className="select-none"
                        >
                            {isUpdating ? "Updating..." : "Update Title"}
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Document;
