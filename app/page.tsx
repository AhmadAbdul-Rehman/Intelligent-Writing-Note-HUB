"use client";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { ArrowLeftCircle } from "lucide-react";
import { useEffect, useState } from "react";
import DocPage from "./doc/page";

export default function Home() {
    const { user, isSignedIn } = useUser();

    const [greet, setGreet] = useState("");

    // Function to generate a time-based greeting
    const getGreeting = () => {
        const hours = new Date().getHours();
        if (hours < 12) {
            return "Good morning";
        } else if (hours < 18) {
            return "Good afternoon";
        } else {
            return "Good evening";
        }
    };

    // Set greeting once the component is mounted
    useEffect(() => {
        setGreet(getGreeting());
    }, []);

    return (
        <>
            <div className="flex flex-col h-full">
                <header className="p-4">
                    {isSignedIn ? (
                        <h1 className="font-semibold text-black text-2xl text-center">
                            {greet}, {user?.fullName}
                        </h1>
                    ) : (
                        <h1 className="text-gray-500 text-center text-xl">
                            Welcome To ThinkBoard
                        </h1>
                    )}
                </header>
                <main className="flex-1 flex items-center justify-center">
                    {isSignedIn ? (
                        <DocPage />
                    ) : (
                        <h1 className="text-xl text-gray-500 font-semibold">
                            Sign in to access your documents
                        </h1>
                    )}
                </main>
            </div>
        </>
    );
}
