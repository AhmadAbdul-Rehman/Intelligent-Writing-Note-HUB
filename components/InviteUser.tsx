"use client";
import React, { FormEvent, useState, useTransition } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { inviteUserToDocument } from "@/actions/actions";
import { toast } from "sonner";
import { Input } from "./ui/input";

const InviteUser = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [isPending, startTransition] = useTransition();
    const pathname = usePathname();

    const handleInvite = async (e: FormEvent) => {
        e.preventDefault();

        const roomId = pathname.split("/").pop();
        if (!roomId) {
            toast.error("Invalid room ID.");
            return;
        }

        if (!email.includes("@")) {
            toast.error("Please enter a valid email address.");
            return;
        }

        startTransition(async () => {
            const response = await inviteUserToDocument(roomId, email);

            if (response.success) {
                setIsOpen(false);
                setEmail("");
                toast.success("User added to room successfully!");
            } else {
                toast.error(response.message || "Failed to add user to room!");
            }
        });
    };

    return (
        <div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <Button asChild variant="outline">
                    <DialogTrigger>Invite</DialogTrigger>
                </Button>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-center mb-2">
                            Invite a User to Collaborate
                        </DialogTitle>
                        <DialogDescription>
                            Enter the email of the user you want to invite.
                        </DialogDescription>
                    </DialogHeader>
                    <form className="flex gap-2" onSubmit={handleInvite}>
                        <label htmlFor="email" className="sr-only">Email</label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Email"
                            className="w-full"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button type="submit" disabled={!email || isPending}>
                            {isPending ? "Inviting..." : "Invite"}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default InviteUser;
