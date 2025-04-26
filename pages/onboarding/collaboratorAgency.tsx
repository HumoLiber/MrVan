import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import FormInput from '../../components/FormInput';
import FormSelect from '../../components/FormSelect';
import DocumentSigner from '../../components/DocumentSigner';
import Link from 'next/link';

export default function CollaboratorAgencyOnboarding() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [signatureCompleted, setSignatureCompleted] = useState(false);
  const [signatureData, setSignatureData] = useState<string>('');
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [formData, setFormData] = useState({
    agencyName: '',
    registrationNumber: '',
    contactPersonName: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    collaborationType: '',
    yearsInBusiness: '',
  });

  const collaborationOptions = [
    { value: 'rentals', label: 'Rentals' },
    { value: 'marketing', label: 'Marketing & Promotion' },
    { value: 'management', label: 'Shared Management' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'full-service', label: 'Full Service Partnership' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignatureComplete = (data: string) => {
    setSignatureData(data);
    setSignatureCompleted(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting agency data:', { formData, signatureData });
    setRegistrationComplete(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 3000);
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      router.push('/').then(() => router.reload());
    }
  };

  const agencyAgreementContent = (
    <div className="text-sm max-h-96 overflow-y-auto pr-2">
      <h3 className="text-lg font-semibold mb-3">Collaboration Agreement</h3>
      <p className="mb-2">This agreement outlines mutual responsibilities, revenue shares, and service expectations.</p>
      <ul className="list-disc ml-4 mb-4">
        <li>Revenue sharing based on collaboration type</li>
        <li>Agencies must uphold MrVan quality standards</li>
        <li>Quarterly performance evaluations</li>
      </ul>
      <p>By signing, you agree to actively collaborate with MisterVan's network and abide by the guidelines.</p>
    </div>
  );

  return (
    <Layout>
      <Head>
        <title>Collaborator Agency Onboarding | MisterVan</title>
        <meta name="description" content="Become a collaborator agency with MisterVan" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">🏪 Agency Registration</h1>

              <div className="flex justify-between mb-6">
                {[1,2,3].map((step) => (
                  <div key={step} className={`flex flex-col items-center ${step <= currentStep ? 'text-indigo-600' : 'text-gray-400'}`}>
                    <div className={`w-10 h-10 flex items-center justify-center rounded-full ${step <= currentStep ? 'bg-indigo-100' : 'bg-gray-100'} mb-2`}>
                      <span className="text-sm">{step}</span>
                    </div>
                    <span className="text-xs">
                      {step === 1 && 'Agency Details'}
                      {step === 2 && 'Scope'}
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

              {registrationComplete ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Complete!</h2>
                  <p className="text-gray-600 mb-6">Thank you for partnering with MisterVan! You will be redirected to the dashboard shortly.</p>
                  <Link href="/dashboard" className="btn-primary">Go to Dashboard</Link>
                </div>
              ) : (
                <form onSubmit={currentStep === 3 && signatureCompleted ? handleComplete : handleSubmit} className="mt-12">
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <FormInput id="agencyName" name="agencyName" label="Agency Name" value={formData.agencyName} onChange={handleChange} required />
                      <FormInput id="registrationNumber" name="registrationNumber" label="Registration Number" value={formData.registrationNumber} onChange={handleChange} required />
                      <FormInput id="yearsInBusiness" name="yearsInBusiness" type="number" label="Years in Business" value={formData.yearsInBusiness} onChange={handleChange} required />
                      <FormInput id="website" name="website" type="url" label="Website (optional)" value={formData.website} onChange={handleChange} />
                      <FormInput id="contactPersonName" name="contactPersonName" label="Contact Person Name" value={formData.contactPersonName} onChange={handleChange} required />
                      <FormInput id="email" name="email" type="email" label="Email Address" value={formData.email} onChange={handleChange} required />
                      <FormInput id="phone" name="phone" type="tel" label="Phone Number" value={formData.phone} onChange={handleChange} required />
                      <FormInput id="address" name="address" label="Business Address" value={formData.address} onChange={handleChange} required />
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <FormSelect id="collaborationType" name="collaborationType" label="Type of Collaboration" value={formData.collaborationType} onChange={handleChange} options={collaborationOptions} required />
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-4">
                      <DocumentSigner documentTitle="Collaboration Agreement" documentContent={agencyAgreementContent} onSignComplete={handleSignatureComplete} />
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
                    <button type="submit" className={`btn-primary ${(currentStep === 3 && !signatureCompleted) ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={currentStep === 3 && !signatureCompleted}>
                      {currentStep < 3 ? 'Continue' : 'Complete'}
                    </button>
                  </div>
                </form>
              )}
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
}
