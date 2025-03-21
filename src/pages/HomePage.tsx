import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const HomePage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          MrVan B2B Platform
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Ласкаво просимо до платформи для партнерів MrVan
        </Typography>
        <Typography variant="body1" paragraph>
          Тут ви можете керувати своїми транспортними засобами та бронюваннями.
        </Typography>
      </Box>
    </Container>
  );
};

export default HomePage;
