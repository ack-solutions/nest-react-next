import { createContext, useContext, useCallback, useMemo, ReactNode, useState } from 'react';

// Layout state - persisted in localStorage (only column-related properties)
export interface DataTableLayoutState {
    columnVisibility?: Record<string, boolean>;
    columnOrder?: string[];
    columnSizing?: Record<string, number>;
    columnPinning?: {
        left?: string[];
        right?: string[];
    };
}

export interface DataTableState {
    // Filter states (session cache - clears on refresh)
    [x: string]: any;
    filterValues?: any;
    currentTab?: string;
    showDeleted?: boolean;

    // Table states (session cache - clears on refresh)
    globalFilter?: string;
    columnFilter?: any; // ColumnFilterState type from tanstack-data-table
    sorting?: any[];
    pagination?: {
        pageIndex: number;
        pageSize: number;
    };

    // Layout states (persisted in localStorage)
    layout?: DataTableLayoutState;
}

interface DataTableStateContextValue {
    getState: (key: string) => DataTableState | null;
    setState: (key: string, state: Partial<DataTableState>) => void;
    clearState: (key: string) => void;
    clearAllStates: () => void;
    // Layout management (localStorage)
    getLayout: (key: string) => DataTableLayoutState | null;
    saveLayout: (key: string, layout: DataTableLayoutState) => void;
    clearLayout: (key: string) => void;
}

const DataTableStateContext = createContext<DataTableStateContextValue | null>(null);

interface DataTableStateProviderProps {
    children: ReactNode;
}

const LAYOUT_STORAGE_KEY = 'datatable-layouts';

export function DataTableStateProvider({ children }: DataTableStateProviderProps) {
    // Session cache (clears on page refresh)
    const [stateCache, setStateCache] = useState<Record<string, DataTableState>>({});

    // Session state methods
    const getState = useCallback(
        (key: string): DataTableState | null => {
            return stateCache[key] || null;
        },
        [stateCache],
    );

    const setState = useCallback(
        (key: string, state: Partial<DataTableState>) => {
            setStateCache((prev) => ({
                ...prev,
                [key]: {
                    ...prev[key],
                    ...state,
                },
            }));
        },
        [],
    );

    const clearState = useCallback(
        (key: string) => {
            setStateCache((prev) => {
                const newState = { ...prev };
                delete newState[key];
                return newState;
            });
        },
        [],
    );

    const clearAllStates = useCallback(() => {
        setStateCache({});
    }, []);

    // Layout localStorage methods
    const getLayout = useCallback((key: string): DataTableLayoutState | null => {
        try {
            const stored = localStorage.getItem(LAYOUT_STORAGE_KEY);
            if (!stored) return null;
            const layouts = JSON.parse(stored);
            return layouts[key] || null;
        } catch (error) {
            console.error('Error reading layout from localStorage:', error);
            return null;
        }
    }, []);

    const saveLayout = useCallback((key: string, layout: DataTableLayoutState) => {
        try {
            const stored = localStorage.getItem(LAYOUT_STORAGE_KEY);
            const layouts = stored ? JSON.parse(stored) : {};
            layouts[key] = layout;
            localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(layouts));
        } catch (error) {
            console.error('Error saving layout to localStorage:', error);
        }
    }, []);

    const clearLayout = useCallback((key: string) => {
        try {
            const stored = localStorage.getItem(LAYOUT_STORAGE_KEY);
            if (!stored) return;
            const layouts = JSON.parse(stored);
            delete layouts[key];
            localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(layouts));
        } catch (error) {
            console.error('Error clearing layout from localStorage:', error);
        }
    }, []);

    const value = useMemo(
        () => ({
            getState,
            setState,
            clearState,
            clearAllStates,
            getLayout,
            saveLayout,
            clearLayout,
        }),
        [getState, setState, clearState, clearAllStates, getLayout, saveLayout, clearLayout],
    );

    return (
        <DataTableStateContext.Provider value={value}>
            {children}
        </DataTableStateContext.Provider>
    );
}

export function useDataTableState(key: string) {
    const context = useContext(DataTableStateContext);

    if (!context) {
        throw new Error('useDataTableState must be used within DataTableStateProvider');
    }

    // Return key-specific helpers
    return useMemo(
        () => ({
            // Session state (clears on refresh)
            state: context.getState(key),
            setState: (state: Partial<DataTableState>) => context.setState(key, state),
            clearState: () => context.clearState(key),
            getState: context.getState,
            clearAllStates: context.clearAllStates,
            // Layout state (persisted in localStorage)
            layout: context.getLayout(key),
            saveLayout: (layout: DataTableLayoutState) => context.saveLayout(key, layout),
            clearLayout: () => context.clearLayout(key),
            getLayout: context.getLayout,
        }),
        [key, context],
    );
}
