'use client';

import {
    useMemo,
    useState,
    useCallback,
    Dispatch,
    SetStateAction,
} from 'react';


export interface UseBooleanReturn {
    value: any;
    onTrue: () => void;
    onFalse: () => void;
    onToggle: () => void;
    setValue: Dispatch<SetStateAction<any>>;
}

export function useBoolean(defaultValue = false): UseBooleanReturn {
    const [value, setValue] = useState(defaultValue);

    const onTrue = useCallback(() => {
        setValue(true);
    }, []);

    const onFalse = useCallback(() => {
        setValue(false);
    }, []);

    const onToggle = useCallback(() => {
        setValue((prev) => !prev);
    }, []);

    const memoizedValue = useMemo(
        () => ({
            value,
            onTrue,
            onFalse,
            onToggle,
            setValue,
        }),
        [
            value,
            onTrue,
            onFalse,
            onToggle,
            setValue,
        ],
    );

    return memoizedValue;
}
