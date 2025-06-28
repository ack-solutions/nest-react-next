import React, { createContext, ReactNode, useCallback, useMemo, useState } from 'react';


interface IDefineInput {
    roles: string[];
    permissions: string[];
}

interface IAccessContext {
    isLoaded: boolean;
    permissions: string[];
    roles: string[];
    resources: any;
    define: (options: IDefineInput) => void;
    onDeny: () => void;
}
const initialState: IAccessContext = {
    isLoaded: false,
    permissions: [],
    roles: [],
    resources: {},
    define: (_options: IDefineInput) => {
        //
    },
    onDeny: () => {
        return null;
    },
};

const AccessContext = createContext(initialState);

export default AccessContext;

export const AccessConsumer = AccessContext.Consumer;

export interface AccessProviderProps {
    children: ReactNode;
    onDeny?: () => void;
}

export function AccessProvider({ children, onDeny }: AccessProviderProps) {
    const [state, setState] = useState(initialState);

    const define = useCallback(
        (options: IDefineInput) => setState((prevState) => ({
            ...prevState,
            ...options,
            isLoaded: true,
        })),
        [],
    );

    const providerValue = useMemo(() => ({
        ...state,
        onDeny,
        define,
    }), [
        state,
        onDeny,
        define,
    ]);

    return (
        <AccessContext.Provider value={providerValue}>
            {children}
        </AccessContext.Provider>
    );
}
