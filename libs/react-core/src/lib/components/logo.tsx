import { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Link, BoxProps } from '@mui/material';

// ----------------------------------------------------------------------

export interface LogoProps extends BoxProps {
  disabledLink?: boolean;
  small?: boolean;
}

 const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ disabledLink = false, small, sx, ...other }, ref) => {
    const logo = (
      <Box
        ref={ref}
        component="div"
        sx={{
          width: '100%',
          display: 'inline-flex',
          justifyContent: 'center',
          maxWidth: small ? '120px' : '150px',
          ...sx,
        }}
        {...other}
      >
        {small ? (
          <Box
            component="img"
            src="/assets/images/small-logo.svg"
            alt="Logo"
            sx={{ height: 1, width: 1 }}
          />
        ) : (
          <Box
            component="img"
            src="/assets/images/logo.svg"
            alt="Logo"
            sx={{ height: 1, width: 1 }}
          />
        )}

      </Box>
    );

    if (disabledLink) {
      return logo
    }

    return (
      <Link
        to="/"
        component={RouterLink}
        sx={{ display: 'contents' }}>
        {logo}
      </Link>
    );
  }
);

export default Logo;
