import { Stack, StackProps, SxProps } from '@mui/material';
import { Theme } from '@mui/material';
import Box from '@mui/material/Box';
import Breadcrumbs, { BreadcrumbsProps } from '@mui/material/Breadcrumbs';
import MuiLink, { LinkProps } from '@mui/material/Link';
import Typography, { TypographyProps } from '@mui/material/Typography';
import React from 'react';
import { Link } from 'react-router-dom';


// import { BackButton } from './back-button';
import { BreadcrumbsLink } from './breadcrumb-link';
import { useResponsive } from '../../hook';
import { Icon } from '../icons/icon';
import { IconEnum } from '../icons/icons';


type BreadcrumbsLinkProps = {
    name?: string;
    href?: string;
    icon?: React.ReactElement;
};

interface CustomSlotProps {
    action?: StackProps;
    heading?: TypographyProps;
    moreLink?: LinkProps;
    breadcrumbs?: BreadcrumbsProps;
}

export interface CustomBreadcrumbsProps extends BreadcrumbsProps {
    heading?: React.ReactNode;
    moreLink?: string[];
    activeLast?: boolean;
    action?: React.ReactNode;
    links: BreadcrumbsLinkProps[];
    sx?: SxProps<Theme>;
    slotProps?: BreadcrumbsProps['slotProps'] & CustomSlotProps;
}

export function CustomBreadcrumbs({
    links,
    action,
    heading,
    moreLink,
    activeLast,
    slotProps,
    sx,
    ...other
}: CustomBreadcrumbsProps) {
    const isMobile = useResponsive('down', 'md');
    const lastLink = links[links.length - 1]?.name;

    const renderLinks = (
        <Breadcrumbs
            separator={(
                <Box
                    component="span"
                    sx={{
                        color: 'text.disabled',
                        fontSize: '0.75rem',
                        mx: 0.5,
                    }}
                >
                    /
                </Box>
            )}
            {...slotProps?.breadcrumbs}
            sx={{
                '& .MuiBreadcrumbs-ol': {
                    flexWrap: 'wrap',
                },
                '& .MuiBreadcrumbs-li': {
                    display: 'flex',
                    alignItems: 'center',
                },
                fontSize: '0.75rem',
                ...slotProps?.breadcrumbs?.sx,
            }}
            {...other}
        >
            {links.map((link, index) => (
                <BreadcrumbsLink
                    linkIcon={link.icon || index === 0 ? (
                        <Icon
                            size="x-small"
                            icon={IconEnum.House}
                        />
                    ) : null}
                    key={link.name ?? index}
                    link={link}
                    activeLast={activeLast}
                    disabled={link.name === lastLink}
                />
            ))}
        </Breadcrumbs>
    );

    return (
        <Box sx={sx}>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
            >
                <Box>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            minWidth: 0,
                            flexGrow: 1,
                            mb: 1,
                        }}
                    >
                        {/* {heading ? <BackButton /> : null} */}

                        {heading ? (
                            <Typography
                                variant={isMobile ? 'h6' : 'h5'}
                                component="h1"
                                {...slotProps?.heading}
                                sx={{
                                    minWidth: 200,
                                    fontWeight: 600,
                                    color: 'text.primary',
                                    lineHeight: 1.2,
                                    wordBreak: 'break-word',
                                    ...slotProps?.heading?.sx,
                                }}
                            >
                                {heading}
                            </Typography>
                        ) : null}
                    </Box>


                    {/* Compact breadcrumbs */}
                    {!!links.length && (
                        <Box
                            sx={{
                                display: {
                                    xs: 'none',
                                    sm: 'block',
                                },
                            }}
                        >
                            {renderLinks}
                        </Box>
                    )}

                    {/* More links */}
                    {!!moreLink && (
                        <Box
                            component="ul"
                            sx={{
                                pl: 0,
                                listStyle: 'none',
                                m: 0,
                            }}
                        >
                            {moreLink.map((href) => (
                                <Box
                                    key={href}
                                    component="li"
                                    sx={{
                                        display: 'flex',
                                        mb: 0.5,
                                    }}
                                >
                                    <MuiLink
                                        component={Link}
                                        to={href}
                                        variant="body2"
                                        target="_blank"
                                        rel="noopener"
                                        {...slotProps?.moreLink}
                                        sx={{
                                            color: 'primary.main',
                                            textDecoration: 'none',
                                            fontSize: '0.75rem',
                                            '&:hover': {
                                                textDecoration: 'underline',
                                            },
                                            ...slotProps?.moreLink?.sx,
                                        }}
                                    >
                                        {href}
                                    </MuiLink>
                                </Box>
                            ))}
                        </Box>
                    )}
                </Box>

                {action ? (
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        flexShrink={0}
                        {...slotProps?.action}
                    >
                        {action}
                    </Stack>
                ) : null}
            </Stack>
        </Box>
    );
}
