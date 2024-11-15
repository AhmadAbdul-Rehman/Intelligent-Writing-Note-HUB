import React from "react";

const LoadingSpinner = () => {
    return (
        <div className="h-full w-full bg-white loader flex items-center justify-center">
            <span
                className="relative inline-block bg-primaryLoader text-primaryLoader w-3 h-5 animate-escaleY"
                style={{ animationDelay: "-0.16s" }}
            >
                <span className="absolute top-0 left-[1em] bg-primaryLoader w-3 h-5 animate-escaleY"></span>
                <span
                    className="absolute top-0 left-[-1em] bg-primaryLoader w-3 h-5 animate-escaleY"
                    style={{ animationDelay: "-0.32s" }}
                ></span>
            </span>
        </div>
    );
};

export default LoadingSpinner;
