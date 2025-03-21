import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { useAuth } from '../context/AuthContext';
import { useSupabase } from '../context/SupabaseContext';

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  license_plate: string;
  status: string;
  delegation_mode: string;
  created_at: string;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const { data, error } = await supabase
          .from('vehicles')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setVehicles(data || []);
      } catch (err: any) {
        console.error('Error fetching vehicles:', err);
        setError('Failed to load your vehicles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchVehicles();
  }, [supabase]);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'draft':
        return 'default';
      default:
        return 'info';
    }
  };
  
  const getDelegationModeLabel = (mode: string) => {
    switch (mode) {
      case 'service_only':
        return 'Service Only';
      case 'partial':
        return 'Partial Help';
      case 'full_delegation':
        return 'Full Delegation';
      default:
        return mode;
    }
  };
  
  return (
    <Container component="main">
      <Paper elevation={1} sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography component="h1" variant="h4">
            My Dashboard
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            component={RouterLink}
            to="/add-vehicle"
          >
            Add Vehicle
          </Button>
        </Box>
        
        <Typography variant="subtitle1" gutterBottom>
          Welcome back, {user?.email}!
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          My Vehicles
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        ) : vehicles.length === 0 ? (
          <Box sx={{ textAlign: 'center', my: 4 }}>
            <DirectionsCarIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No vehicles yet
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Start by adding your first vehicle to the platform.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              component={RouterLink}
              to="/add-vehicle"
            >
              Add Vehicle
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {vehicles.map((vehicle) => (
              <Grid item xs={12} sm={6} md={4} key={vehicle.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography variant="h6" component="div">
                        {vehicle.brand} {vehicle.model}
                      </Typography>
                      <Chip 
                        label={vehicle.status} 
                        color={getStatusColor(vehicle.status) as any}
                        size="small"
                      />
                    </Box>
                    <Typography color="text.secondary" gutterBottom>
                      {vehicle.year} • {vehicle.license_plate}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      Mode: {getDelegationModeLabel(vehicle.delegation_mode)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Added: {new Date(vehicle.created_at).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      component={RouterLink} 
                      to={`/vehicles/${vehicle.id}`}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Container>
  );
};

export default DashboardPage;
