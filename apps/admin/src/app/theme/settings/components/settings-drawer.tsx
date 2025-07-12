import {
    Box,
    Button,
    Card,
    Divider,
    Drawer,
    FormControlLabel,
    IconButton,
    Stack,
    Switch,
    Typography,
    useColorScheme,
    alpha,
    Tooltip,
} from '@mui/material';
import { useCallback } from 'react';

import ThemePreview from './theme-preview';
import { Icon } from '../../../components/icons/icon';
import { IconEnum } from '../../../components/icons/icons';
import { useSettingsContext } from '../../../contexts/settings-provider';
import { primaryPresets } from '../../presets';


export default function SettingsDrawer() {
    const settings = useSettingsContext();
    const { mode, setMode } = useColorScheme();

    const handleToggleDarkMode = useCallback(() => {
        const newMode = mode === 'light' ? 'dark' : 'light';
        setMode(newMode);
        settings.onUpdate('colorScheme', newMode);
    }, [
        mode,
        setMode,
        settings,
    ]);

    const handleChangeTheme = useCallback((colorName: string) => {
        settings.onUpdate('primaryColor', colorName);
    }, [settings]);

    const handleChangeContrast = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        settings.onUpdate('contrast', event.target.checked ? 'bold' : 'default');
    }, [settings]);

    const handleChangeCompactLayout = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        settings.onUpdate('compactLayout', event.target.checked);
    }, [settings]);

    const renderColorPresets = (
        <Card sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Theme Colors
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
                {primaryPresets.map((preset) => {
                    const isSelected = settings.primaryColor === preset.name;
                    return (
                        <Tooltip key={preset.name} title={preset.name.charAt(0).toUpperCase() + preset.name.slice(1)}>
                            <Box
                                onClick={() => handleChangeTheme(preset.name)}
                                sx={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    border: '3px solid',
                                    borderColor: isSelected ? 'text.primary' : 'transparent',
                                    bgcolor: preset.main,
                                    position: 'relative',
                                    transition: (theme) => theme.transitions.create(['border-color', 'transform'], {
                                        duration: theme.transitions.duration.shorter,
                                    }),
                                    '&:hover': {
                                        transform: 'scale(1.15)',
                                        borderColor: 'text.secondary',
                                    },
                                    '&::after': isSelected ? {
                                        content: '"✓"',
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        color: 'white',
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                    } : {},
                                }}
                            />
                        </Tooltip>
                    );
                })}
            </Stack>
            <Typography variant="caption" color="text.secondary">
                Choose your preferred color scheme
            </Typography>
        </Card>
    );

    const renderModeOptions = (
        <Card sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Appearance
            </Typography>
            <Stack spacing={2}>
                <Box>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={mode === 'dark'}
                                onChange={handleToggleDarkMode}
                            />
                        }
                        label="Dark Mode"
                    />
                    <Typography variant="caption" color="text.secondary" sx={{
                        display: 'block',
                        ml: 4,
                    }}>
                        Switch between light and dark themes
                    </Typography>
                </Box>

                <Box>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings.contrast === 'bold'}
                                onChange={handleChangeContrast}
                            />
                        }
                        label="High Contrast"
                    />
                    <Typography variant="caption" color="text.secondary" sx={{
                        display: 'block',
                        ml: 4,
                    }}>
                        Increase contrast for better accessibility
                    </Typography>
                </Box>

                <Box>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings.compactLayout}
                                onChange={handleChangeCompactLayout}
                            />
                        }
                        label="Compact Layout"
                    />
                    <Typography variant="caption" color="text.secondary" sx={{
                        display: 'block',
                        ml: 4,
                    }}>
                        Reduce spacing and component sizes
                    </Typography>
                </Box>
            </Stack>
        </Card>
    );

    const renderLayoutOptions = (
        <Card sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Navigation Layout
            </Typography>
            <Stack direction="row" spacing={1}>
                {[
                    {
                        value: 'vertical',
                        label: 'Vertical',
                        icon: IconEnum.PanelLeft,
                    },
                    {
                        value: 'mini',
                        label: 'Mini',
                        icon: IconEnum.List,
                    },
                ].map((layout) => {
                    const isSelected = settings.navLayout === layout.value;
                    return (
                        <Tooltip key={layout.value} title={layout.label}>
                            <Box
                                onClick={() => settings.onUpdate('navLayout', layout.value)}
                                sx={{
                                    p: 1.5,
                                    borderRadius: 1,
                                    cursor: 'pointer',
                                    border: '2px solid',
                                    borderColor: isSelected ? 'primary.main' : 'divider',
                                    bgcolor: isSelected ? alpha('#000', 0.04) : 'transparent',
                                    transition: (theme) => theme.transitions.create(['border-color', 'background-color'], {
                                        duration: theme.transitions.duration.shorter,
                                    }),
                                    '&:hover': {
                                        borderColor: 'primary.main',
                                        bgcolor: alpha('#000', 0.04),
                                    },
                                }}
                            >
                                <Icon icon={layout.icon} />
                            </Box>
                        </Tooltip>
                    );
                })}
            </Stack>
        </Card>
    );

    return (
        <Drawer
            anchor="right"
            open={settings.open}
            onClose={settings.onClose}
            slotProps={{
                backdrop: {
                    invisible: false,
                    sx: { bgcolor: 'rgba(0, 0, 0, 0.5)' },
                },
                paper: {
                    sx: {
                        width: 320,
                        bgcolor: 'background.default',
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                    },
                },
            }}
        >
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                    py: 2,
                    pr: 1,
                    pl: 2.5,
                }}
            >
                <Typography variant="h6">Settings</Typography>
                <IconButton onClick={settings.onClose}>
                    <Icon icon={IconEnum.X} />
                </IconButton>
            </Stack>

            <Divider />

            <Box sx={{
                p: 2,
                height: 1,
                overflow: 'auto',
            }}>
                <Stack spacing={3}>
                    <ThemePreview />
                    {renderModeOptions}
                    {renderColorPresets}
                    {renderLayoutOptions}
                </Stack>
            </Box>

            <Box sx={{ p: 2 }}>
                <Button
                    fullWidth
                    variant="outlined"
                    onClick={settings.onReset}
                    disabled={!settings.canReset}
                >
                    Reset to Default
                </Button>
            </Box>
        </Drawer>
    );
}
