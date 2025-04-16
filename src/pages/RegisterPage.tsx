import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Container, 
  TextField, 
  Typography, 
  Link,
  Paper,
  Grid,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormLabel,
  Alert,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useSupabase } from '../context/SupabaseContext';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { supabase } = useSupabase();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState<'private' | 'company'>('private');
  const [companyName, setCompanyName] = useState('');
  const [taxId, setTaxId] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    if (userType === 'company' && (!companyName || !taxId)) {
      setError('Company name and tax ID are required for company registration');
      return;
    }
    
    setLoading(true);
    
    try {
      // Register user with Supabase Auth
      const { user, error: signUpError } = await signUp({
        email,
        password,
        userType,
        companyName,
        taxId
      });
      
      if (signUpError) throw signUpError;
      
      if (user) {
        // If registration successful, create profile in database
        const userId = user.id;
        
        if (userId) {
          // Create profile based on user type
          if (userType === 'company') {
            // Create company record
            const { error: companyError } = await supabase
              .from('companies')
              .insert([
                { 
                  name: companyName, 
                  tax_id: taxId,
                  status: 'pending'
                }
              ]);
              
            if (companyError) throw companyError;
          }
          
          setSuccess('Registration successful! Please check your email to confirm your account.');
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        }
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Register as a MrVan Partner
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <FormControl component="fieldset" sx={{ mb: 2 }}>
            <FormLabel component="legend">I am registering as a:</FormLabel>
            <RadioGroup
              row
              name="user-type"
              value={userType}
              onChange={(e) => setUserType(e.target.value as 'private' | 'company')}
            >
              <FormControlLabel value="private" control={<Radio />} label="Private Person" />
              <FormControlLabel value="company" control={<Radio />} label="Company" />
            </RadioGroup>
          </FormControl>
          
          {userType === 'company' && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Company Name"
                  name="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Tax ID / Registration Number"
                  name="taxId"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                />
              </Grid>
            </Grid>
          )}
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Register'}
          </Button>
          
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link component={RouterLink} to="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
