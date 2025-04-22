import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="body1" align="center">
          {new Date().getFullYear()} MisterVan B2B Partners Portal
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          {'Built with '}
          <Link color="inherit" href="https://mui.com/">
            Material UI
          </Link>{' & '}
          <Link color="inherit" href="https://supabase.com/">
            Supabase
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
