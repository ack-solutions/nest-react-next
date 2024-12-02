import {
  Box,
  Link,
  Stack,
  Typography,
  Breadcrumbs,
  BreadcrumbsProps,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import LinkItem from './breadcrumbs-ink';

export type BreadcrumbsLinkProps = {
  name?: string;
  href?: string;
  icon?: React.ReactElement;
};

export interface CustomBreadcrumbsProps extends BreadcrumbsProps {
  heading?: string;
  moreLink?: string[];
  activeLast?: boolean;
  action?: React.ReactNode;
  links?: BreadcrumbsLinkProps[];
}

export default function CustomBreadcrumbs({
  links,
  action,
  heading,
  moreLink,
  activeLast,
  sx,
  ...other
}: CustomBreadcrumbsProps) {
  const lastLink = links?.length ? links[links.length - 1]?.name : null;
  const theme = useTheme();

  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ mb: 3, ...sx }}>
      <Stack
        direction={isMobile ? 'column' : 'row'}
        alignItems={isMobile ? 'flex-start' : 'center'}
        spacing={isMobile ? 4 : 0}
      >
        <Box sx={{ flexGrow: 1 }}>
          {/* HEADING */}
          {heading && (
            <Typography variant="h4" gutterBottom={isTablet ? false : true}>
              {heading}
            </Typography>
          )}

          {/* BREADCRUMBS */}
          {links?.length && (
            <Breadcrumbs separator={<Separator />}  {...other}>
              {links?.map((link) => (
                <LinkItem
                  key={link.name || ''}
                  link={link}
                  activeLast={activeLast}
                  disabled={link.name === lastLink}
                />
              ))}
            </Breadcrumbs>
          )}
        </Box>
        {action && (
          <Stack spacing={2} direction={'row'}>
            {action}
          </Stack>
        )}
      </Stack>

      {/* MORE LINK */}
      {moreLink && (
        <Box sx={{ mt: 2 }}>
          {moreLink?.map((href) => (
            <Link
              noWrap
              key={href}
              href={href}
              variant="body2"
              target="_blank"
              rel="noopener"
              sx={{ display: 'table' }}
            >
              {href}
            </Link>
          ))}
        </Box>
      )}
    </Box>
  );
}

function Separator() {
  return (
    <Box
      component="span"
      sx={{
        width: 4,
        height: 4,
        borderRadius: '50%',
        bgcolor: 'text.disabled',
      }}
    />
  );
}
