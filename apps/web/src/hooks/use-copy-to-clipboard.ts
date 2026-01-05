import { useCallback, useRef, useState } from "react";

type CopyStatus = "idle" | "success" | "error";

export function useCopyToClipboard(options?: { resetAfterMs?: number }) {
    const resetAfterMs = options?.resetAfterMs ?? 1500;

    const [status, setStatus] = useState<CopyStatus>("idle");
    const [error, setError] = useState<unknown>(null);
    const timeoutRef = useRef<number | null>(null);

    const reset = useCallback(() => {
        setStatus("idle");
        setError(null);
    }, []);

    const copy = useCallback(
        async (text: string) => {
            if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
            setError(null);

            try {
                if (!text) throw new Error("Nothing to copy");

                // Prefer modern clipboard API (requires secure context: https / localhost)
                if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
                    await navigator.clipboard.writeText(text);
                } else {
                    // Fallback for older browsers
                    const textarea = document.createElement("textarea");
                    textarea.value = text;
                    textarea.setAttribute("readonly", "");
                    textarea.style.position = "fixed";
                    textarea.style.left = "-9999px";
                    textarea.style.top = "-9999px";
                    document.body.appendChild(textarea);
                    textarea.select();

                    const ok = document.execCommand("copy");
                    document.body.removeChild(textarea);

                    if (!ok) throw new Error("Copy failed");
                }

                setStatus("success");
                timeoutRef.current = window.setTimeout(reset, resetAfterMs);
                return true;
            } catch (e) {
                setStatus("error");
                setError(e);
                timeoutRef.current = window.setTimeout(reset, resetAfterMs);
                return false;
            }
        },
        [reset, resetAfterMs]
    );

    return {
        copy,
        status,          // "idle" | "success" | "error"
        copied: status === "success",
        error,
        reset,
    };
}
