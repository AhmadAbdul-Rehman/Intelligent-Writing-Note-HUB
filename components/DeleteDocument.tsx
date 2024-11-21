"use client";
import React, { useState, useTransition } from "react";
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
import { Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { deleteDocument } from "@/actions/actions";
import { toast } from "sonner";

const DelteDocument = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isPanding, startTransition] = useTransition();
    const pathname = usePathname();
    const router = useRouter();

    const handleDelete = async () => {
        const roomId = pathname.split("/").pop();
        if (!roomId) return;

        startTransition(async () => {
            const success = await deleteDocument(roomId);

            if (success) {
                setIsOpen(false);
                router.replace("/")
                toast.success("Room deleted successfully!");
            } else {
                toast.error("Faild to delete room!");
            }
        });
    };
    return (
        <div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <Button asChild variant="destructive">
                    <DialogTrigger>Delete</DialogTrigger>
                </Button>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-center mb-2">
                            Are you sure you want to Delete?
                        </DialogTitle>
                        <DialogDescription>
                            This will delete the document and all its contents,
                            removing all users from the document
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDelete}
                            className="mt-2 sm:mt-0"
                            disabled={isPanding}
                        >
                            {isPanding ? (
                                <span className="inline-flex items-center gap-2">
                                    <Loader2 className="animate-spin" />
                                    Deleting...{" "}
                                </span>
                            ) : (
                                "Delete"
                            )}
                        </Button>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Close
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default DelteDocument;
