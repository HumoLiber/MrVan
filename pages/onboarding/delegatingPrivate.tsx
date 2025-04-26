import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useState } from 'react';
import FormInput from '../../components/FormInput';
import Layout from '../../components/Layout';
import DocumentSigner from '../../components/DocumentSigner';
import { useRouter } from 'next/router';

export default function DelegatingPrivateOnboarding() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [signatureCompleted, setSignatureCompleted] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    idNumber: '',
    camperMake: '',
    camperModel: '',
    camperYear: '',
    camperPlate: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignatureComplete = (data: string) => {
    setSignatureCompleted(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 4) {
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
      <h3 className="text-lg font-semibold mb-3">Private Delegation Agreement</h3>
      <p className="mb-2">This agreement authorizes MisterVan to manage your camper on your behalf, including rentals, maintenance, and client communications.</p>
      <p>By signing, you agree to full delegation terms and revenue share as outlined by MisterVan policies.</p>
    </div>
  );

  return (
    <Layout>
      <Head>
        <title>Private Owner Onboarding | MrVan</title>
        <meta name="description" content="Register your private camper with MrVan" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">🚐 Private Owner Registration</h1>

              <div className="flex justify-between mb-6">
                {[1,2,3,4].map((step) => (
                  <div key={step} className={`flex flex-col items-center ${step <= currentStep ? 'text-indigo-600' : 'text-gray-400'}`}>
                    <div className={`w-10 h-10 flex items-center justify-center rounded-full ${step <= currentStep ? 'bg-indigo-100' : 'bg-gray-100'} mb-2`}>
                      <span className="text-sm">{step}</span>
                    </div>
                    <span className="text-xs">
                      {step === 1 && 'Profile'}
                      {step === 2 && 'Camper'}
                      {step === 3 && 'Agreement'}
                      {step === 4 && 'Phone Verify'}
                    </span>
                  </div>
                ))}
              </div>

              <div className="relative mt-2 ">
                  <div className="absolute top-0 h-1 w-full bg-gray-200 rounded"></div>
                  <div 
                    className="absolute top-0 h-1 bg-indigo-600 rounded transition-all duration-300" 
                    style={{ width: `${(currentStep - 1) * 33.33}%` }}
                  ></div>
                </div>

              <form onSubmit={handleSubmit} className="mt-12">
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-indigo-600 mb-4">Personal Information</h2>
                    <FormInput id="fullName" name="fullName" label="Full Name" value={formData.fullName} onChange={handleChange} required />
                    <FormInput id="email" name="email" type="email" label="Email Address" value={formData.email} onChange={handleChange} required />
                    <FormInput id="phone" name="phone" type="tel" label="Phone Number" value={formData.phone} onChange={handleChange} required />
                    <FormInput id="address" name="address" label="Home Address" value={formData.address} onChange={handleChange} required />
                    <FormInput id="idNumber" name="idNumber" label="ID/Passport Number" value={formData.idNumber} onChange={handleChange} required />
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-indigo-600 mb-4">Camper Information</h2>
                    <FormInput id="camperMake" name="camperMake" label="Camper Make" value={formData.camperMake} onChange={handleChange} required />
                    <FormInput id="camperModel" name="camperModel" label="Camper Model" value={formData.camperModel} onChange={handleChange} required />
                    <FormInput id="camperYear" name="camperYear" type="number" label="Year of Manufacture" value={formData.camperYear} onChange={handleChange} required />
                    <FormInput id="camperPlate" name="camperPlate" label="License Plate" value={formData.camperPlate} onChange={handleChange} required />
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4">
                    <DocumentSigner documentTitle="Delegation Agreement" documentContent={agreementContent} onSignComplete={handleSignatureComplete} />
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

                {currentStep === 4 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-indigo-600 mb-4">Phone Verification</h2>
                    <p className="text-gray-600">Enter the OTP code sent to your phone:</p>
                    <FormInput id="otpCode" name="otpCode" label="OTP Code" value={otpCode} onChange={(e) => setOtpCode(e.target.value)} required />
                  </div>
                )}

                <div className="mt-8 flex items-center justify-between">
                  <button type="button" onClick={goBack} className="btn-secondary">Back</button>
                  <button type="submit" className={`btn-primary ${(currentStep === 3 && !signatureCompleted) ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={currentStep === 3 && !signatureCompleted}>
                    {currentStep < 4 ? 'Continue' : 'Complete'}
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
