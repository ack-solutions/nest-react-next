import isEqual from 'lodash/isEqual';
import { useMemo, useCallback, useState, useContext, createContext } from 'react';
import { useLocalStorage } from '../hook/use-local-storage';

const STORAGE_KEY = 'settings';

interface SettingsProviderProps {
	children: React.ReactNode;
	defaultSettings?: SettingsValueProps;
};

export interface SettingsValueProps {
	compactLayout: boolean;
	colorScheme: 'light' | 'dark';
	contrast: 'default' | 'bold';
	navLayout: 'vertical' | 'mini';
	primaryColor: 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red';
};
export const initialSetting = {
	colorScheme: 'light',
	contrast: 'default',
	navLayout: 'vertical',
	primaryColor: 'default',
	navColor: 'integrate',
	compactLayout: false,
} as const;

export type SettingsContextProps = SettingsValueProps & {
	onUpdate: (name: string, value: string | boolean) => void;
	onChangeDirectionByLang: (lang: string) => void;
	canReset: boolean;
	onReset: VoidFunction;
	open: boolean;
	onToggle: VoidFunction;
	onClose: VoidFunction;
};

export const SettingsContext = createContext({} as SettingsContextProps);


export function SettingsProvider({ children, defaultSettings }: SettingsProviderProps) {
	const { state, update, reset } = useLocalStorage(STORAGE_KEY, Object.assign({}, initialSetting, defaultSettings));
	const [openDrawer, setOpenDrawer] = useState(false);

	const onToggleDrawer = useCallback(() => {
		setOpenDrawer((prev) => !prev);
	}, []);

	const onCloseDrawer = useCallback(() => {
		setOpenDrawer(false);
	}, []);

	const canReset = !isEqual(state, defaultSettings);

	const memoizedValue = useMemo(
		() => ({
			...state,
			onUpdate: update,
			canReset,
			onReset: reset,
			open: openDrawer,
			onToggle: onToggleDrawer,
			onClose: onCloseDrawer
		}),
		[reset, update, state, canReset, openDrawer, onCloseDrawer, onToggleDrawer]
	);

	return <SettingsContext.Provider value={memoizedValue}>{children}</SettingsContext.Provider>;
}

export const useSettingsContext = () => {
	const context = useContext(SettingsContext);

	if (!context) throw new Error('useSettingsContext must be use inside SettingsProvider');

	return context;
};