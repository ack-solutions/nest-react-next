import { Box, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';


export interface BreadcrumbsLinkProps {
    disabled: boolean;
    activeLast?: boolean;
    linkIcon?: React.ReactElement;
    link: {
        name?: string;
        href?: string;
        icon?: React.ReactElement;
    };
}

export function BreadcrumbsLink({
    link,
    activeLast,
    disabled,
    linkIcon,
}: BreadcrumbsLinkProps) {
    const renderContent = (
        <>
            {(link.icon || linkIcon) ? (
                <Box
                    component="span"
                    sx={{
                        mr: 0.25,
                        display: 'flex',
                        alignItems: 'center',
                        opacity: disabled && !activeLast ? 0.5 : 1,
                    }}
                >
                    {link.icon || linkIcon}
                </Box>
            ) : null}

            <Box
                component="span"
                sx={{
                    maxWidth: {
                        xs: '100px',
                        sm: '150px',
                    },
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                }}
                title={link.name}
            >
                {link.name}
            </Box>
        </>
    );

    if (link.href && !disabled) {
        return (
            <Link
                to={link.href}
                component={RouterLink}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.25,
                    textDecoration: 'none',
                    fontSize: '0.75rem',
                    color: 'text.secondary',
                    '&:hover': {
                        color: 'primary.main',
                    },
                    '&:focus': {
                        outline: '1px solid',
                        outlineColor: 'primary.main',
                        outlineOffset: '1px',
                        borderRadius: '2px',
                    },
                }}
                aria-label={`Navigate to ${link.name}`}
            >
                {renderContent}
            </Link>
        );
    }

    return (
        <Box
            sx={{
                display: 'inline-flex',
                alignItems: 'center',
                fontSize: '0.75rem',
                color: disabled && !activeLast ? 'text.disabled' : 'text.primary',
                fontWeight: disabled && !activeLast ? 400 : 500,
            }}
            aria-current={disabled && !activeLast ? 'page' : undefined}
        >
            {renderContent}
        </Box>
    );
}
