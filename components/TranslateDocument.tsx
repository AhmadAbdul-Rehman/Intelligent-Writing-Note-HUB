"use client";
import React, { FormEvent, useState, useTransition } from "react";

import * as Y from "yjs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Button } from "./ui/button";
import { BotIcon, LanguagesIcon, LoaderPinwheel } from "lucide-react";
import { toast } from "sonner";
import Markdown from "react-markdown";

type Language =
    | "english"
    | "spanish"
    | "portuguese"
    | "french"
    | "german"
    | "chinese"
    | "arabic"
    | "hindi"
    | "russian"
    | "japanese";

const languages: Language[] = [
    "english",
    "spanish",
    "portuguese",
    "french",
    "german",
    "chinese",
    "arabic",
    "hindi",
    "russian",
    "japanese",
];
const TranslateDocument = ({ doc }: { doc: Y.Doc }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [language, setLanguage] = useState<string>("");
    const [smummary, setSmummary] = useState("");
    const [isPending, startTransition] = useTransition();

    const handleAskQuestion = (e: FormEvent) => {
        e.preventDefault();

        startTransition(async () => {
            const documentData = doc.get("document-store").toJSON();

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/translateDocument`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        documentData,
                        targetLang: language,
                    }),
                }
            );

            if (res.ok) {
                const { translated_text } = await res.json();

                setSmummary(translated_text);
                toast.success("Translated Summary successfully!");
            }
        });
    };
    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <Button asChild variant="outline">
                    <DialogTrigger>
                        <LanguagesIcon />
                        Translate
                    </DialogTrigger>
                </Button>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-center mb-2">
                            Translate the Document
                        </DialogTitle>
                        <DialogDescription>
                            Select a Language and AI will Translate a summary of
                            the document in the selected language.
                        </DialogDescription>

                        <hr className="mt-5" />
                    </DialogHeader>
                    {smummary && (
                        <div className="flex flex-col item-start max-h-96 overflow-y-scroll gap-2 p-5 bg-gray-100 ">
                            <div className="flex">
                                <BotIcon className="w-10" />
                                <p className="font-bold">
                                    ThinkBoard{" "}
                                    {isPending ? "is thinking..." : "Says:"}
                                </p>
                            </div>
                            <span>
                                {isPending ? (
                                    <LoaderPinwheel className="animate-spin px-2 w-8" />
                                ) : (
                                    <Markdown>{smummary}</Markdown>
                                )}
                            </span>
                        </div>
                    )}
                    <form className="flex gap-2" onSubmit={handleAskQuestion}>
                        <Select
                            value={language}
                            onValueChange={(value) => setLanguage(value)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a Language" />
                            </SelectTrigger>

                            <SelectContent>
                                {languages.map((language) => (
                                    <SelectItem key={language} value={language}>
                                        {language.charAt(0).toUpperCase() +
                                            language.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button type="submit" disabled={!language || isPending}>
                            {isPending ? "Translating..." : "Translate"}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default TranslateDocument;
