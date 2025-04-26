import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useState } from 'react';
import Layout from '../../components/Layout';
import FormInput from '../../components/FormInput';
import FormSelect from '../../components/FormSelect';
import DocumentSigner from '../../components/DocumentSigner';
import { useRouter } from 'next/router';

export default function VehicleModernizationOnboarding() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [signatureCompleted, setSignatureCompleted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    camperMake: '',
    camperModel: '',
    camperYear: '',
    requestedUpgrades: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignatureComplete = (data: string) => {
    setSignatureCompleted(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    } else {
      router.push('/dashboard');
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      router.push('/');
    }
  };

  const agreementContent = (
    <div className="text-sm max-h-96 overflow-y-auto pr-2">
      <h3 className="text-lg font-semibold mb-3">Modernization Request Agreement</h3>
      <p className="mb-2">This agreement authorizes MisterVan to install requested upgrades or modifications to your camper according to the specifications you provide.</p>
      <p>By signing, you agree to cover associated costs and adhere to maintenance and warranty terms.</p>
    </div>
  );

  return (
    <Layout>
      <Head>
        <title>Vehicle Modernization | MrVan</title>
        <meta name="description" content="Request upgrades for your camper with MrVan" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">🔧 Vehicle Modernization</h1>

              <div className="flex justify-between mb-6">
                {[1,2,3].map((step) => (
                  <div key={step} className={`flex flex-col items-center ${step <= currentStep ? 'text-indigo-600' : 'text-gray-400'}`}>
                    <div className={`w-10 h-10 flex items-center justify-center rounded-full ${step <= currentStep ? 'bg-indigo-100' : 'bg-gray-100'} mb-2`}>
                      <span className="text-sm">{step}</span>
                    </div>
                    <span className="text-xs">
                      {step === 1 && 'Owner Info'}
                      {step === 2 && 'Upgrades'}
                      {step === 3 && 'Agreement'}
                    </span>
                  </div>
                ))}
              </div>

              <div className="relative mt-2 ">
                  <div className="absolute top-0 h-1 w-full bg-gray-200 rounded"></div>
                  <div 
                    className="absolute top-0 h-1 bg-indigo-600 rounded transition-all duration-300" 
                    style={{ width: `${(currentStep - 1) * 50}%` }}
                  ></div>
                </div>

              <form onSubmit={handleSubmit} className="mt-12">
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-indigo-600 mb-4">Personal Information</h2>
                    <FormInput id="fullName" name="fullName" label="Full Name" value={formData.fullName} onChange={handleChange} required />
                    <FormInput id="email" name="email" type="email" label="Email Address" value={formData.email} onChange={handleChange} required />
                    <FormInput id="phone" name="phone" type="tel" label="Phone Number" value={formData.phone} onChange={handleChange} required />
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-indigo-600 mb-4">Camper Details</h2>
                    <FormInput id="camperMake" name="camperMake" label="Camper Make" value={formData.camperMake} onChange={handleChange} required />
                    <FormInput id="camperModel" name="camperModel" label="Camper Model" value={formData.camperModel} onChange={handleChange} required />
                    <FormInput id="camperYear" name="camperYear" type="number" label="Year of Manufacture" value={formData.camperYear} onChange={handleChange} required />
                    <FormInput id="requestedUpgrades" name="requestedUpgrades" label="Requested Upgrades (list)" value={formData.requestedUpgrades} onChange={handleChange} required />
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4">
                    <DocumentSigner documentTitle="Modernization Agreement" documentContent={agreementContent} onSignComplete={handleSignatureComplete} />
                    <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-md">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span className="font-medium">Important:</span>
                        <span className="ml-1">Signing this agreement doesn't require immediate payment. Our team will review your application and contact you with payment instructions after approval.</span>
                      </div>
                    </div>

                    {signatureCompleted && (
                      <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Document signed successfully!
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-8 flex items-center justify-between">
                  <button type="button" onClick={goBack} className="btn-secondary">Back</button>
                  <button type="submit" className={`btn-primary ${currentStep === 3 && !signatureCompleted ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={currentStep === 3 && !signatureCompleted}>
                    {currentStep < 3 ? 'Continue' : 'Complete'}
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
