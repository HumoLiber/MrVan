import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import FormInput from '../../components/FormInput';
import Layout from '../../components/Layout';
import supabase from '../../lib/supabase';
import { useRouter } from 'next/router';

export default function CamperInfoOnboarding() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [companyData, setCompanyData] = useState({
    companyName: '',
    registrationNumber: '',
    contactPersonName: '',
    email: '',
    phone: '',
    address: '',
    delegationModel: '',
    agreeToModernize: false,
  });
  const [formData, setFormData] = useState({
    camperMake: '',
    camperModel: '',
    camperYear: '',
    camperPlate: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Load saved company data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('companyRegistrationData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setCompanyData(parsedData);
      } catch (e) {
        console.error('Error parsing saved company data:', e);
        // Redirect back to company info if data is missing
        router.push('/onboarding/companyInfo');
      }
    } else {
      // Redirect back to company info if no data is found
      router.push('/onboarding/companyInfo');
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset statuses
    setFormError(null);
    setFormSuccess(null);
    setIsSubmitting(true);
    
    try {
      // 1. Save company data to users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([{
          email: companyData.email,
          name: companyData.contactPersonName,
          role: 'company',
          phone: companyData.phone,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select('id')
        .single();
      
      if (userError) {
        throw new Error(`Error saving company data: ${userError.message}`);
      }
      
      const userId = userData.id;
      console.log('Company successfully registered with ID:', userId);
      
      // 2. Create vehicle
      const { data: vehicleData, error: vehicleError } = await supabase
        .from('vehicles')
        .insert([{
          owner_id: userId,
          make: formData.camperMake,
          model: formData.camperModel,
          year: parseInt(formData.camperYear) || new Date().getFullYear(),
          plate: formData.camperPlate,
          delegation_model: companyData.delegationModel.replace('-', '_'), // convert 'service-only' to 'service_only'
          modernize_agreed: companyData.agreeToModernize,
          status: 'draft',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select('id')
        .single();
      
      if (vehicleError) {
        throw new Error(`Error saving vehicle data: ${vehicleError.message}`);
      }
      
      console.log('Vehicle successfully registered with ID:', vehicleData.id);
      
      // 3. Create agreement for signing
      const { data: agreementData, error: agreementError } = await supabase
        .from('agreements')
        .insert([{
          user_id: userId,
          agreement_type: `company_${companyData.delegationModel}`,
          signature_status: 'pending',
          created_at: new Date().toISOString()
        }])
        .select('id');
      
      if (agreementError) {
        console.warn('Warning: failed to create agreement:', agreementError);
      }
      
      // Success! Show message and redirect
      setFormSuccess('Data successfully saved! Redirecting to the next step...');
      
      // Clear localStorage after successful submission
      localStorage.removeItem('companyRegistrationData');
      
      // Delay before redirect
      setTimeout(() => {
        router.push('/onboarding/success');
      }, 2000);
      
    } catch (error) {
      console.error('Error processing form:', error);
      setFormError(error instanceof Error ? error.message : 'An unknown error occurred while saving data');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Camper Information | MrVan</title>
        <meta name="description" content="Register your camper fleet with MrVan" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="py-20">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
                🚐 Camper Registration
              </h1>
              <p className="text-gray-600 mb-8 text-center">
                Register your camper fleet with MrVan.
              </p>
              
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
                  {formError}
                </div>
              )}
              
              {formSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-4">
                  {formSuccess}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-indigo-600 mt-6 mb-4">Camper Information</h2>
                  
                  <FormInput
                    id="camperMake"
                    name="camperMake"
                    label="Camper Make"
                    value={formData.camperMake}
                    onChange={handleChange}
                    required
                  />
                  
                  <FormInput
                    id="camperModel"
                    name="camperModel"
                    label="Camper Model"
                    value={formData.camperModel}
                    onChange={handleChange}
                    required
                  />
                  
                  <FormInput
                    id="camperYear"
                    name="camperYear"
                    type="number"
                    label="Year of Manufacture"
                    value={formData.camperYear}
                    onChange={handleChange}
                    required
                  />
                  
                  <FormInput
                    id="camperPlate"
                    name="camperPlate"
                    label="License Plate"
                    value={formData.camperPlate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => router.push('/onboarding/companyInfo')}
                    className="btn-secondary"
                    disabled={isSubmitting}
                  >
                    Back to Company Info
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Complete Registration'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
};
