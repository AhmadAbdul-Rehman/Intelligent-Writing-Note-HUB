"use client";
import React, { FormEvent, useState, useTransition } from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { inviteUserToDocument } from "@/actions/actions";
import { toast } from "sonner";
import { Input } from "./ui/input";
import * as Y from "yjs";
import { BotIcon, LoaderPinwheel, MessageCircleCode } from "lucide-react";
import Markdown from "react-markdown";

const ChatToDocument = ({ doc }: { doc: Y.Doc }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [isPending, startTransition] = useTransition();
    const [summary, setSummary] = useState("");
    const [question, setQuestion] = useState("");

    const handleAskQuestion = async (e: FormEvent) => {
        e.preventDefault();

        setQuestion(input);

        startTransition(async () => {
            const documentData = doc.get("document-store").toJSON();

            const res = await fetch(` http://127.0.0.1:8787/chatToDocument`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    documentData,
                    question: input,
                }),
            });

            if (res.ok) {
                const { message } = await res.json();
                console.log(message)
                setInput("");
                setSummary(message);

                toast.success("Question asked successfully!");
            }
        });
    };

    return (
        <div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <Button asChild variant="outline">
                    <DialogTrigger>
                        <MessageCircleCode className="mr-2" />
                        Chat to ThinkBoard
                    </DialogTrigger>
                </Button>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-center mb-2">
                            Chat to the ThinkBoard!
                        </DialogTitle>
                        <DialogDescription>
                            Ask a question and chat to the document with
                            ThinkBoard AI.
                        </DialogDescription>

                        <hr className="mt-5" />

                        {question && (
                            <p className="mt-5 text-gray-500">Q: {question}</p>
                        )}
                    </DialogHeader>

                    {summary && (
                        <div className="flex flex-col item-start max-h-96 overflow-y-scroll overflow-x-hidden gap-2 p-5 bg-gray-100 ">
                            <div className="flex">
                                <BotIcon className="w-10" />
                                <p className="font-semibold">
                                    ThinkBoard{" "}
                                    {isPending ? "is thinking..." : "Says:"}
                                </p>
                            </div>
                            <p>
                                {isPending ? (
                                    <LoaderPinwheel className="animate-spin px-2 w-8" />
                                ) : (
                                    <Markdown>{summary}</Markdown>
                                )}
                            </p>
                        </div>
                    )}

                    <form className="flex gap-2" onSubmit={handleAskQuestion}>
                        <Input
                            type="text"
                            placeholder="i.e. what is this about?"
                            className="w-full"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <Button type="submit" disabled={!input || isPending}>
                            {isPending ? "Asking..." : "Ask"}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ChatToDocument;
