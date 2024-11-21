"use client";
import React, { useTransition } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { createNewDocument } from "@/actions/actions";
import { toast } from "sonner";
import "react-toastify/dist/ReactToastify.css";
import { Edit } from "lucide-react";

const NewDocumentButton = () => {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleCreateNewDocument = () => {
        startTransition(async () => {
            try {
                const { docId } = await createNewDocument();
                router.push(`/doc/${docId}`);
            } catch (error: any) {
                toast.error("Please Sign In first. Before Continue");
            }
        });
    };

    return (
        <Button onClick={handleCreateNewDocument} disabled={isPending}>
            {isPending ? "Creating..." : (<p className="inline-flex items-center gap-1">New Document<Edit /></p>)}
        </Button>
    );
};

export default NewDocumentButton;
