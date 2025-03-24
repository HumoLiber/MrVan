import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Container, 
  TextField, 
  Typography, 
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useSupabase } from '../context/SupabaseContext';
import { VehicleFormData, DelegationMode, Document, ApiError } from '../types';

const steps = ['Vehicle Information', 'Upload Documents', 'Confirm Details'];

const AddVehiclePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Vehicle form state
  const [vehicleData, setVehicleData] = useState<VehicleFormData>({
    brand: '',
    model: '',
    year: '',
    license_plate: '',
    delegation_mode: 'full_delegation' as DelegationMode
  });
  
  // Document upload state
  const [insuranceDoc, setInsuranceDoc] = useState<File | null>(null);
  const [registrationDoc, setRegistrationDoc] = useState<File | null>(null);
  
  // Form validation
  const [formErrors, setFormErrors] = useState({
    brand: false,
    model: false,
    year: false,
    licensePlate: false,
    insuranceDoc: false,
    registrationDoc: false
  });
  
  const handleNext = () => {
    if (activeStep === 0) {
      // Validate vehicle info
      const errors = {
        brand: !vehicleData.brand,
        model: !vehicleData.model,
        year: !vehicleData.year,
        licensePlate: !vehicleData.license_plate,
        insuranceDoc: false,
        registrationDoc: false
      };
      
      setFormErrors(errors);
      
      if (Object.values(errors).some(error => error)) {
        setError('Please fill in all required fields');
        return;
      }
    } else if (activeStep === 1) {
      // Validate document uploads
      const errors = {
        ...formErrors,
        insuranceDoc: !insuranceDoc,
        registrationDoc: !registrationDoc
      };
      
      setFormErrors(errors);
      
      if (!insuranceDoc || !registrationDoc) {
        setError('Please upload all required documents');
        return;
      }
    }
    
    setError(null);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setError(null);
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setFile: React.Dispatch<React.SetStateAction<File | null>>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };
  
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 1. Create vehicle record
      const { data: vehicleResponse, error: vehicleError } = await supabase
        .from('vehicles')
        .insert([
          {
            brand: vehicleData.brand,
            model: vehicleData.model,
            year: vehicleData.year,
            license_plate: vehicleData.license_plate,
            delegation_mode: vehicleData.delegation_mode,
            status: 'draft',
            user_id: user?.id
          }
        ])
        .select();
      
      if (vehicleError) throw vehicleError;
      
      const vehicleId = vehicleResponse?.[0]?.id;
      if (!vehicleId) throw new Error('Failed to create vehicle record');
      
      // 2. Upload documents to storage
      if (insuranceDoc) {
        const insuranceFileName = `${user?.id}/${vehicleId}/insurance_${Date.now()}.${insuranceDoc.name.split('.').pop()}`;
        
        const { error: uploadError } = await supabase.storage
          .from('vehicle_documents')
          .upload(insuranceFileName, insuranceDoc);
          
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('vehicle_documents')
          .getPublicUrl(insuranceFileName);
          
        // 3. Create document record
        await supabase
          .from('documents')
          .insert([
            {
              vehicle_id: vehicleId,
              doc_type: 'insurance',
              file_url: publicUrlData.publicUrl,
              status: 'uploaded'
            }
          ]);
      }
      
      if (registrationDoc) {
        const regFileName = `${user?.id}/${vehicleId}/registration_${Date.now()}.${registrationDoc.name.split('.').pop()}`;
        
        const { error: uploadError } = await supabase.storage
          .from('vehicle_documents')
          .upload(regFileName, registrationDoc);
          
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('vehicle_documents')
          .getPublicUrl(regFileName);
          
        // Create document record
        await supabase
          .from('documents')
          .insert([
            {
              vehicle_id: vehicleId,
              doc_type: 'registration',
              file_url: publicUrlData.publicUrl,
              status: 'uploaded'
            }
          ]);
      }
      
      // 4. Navigate to dashboard
      navigate('/dashboard');
      
    } catch (err: any) {
      console.error('Error adding vehicle:', err);
      setError(err.message || 'Failed to add vehicle. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="brand"
                label="Brand"
                value={vehicleData.brand}
                onChange={(e) => setVehicleData({...vehicleData, brand: e.target.value})}
                error={formErrors.brand}
                helperText={formErrors.brand ? 'Brand is required' : ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="model"
                label="Model"
                value={vehicleData.model}
                onChange={(e) => setVehicleData({...vehicleData, model: e.target.value})}
                error={formErrors.model}
                helperText={formErrors.model ? 'Model is required' : ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="year"
                label="Year"
                type="number"
                value={vehicleData.year}
                onChange={(e) => setVehicleData({...vehicleData, year: e.target.value ? parseInt(e.target.value) : ''})}
                error={formErrors.year}
                helperText={formErrors.year ? 'Year is required' : ''}
                inputProps={{ min: 1900, max: new Date().getFullYear() }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="licensePlate"
                label="License Plate"
                value={vehicleData.license_plate}
                onChange={(e) => setVehicleData({...vehicleData, license_plate: e.target.value})}
                error={formErrors.licensePlate}
                helperText={formErrors.licensePlate ? 'License plate is required' : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="delegation-mode-label">Delegation Mode</InputLabel>
                <Select
                  labelId="delegation-mode-label"
                  id="delegation-mode"
                  value={vehicleData.delegation_mode}
                  label="Delegation Mode"
                  onChange={(e) => setVehicleData({...vehicleData, delegation_mode: e.target.value as DelegationMode})}
                >
                  <MenuItem value="service_only">Service Only</MenuItem>
                  <MenuItem value="partial">Partial Help</MenuItem>
                  <MenuItem value="full_delegation">Full Delegation</MenuItem>
                </Select>
                <FormHelperText>
                  {vehicleData.delegation_mode === 'full_delegation' 
                    ? 'MrVan will fully manage your vehicle' 
                    : vehicleData.delegation_mode === 'partial' 
                      ? 'You will partially manage your vehicle' 
                      : 'You will manage your vehicle, MrVan provides service only'}
                </FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Please upload the following required documents:
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ border: '1px dashed grey', p: 2, borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Insurance Document
                </Typography>
                <input
                  accept="image/*,application/pdf"
                  style={{ display: 'none' }}
                  id="insurance-file"
                  type="file"
                  onChange={(e) => handleFileChange(e, setInsuranceDoc)}
                />
                <label htmlFor="insurance-file">
                  <Button variant="contained" component="span">
                    Upload Insurance
                  </Button>
                </label>
                {insuranceDoc && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Selected: {insuranceDoc.name}
                  </Typography>
                )}
                {formErrors.insuranceDoc && (
                  <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                    Insurance document is required
                  </Typography>
                )}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ border: '1px dashed grey', p: 2, borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Vehicle Registration
                </Typography>
                <input
                  accept="image/*,application/pdf"
                  style={{ display: 'none' }}
                  id="registration-file"
                  type="file"
                  onChange={(e) => handleFileChange(e, setRegistrationDoc)}
                />
                <label htmlFor="registration-file">
                  <Button variant="contained" component="span">
                    Upload Registration
                  </Button>
                </label>
                {registrationDoc && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Selected: {registrationDoc.name}
                  </Typography>
                )}
                {formErrors.registrationDoc && (
                  <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                    Registration document is required
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Vehicle Information
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Brand:</Typography>
                    <Typography variant="body1">{vehicleData.brand}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Model:</Typography>
                    <Typography variant="body1">{vehicleData.model}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Year:</Typography>
                    <Typography variant="body1">{vehicleData.year}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">License Plate:</Typography>
                    <Typography variant="body1">{vehicleData.license_plate}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Delegation Mode:</Typography>
                    <Typography variant="body1">
                      {vehicleData.delegation_mode === 'full_delegation' 
                        ? 'Full Delegation' 
                        : vehicleData.delegation_mode === 'partial' 
                          ? 'Partial Help' 
                          : 'Service Only'}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Documents
              </Typography>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Insurance:</Typography>
                    <Typography variant="body1">
                      {insuranceDoc ? insuranceDoc.name : 'Not uploaded'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Registration:</Typography>
                    <Typography variant="body1">
                      {registrationDoc ? registrationDoc.name : 'Not uploaded'}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            
            <Grid item xs={12}>
              <Alert severity="info">
                By submitting this information, you confirm that all details are correct. 
                After submission, your vehicle will be reviewed by our team.
              </Alert>
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };
  
  return (
    <Container component="main">
      <Paper elevation={1} sx={{ p: 4, mb: 4 }}>
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Add New Vehicle
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {renderStepContent(activeStep)}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Back
          </Button>
          
          <Box>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Submit'}
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddVehiclePage;
