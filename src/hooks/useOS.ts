import { useState, useEffect } from "react";

export type OS = "mac" | "windows" | "linux" | "unknown";

export const useOS = (): OS => {
    const [os, setOS] = useState<OS>("unknown");

    useEffect(() => {
        // Avoid running on server side during SSR
        if (typeof window === "undefined") return;

        const userAgent = window.navigator.userAgent.toLowerCase();

        if (userAgent.includes("mac")) {
            setOS("mac");
        } else if (userAgent.includes("win")) {
            setOS("windows");
        } else if (userAgent.includes("linux") && !userAgent.includes("android")) {
            setOS("linux");
        } else {
            setOS("unknown");
        }
    }, []);

    return os;
};
