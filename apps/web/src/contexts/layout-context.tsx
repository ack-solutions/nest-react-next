'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';

export interface LayoutSettings {
    showFooter: boolean;
    showHeader: boolean;
    containerMaxWidth: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
    layoutClass: string;
}

export interface LayoutContextType {
    settings: LayoutSettings;
    toggleFooter: () => void;
    toggleHeader: () => void;
    setFooterVisibility: (isVisible: boolean) => void;
    setHeaderVisibility: (isVisible: boolean) => void;
    setContainerMaxWidth: (width: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full') => void;
    setLayoutClass: (layoutClass: string) => void;
}

const defaultSettings: LayoutSettings = {
    showFooter: true,
    showHeader: true,
    containerMaxWidth: 'xl',
    layoutClass: '',
};

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export interface LayoutProviderProps {
    children: ReactNode;
    initialSettings?: Partial<LayoutSettings>;
}

export function LayoutProvider({ children, initialSettings }: LayoutProviderProps) {
    const [settings, setSettings] = useState<LayoutSettings>({
        ...defaultSettings,
        ...initialSettings,
    });

    const toggleFooter = useCallback(() => {
        setSettings(prev => ({
            ...prev,
            showFooter: !prev.showFooter,
        }));
    }, []);

    const toggleHeader = useCallback(() => {
        setSettings(prev => ({
            ...prev,
            showHeader: !prev.showHeader,
        }));
    }, []);

    const setFooterVisibility = useCallback((isVisible: boolean) => {
        setSettings(prev => ({
            ...prev,
            showFooter: isVisible,
        }));
    }, []);

    const setHeaderVisibility = useCallback((isVisible: boolean) => {
        setSettings(prev => ({
            ...prev,
            showHeader: isVisible,
        }));
    }, []);

    const setContainerMaxWidth = useCallback((width: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full') => {
        setSettings(prev => ({
            ...prev,
            containerMaxWidth: width,
        }));
    }, []);

    const setLayoutClass = useCallback((layoutClass: string) => {
        setSettings(prev => ({
            ...prev,
            layoutClass,
        }));
    }, []);

    const value = useMemo<LayoutContextType>(() => ({
        settings,
        toggleFooter,
        toggleHeader,
        setContainerMaxWidth,
        setFooterVisibility,
        setHeaderVisibility,
        setLayoutClass,
    }), [
        settings,
        toggleFooter,
        toggleHeader,
        setContainerMaxWidth,
        setFooterVisibility,
        setHeaderVisibility,
        setLayoutClass,
    ]);

    return (
        <LayoutContext.Provider value={value}>
            {children}
        </LayoutContext.Provider>
    );
}

export function useLayout() {
    const context = useContext(LayoutContext);
    if (context === undefined) {
        throw new Error('useLayout must be used within a LayoutProvider');
    }
    return context;
}
