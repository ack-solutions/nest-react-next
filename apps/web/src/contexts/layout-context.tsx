'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

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

    const updateSettings = (newSettings: Partial<LayoutSettings>) => {
        setSettings(prev => ({
            ...prev,
            ...newSettings,
        }));
    };

    const toggleFooter = () => {
        updateSettings({ showFooter: !settings.showFooter });
    };

    const toggleHeader = () => {
        updateSettings({ showHeader: !settings.showHeader });
    };

    const setFooterVisibility = (isVisible: boolean) => {
        updateSettings({ showFooter: isVisible });
    };

    const setHeaderVisibility = (isVisible: boolean) => {
        updateSettings({ showHeader: isVisible });
    };

    const setContainerMaxWidth = (width: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full') => {
        updateSettings({ containerMaxWidth: width });
    };

    const setLayoutClass = (layoutClass: string) => {
        updateSettings({ layoutClass });
    };


    const value: LayoutContextType = {
        settings,
        toggleFooter,
        toggleHeader,
        setContainerMaxWidth,
        setFooterVisibility,
        setHeaderVisibility,
        setLayoutClass,
    };

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
