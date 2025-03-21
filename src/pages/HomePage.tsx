import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia 
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BusinessIcon from '@mui/icons-material/Business';
import { useAuth } from '../context/AuthContext';

const HomePage: React.FC = () => {
  const { user } = useAuth();

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
