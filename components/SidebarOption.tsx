import { db } from "@/firebase";
import { doc } from "firebase/firestore";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";

const SidebarOption = ({ href, id }: { href: string; id: string }) => {
    const [data, loading, error] = useDocumentData(doc(db, "documents", id));
    const pathname = usePathname();
    const isActive = pathname === href || pathname.startsWith(href + "/");
    return (
        <Link
            href={href}
            className={`relative border border-b-2 p-2 rounded-md ${
                isActive
                    ? "bg-gray-300 font-bold border-black"
                    : "border-gray-400"
            }`}
        >
            <p className="truncate">{data?.title}</p>
        </Link>
    );
};

export default SidebarOption;
