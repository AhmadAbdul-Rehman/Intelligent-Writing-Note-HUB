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
import Image from "next/image";
import logo from "../public/hink.png";

function Header() {
    // const { user, isLoaded, isSignedIn } = useUser();
    const { isLoaded} = useUser();

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
            <Image src={logo} className="w-40" alt="logo" />

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
