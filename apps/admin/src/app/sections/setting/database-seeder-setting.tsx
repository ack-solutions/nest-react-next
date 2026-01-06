import { SeederService, SeederInfo } from '@libs/react-shared';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    CircularProgress,
    Divider,
    FormControlLabel,
    IconButton,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    Stack,
    Tooltip,
    Typography,
    alpha,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { Icon } from '../../components';
import { IconEnum } from '../../components/icons/icons';
import { useToasty } from '../../hook';


const seederService = SeederService.getInstance();

const DatabaseSeederSetting = () => {
    const { showToasty } = useToasty();
    const [seeders, setSeeders] = useState<SeederInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [runningSeeder, setRunningSeeder] = useState<string | null>(null);
    const [truncateOptions, setTruncateOptions] = useState<Record<string, boolean>>({});

    const fetchSeeders = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await seederService.getSeeders();
            setSeeders(data);
            // Initialize truncate options
            const options: Record<string, boolean> = {};
            data.forEach((s) => {
                options[s.key] = false;
            });
            setTruncateOptions(options);
        } catch (err: any) {
            setError(err.message || 'Failed to load seeders');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSeeders();
    }, [fetchSeeders]);

    const handleRunSeeder = useCallback(
        async (seederKey: string) => {
            setRunningSeeder(seederKey);
            try {
                const result = await seederService.runSeeder(seederKey, truncateOptions[seederKey]);
                if (result.success) {
                    showToasty(result.message, 'success');
                } else {
                    showToasty(result.message, 'error');
                }
            } catch (err: any) {
                showToasty(err.message || 'Failed to run seeder', 'error');
            } finally {
                setRunningSeeder(null);
            }
        },
        [showToasty, truncateOptions],
    );

    const handleRunAllSeeders = useCallback(async () => {
        setRunningSeeder('all');
        try {
            const truncateAll = Object.values(truncateOptions).some((v) => v);
            const result = await seederService.runAllSeeders(truncateAll);
            if (result.success) {
                showToasty(result.message, 'success');
            } else {
                const failedSeeders = result.results.filter((r) => !r.success);
                showToasty(`Some seeders failed: ${failedSeeders.map((r) => r.name).join(', ')}`, 'warning');
            }
        } catch (err: any) {
            showToasty(err.message || 'Failed to run seeders', 'error');
        } finally {
            setRunningSeeder(null);
        }
    }, [showToasty, truncateOptions]);

    const handleToggleTruncate = useCallback((seederKey: string) => {
        setTruncateOptions((prev) => ({
            ...prev,
            [seederKey]: !prev[seederKey],
        }));
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mb: 2 }}>
                {error}
            </Alert>
        );
    }

    return (
        <Card>
            <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Box>
                        <Typography variant="h6">Database Seeders</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Run database seeders to populate initial data. Use with caution in production.
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleRunAllSeeders}
                        disabled={runningSeeder !== null}
                        startIcon={runningSeeder === 'all' ? <CircularProgress size={16} color="inherit" /> : <Icon icon={IconEnum.CirclePlay} />}
                    >
                        Run All Seeders
                    </Button>
                </Stack>

                <Alert severity="warning" sx={{ mb: 2 }}>
                    <strong>Warning:</strong> Running seeders may modify or delete existing data. Enable "Truncate" to clear existing data before seeding.
                </Alert>

                <Divider sx={{ my: 2 }} />

                <List disablePadding>
                    {seeders.map((seeder, index) => (
                        <ListItem
                            key={seeder.key}
                            sx={{
                                py: 2,
                                px: 2,
                                borderRadius: 1,
                                mb: 1,
                                bgcolor: (theme) => alpha(theme.palette.background.default, 0.5),
                                border: (theme) => `1px solid ${theme.palette.divider}`,
                            }}
                        >
                            <ListItemText
                                primary={
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <Typography variant="subtitle1" fontWeight={600}>
                                            {seeder.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            ({seeder.key})
                                        </Typography>
                                    </Stack>
                                }
                                secondary={seeder.description}
                            />
                            <ListItemSecondaryAction>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    {seeder.hasDrop && (
                                        <Tooltip title="Truncate existing data before seeding">
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        size="small"
                                                        checked={truncateOptions[seeder.key] || false}
                                                        onChange={() => handleToggleTruncate(seeder.key)}
                                                        disabled={runningSeeder !== null}
                                                    />
                                                }
                                                label={
                                                    <Typography variant="caption" color="text.secondary">
                                                        Truncate
                                                    </Typography>
                                                }
                                            />
                                        </Tooltip>
                                    )}
                                    <Tooltip title="Run this seeder">
                                        <span>
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleRunSeeder(seeder.key)}
                                                disabled={runningSeeder !== null}
                                            >
                                                {runningSeeder === seeder.key ? (
                                                    <CircularProgress size={20} />
                                                ) : (
                                                    <Icon icon={IconEnum.CirclePlay} />
                                                )}
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                </Stack>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
};

export default DatabaseSeederSetting;
