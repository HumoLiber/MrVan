import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import FormInput from '../../components/FormInput';
import FormRadioGroup from '../../components/FormRadioGroup';
import FormCheckbox from '../../components/FormCheckbox';
import Layout from '../../components/Layout';
import { useRouter } from 'next/router';

export default function CompanyInfoOnboarding() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [formData, setFormData] = useState({
    companyName: '',
    registrationNumber: '',
    contactPersonName: '',
    email: '',
    phone: '',
    address: '',
    delegationModel: '',
    agreeToModernize: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Load saved data from localStorage if available
  useEffect(() => {
    const savedData = localStorage.getItem('companyRegistrationData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(prevData => ({
          ...prevData,
          ...parsedData
        }));
      } catch (e) {
        console.error('Error parsing saved data:', e);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setFormError(null);
    setIsSubmitting(true);
    
    try {
      // Validate required fields
      if (!formData.delegationModel) {
        throw new Error('Please select a delegation model');
      }
      
      if (!formData.agreeToModernize) {
        throw new Error('You must agree to modernize your fleet by MisterVan Equipment');
      }
      
      // Save company data to localStorage for the next step
      localStorage.setItem('companyRegistrationData', JSON.stringify(formData));
      
      // Redirect to camper information page
      router.push('/onboarding/camperInfo');
    } catch (error) {
      console.error('Error saving form data:', error);
      setFormError(error instanceof Error ? error.message : 'An error occurred while saving your data. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const delegationOptions = [
    { 
      value: 'service-only', 
      label: 'Service Only', 
      description: 'We provide maintenance and repair services for your camper fleet while you handle all bookings and customer interactions.'
    },
    { 
      value: 'partial-help', 
      label: 'Partial Help', 
      description: 'We handle maintenance, repairs, and some customer service aspects, while you maintain control over bookings and primary customer relationships.'
    },
    { 
      value: 'full-delegation', 
      label: 'Full Delegation', 
      description: 'We manage everything from maintenance and repairs to bookings and customer service, allowing you to focus on other aspects of your business.'
    },
  ];

  return (
    <Layout>
      <Head>
        <title>Company Information | MrVan</title>
        <meta name="description" content="Register your company with MrVan" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="py-20">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
                🏢 Company Registration
              </h1>
              <p className="text-gray-600 mb-8 text-center">
                Register your company with MrVan.
              </p>
              
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-indigo-600 mt-6 mb-4">Company Information</h2>
                  
                  <FormInput
                    id="companyName"
                    name="companyName"
                    label="Company Name"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                  />
                  
                  <FormInput
                    id="registrationNumber"
                    name="registrationNumber"
                    label="Registration Number"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    required
                  />
                  
                  <FormInput
                    id="contactPersonName"
                    name="contactPersonName"
                    label="Contact Person Name"
                    value={formData.contactPersonName}
                    onChange={handleChange}
                    required
                  />
                  
                  <FormInput
                    id="email"
                    name="email"
                    type="email"
                    label="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  
                  <FormInput
                    id="phone"
                    name="phone"
                    type="tel"
                    label="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                  
                  <FormInput
                    id="address"
                    name="address"
                    label="Business Address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                  
                  <h2 className="text-xl font-semibold text-indigo-600 mt-8 mb-4">Delegation Model</h2>
                  
                  <FormRadioGroup
                    id="delegationModel"
                    name="delegationModel"
                    label="Select a Delegation Model"
                    value={formData.delegationModel}
                    onChange={handleChange}
                    options={delegationOptions}
                    required
                  />
                  
                  <div className="mt-6">
                    <FormCheckbox
                      id="agreeToModernize"
                      name="agreeToModernize"
                      label="I agree to update and modernize my fleet by MisterVan Equipment"
                      checked={formData.agreeToModernize}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="btn-secondary"
                    disabled={isSubmitting}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Continue to Camper Info'}
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
