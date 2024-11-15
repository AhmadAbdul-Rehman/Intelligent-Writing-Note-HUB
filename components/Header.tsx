"use client";
import {
    SignedIn,
    SignedOut,
    SignInButton,
    UserButton,
} from "@clerk/clerk-react";
import { useUser } from "@clerk/nextjs";
import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Breadcrumbs from "./Breadcrumbs";

function Header() {
    const { user, isLoaded, isSignedIn } = useUser();

    // If user data is still loading, display skeletons for all parts of the header
    if (!isLoaded) {
        return (
            <div className="flex items-center justify-between p-5 uppercase font-semibold tracking-tighter">
                {/* Show Skeleton for title */}
                <Skeleton width={150} height={30} />
                
                {/* Show Skeleton for the UserButton */}
                <Skeleton width={40} height={40} circle={true} />

                {/* Show Skeleton for Breadcrumbs (SignIn/SignOut buttons) */}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-between p-5 uppercase font-semibold tracking-tighter">
            {/* User's name when signed in */}
            {isSignedIn ? (
                <h1 className="text-2xl">
                    {user?.firstName}
                    {`'s`} Space
                </h1>
            ) : (
                // Skeleton for title when user is not signed in
                <h1>No User SignIn</h1>
            )}

            {/* Breadcrumbs area with SignIn or UserButton */}
            <Breadcrumbs />
            <div>
                <SignedOut>
                    <SignInButton />
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>
        </div>
    );
}

export default Header;
