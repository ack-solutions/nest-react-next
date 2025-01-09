import React, { createContext, ReactNode, useCallback, useState } from 'react';


interface IDefineInput {
    roles: string[];
    permissions: string[];
}

const initialState = {
    isLoaded: false,
    permissions: [],
    roles: [],
    resources: {},
    define: (_options: IDefineInput) => {
        //
    },
    onDeny: () => { return null; },
};

const AccessContext = createContext(initialState);

export default AccessContext;

export const AccessConsumer = AccessContext.Consumer;

export interface AccessProviderProps {
    children: ReactNode,
    onDeny?: () => void,
    value?: string[];
    isLoaded?: boolean;
    roles?: string[];
    permissions?: string[];
    resources?: any;
    define?: (options: IDefineInput) => void;
}

export const AccessProvider = ({ children, onDeny }: AccessProviderProps) => {
    const [state, setState] = useState(initialState);

    const define = useCallback(
        (values: string[]) => setState(prevState => ({
            ...prevState,
            ...values,
            isLoaded: true,
        })),
        [],
    );

    const providerValue: any = {
        ...state,
        onDeny,
        define,
    };

    return <AccessContext.Provider value={providerValue}>{children}</AccessContext.Provider>;
};
