import { useToasty } from '@admin/app/hook/use-toasty';
import { useCallback, useRef } from 'react';

const EXPORT_TOAST_ID_PREFIX = 'export-toast-';

export function useExportToasts({ showToasty, dismissToasty }: { showToasty: any; dismissToasty: any }) {
    const toastIdRef = useRef<string | null>(null);

    const onExportProgress = useCallback(
        (progress: { processedRows?: number; totalRows?: number; percentage?: number }) => {
            let message = 'Exporting data';
            if (progress?.percentage != null && progress.percentage >= 0) {
                message += `... ${progress.percentage.toFixed(0)}% (${progress.processedRows ?? 0}/${progress.totalRows ?? 0})`;
            } else {
                message += '... please wait';
            }

            if (toastIdRef.current === null) {
                toastIdRef.current = `${EXPORT_TOAST_ID_PREFIX}${Date.now()}`;
                showToasty(message, 'loading', { id: toastIdRef.current });
            } else {
                showToasty(message, 'loading', { id: toastIdRef.current });
            }
        },
        [showToasty],
    );

    const onExportComplete = useCallback(
        (result: { success: boolean; filename: string; totalRows: number }) => {
            const message = `Successfully exported ${result.totalRows} rows to ${result.filename}`;
            const id = toastIdRef.current;
            toastIdRef.current = null;
            if (id !== null) {
                showToasty(message, 'success', { id });
            } else {
                showToasty(message, 'success');
            }
        },
        [showToasty],
    );

    const onExportError = useCallback(
        (error: { message: string; code?: string }) => {
            const message = `Export failed: ${error.message}`;
            const id = toastIdRef.current;
            toastIdRef.current = null;
            if (id !== null) {
                showToasty(message, 'error', { id });
            } else {
                showToasty(message, 'error');
            }
        },
        [showToasty],
    );

    const onCancelExport = useCallback(() => {
        const id = toastIdRef.current;
        toastIdRef.current = null;
        if (id !== null) {
            dismissToasty(id);
        }
    }, [dismissToasty]);

    return { onExportProgress, onExportComplete, onExportError, onCancelExport };
}
