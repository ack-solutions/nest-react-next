import { useMemo, useState, useCallback } from 'react';


export interface UseCopyToClipboardReturn {
  copy: CopyFn;
  copiedText?: CopiedValue;
}

;
type CopiedValue = string | null;

type CopyFn = (text: string) => Promise<boolean>;

export function useCopyToClipboard(): UseCopyToClipboardReturn {
    const [copiedText, setCopiedText] = useState<CopiedValue>(null);

    const copy: CopyFn = useCallback(
        async (text) => {
            if (!navigator?.clipboard) {
                console.error('Clipboard not supported');
                return false;
            }

            try {
                await navigator.clipboard.writeText(text);
                setCopiedText(text);
                return true;
            } catch (error) {
                console.error('Copy failed', error);
                setCopiedText(null);
                return false;
            }
        },
        [setCopiedText]
    );

    const memoizedValue = useMemo(() => ({
        copy,
        copiedText 
    }), [copy, copiedText]);

    return memoizedValue;
}
