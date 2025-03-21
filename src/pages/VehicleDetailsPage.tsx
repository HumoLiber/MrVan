import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Paper,
  Grid,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardMedia,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import ErrorIcon from '@mui/icons-material/Error';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSupabase } from '../context/SupabaseContext';

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  license_plate: string;
  status: string;
  delegation_mode: string;
  atom_vehicle_id: string | null;
  created_at: string;
}

interface Document {
  id: string;
  vehicle_id: string;
  doc_type: string;
  file_url: string;
  status: string;
  created_at: string;
}

const VehicleDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { supabase } = useSupabase();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchVehicleDetails = async () => {
      if (!id) return;
      
      try {
        // Fetch vehicle data
        const { data: vehicleData, error: vehicleError } = await supabase
          .from('vehicles')
          .select('*')
          .eq('id', id)
          .single();
          
        if (vehicleError) throw vehicleError;
        
        setVehicle(vehicleData);
        
        // Fetch documents related to this vehicle
        const { data: documentsData, error: documentsError } = await supabase
          .from('documents')
          .select('*')
          .eq('vehicle_id', id);
          
        if (documentsError) throw documentsError;
        
        setDocuments(documentsData || []);
      } catch (err: any) {
        console.error('Error fetching vehicle details:', err);
        setError('Failed to load vehicle details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchVehicleDetails();
  }, [id, supabase]);
  
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
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon color="success" />;
      case 'rejected':
        return <ErrorIcon color="error" />;
      case 'draft':
      case 'pending':
        return <PendingIcon color="warning" />;
      default:
        return <PendingIcon color="info" />;
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
  
  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'insurance':
        return 'Insurance Document';
      case 'registration':
        return 'Vehicle Registration';
      case 'contract':
        return 'Contract';
      default:
        return type;
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error || !vehicle) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error || 'Vehicle not found'}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard')}
          sx={{ mt: 2 }}
        >
          Back to Dashboard
        </Button>
      </Container>
    );
  }
  
  return (
    <Container component="main">
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/dashboard')}
        sx={{ mb: 2 }}
      >
        Back to Dashboard
      </Button>
      
      <Paper elevation={1} sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography component="h1" variant="h4">
            Vehicle Details
          </Typography>
          <Chip 
            label={vehicle.status} 
            color={getStatusColor(vehicle.status) as any}
          />
        </Box>
        
        <Grid container spacing={4}>
          {/* Vehicle Info Card */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardMedia
                component="div"
                sx={{
                  height: 140,
                  bgcolor: 'primary.light',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <DirectionsCarIcon sx={{ fontSize: 80, color: 'white' }} />
              </CardMedia>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {vehicle.brand} {vehicle.model}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {vehicle.year} • {vehicle.license_plate}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Delegation Mode:</Typography>
                    <Typography variant="body2">
                      {getDelegationModeLabel(vehicle.delegation_mode)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Status:</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getStatusIcon(vehicle.status)}
                      <Typography variant="body2">
                        {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Added On:</Typography>
                    <Typography variant="body2">
                      {new Date(vehicle.created_at).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  {vehicle.atom_vehicle_id && (
                    <Grid item xs={6}>
                      <Typography variant="subtitle2">ATOM ID:</Typography>
                      <Typography variant="body2">
                        {vehicle.atom_vehicle_id}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Documents Card */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Documents
                </Typography>
                
                {documents.length === 0 ? (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    No documents found for this vehicle
                  </Alert>
                ) : (
                  <List>
                    {documents.map((doc) => (
                      <ListItem key={doc.id}>
                        <ListItemIcon>
                          <InsertDriveFileIcon />
                        </ListItemIcon>
                        <ListItemText 
                          primary={getDocumentTypeLabel(doc.doc_type)} 
                          secondary={`Status: ${doc.status}`}
                        />
                        <Button 
                          variant="outlined" 
                          size="small" 
                          href={doc.file_url} 
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View
                        </Button>
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>
          
          {/* Status Information */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Status Information
                </Typography>
                
                {vehicle.status === 'draft' && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Your vehicle is currently in draft status. Our team will review your submission soon.
                  </Alert>
                )}
                
                {vehicle.status === 'pending' && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Your vehicle is currently under review by our team. We'll update you once the review is complete.
                  </Alert>
                )}
                
                {vehicle.status === 'approved' && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    Your vehicle has been approved! {vehicle.atom_vehicle_id ? 'It has been integrated with ATOM Mobility.' : ''}
                  </Alert>
                )}
                
                {vehicle.status === 'rejected' && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    Your vehicle submission has been rejected. Please contact our support team for more information.
                  </Alert>
                )}
                
                <Typography variant="body2" sx={{ mt: 3 }}>
                  If you have any questions about your vehicle status or need to make changes, 
                  please contact our support team at support@mistervan.es
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default VehicleDetailsPage;
