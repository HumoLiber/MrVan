import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useState } from 'react';
import Layout from '../../components/Layout';
import DocumentUploader from '../../components/DocumentUploader';
import InvestmentCalculator, { InvestmentCalculationResult } from '../../components/InvestmentCalculator';
import DocumentSigner from '../../components/DocumentSigner';
import { FormEvent } from 'react';

export default function InvestorOnboarding() {
  const { t } = useTranslation('common');
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    companyName: '',
    taxId: '',
    investmentAmount: 30000,
    investmentCountry: 'spain',
    fundsOriginCountry: '',
    additionalNotes: '',
  });
  const [uploadedDocuments, setUploadedDocuments] = useState<Array<{name: string, url: string}>>([]);
  const [calculationResult, setCalculationResult] = useState<InvestmentCalculationResult | null>(null);
  const [signatureCompleted, setSignatureCompleted] = useState(false);
  const [signatureData, setSignatureData] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDocumentUpload = (documents: Array<{name: string, url: string}>) => {
    setUploadedDocuments([...uploadedDocuments, ...documents]);
  };

  const handleInvestmentCalculation = (result: InvestmentCalculationResult) => {
    setCalculationResult(result);
    setFormData({
      ...formData,
      investmentAmount: result.investmentAmount
    });
  };

  const handleSignatureComplete = (data: string) => {
    setSignatureData(data);
    setSignatureCompleted(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Тут буде логіка збереження даних до Supabase
    console.log({
      formData,
      uploadedDocuments,
      calculationResult,
      signatureData
    });
    // Перехід на наступний крок
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Контент договору інвестора (приклад)
  const investorAgreementContent = (
    <div>
      <h3 className="text-lg font-semibold mb-3">Investment Agreement</h3>
      <p className="mb-2">This Investor Agreement ("Agreement") is entered into between:</p>
      <p className="mb-4"><strong>MrVan B.V.</strong> ("Company"), a company registered in Spain, and {formData.fullName || "Investor"} ("Investor")</p>
      
      <h4 className="font-semibold mt-4 mb-2">1. Investment Amount</h4>
      <p className="mb-3">The Investor agrees to invest €{formData.investmentAmount.toLocaleString()} in the Company's campervan fleet expansion project.</p>
      
      <h4 className="font-semibold mt-4 mb-2">2. Expected Returns</h4>
      <p className="mb-3">Based on the investment calculator projections, the expected annual return is {calculationResult?.roiPercentage.toFixed(1)}%, resulting in a monthly income of approximately €{calculationResult?.monthlyIncome.toFixed(0)}.</p>
      
      <h4 className="font-semibold mt-4 mb-2">3. Investment Term</h4>
      <p className="mb-3">The minimum investment term is 12 months from the date of fund transfer.</p>
      
      <h4 className="font-semibold mt-4 mb-2">4. Payment Schedule</h4>
      <p className="mb-3">Returns will be paid monthly to the Investor's designated bank account.</p>
      
      <h4 className="font-semibold mt-4 mb-2">5. Risk Disclosure</h4>
      <p className="mb-3">The Investor acknowledges that all investments carry inherent risks, and past performance is not indicative of future results.</p>
      
      <h4 className="font-semibold mt-4 mb-2">6. Governing Law</h4>
      <p className="mb-3">This Agreement shall be governed by the laws of Spain.</p>
    </div>
  );

  return (
    <Layout>
      <Head>
        <title>Investor Onboarding | MrVan</title>
        <meta name="description" content="Join MrVan as an investor and earn returns on campervan investments" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
                💼 Investor Registration
              </h1>
              
              {/* Progress Indicator */}
              <div className="mb-8">
                <div className="flex justify-between">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`flex flex-col items-center ${
                        step <= currentStep ? 'text-indigo-600' : 'text-gray-400'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 flex items-center justify-center rounded-full ${
                          step <= currentStep ? 'bg-indigo-100' : 'bg-gray-100'
                        } mb-2`}
                      >
                        {step < currentStep ? (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        ) : (
                          <span className="text-sm">{step}</span>
                        )}
                      </div>
                      <span className="text-xs">
                        {step === 1 && 'Investment Details'}
                        {step === 2 && 'Personal Info'}
                        {step === 3 && 'Document Upload'}
                        {step === 4 && 'Sign Agreement'}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="relative mt-2">
                  <div className="absolute top-0 h-1 w-full bg-gray-200 rounded"></div>
                  <div 
                    className="absolute top-0 h-1 bg-indigo-600 rounded transition-all duration-300" 
                    style={{ width: `${(currentStep - 1) * 33.33}%` }}
                  ></div>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Step 1: Investment Details & Calculator */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-indigo-600 mb-4">Investment Details</h2>
                    
                    <InvestmentCalculator onCalculate={handleInvestmentCalculation} />
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Notes (Optional)
                      </label>
                      <textarea
                        name="additionalNotes"
                        value={formData.additionalNotes}
                        onChange={handleChange}
                        rows={3}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Any additional details about your investment goals or questions"
                      ></textarea>
                    </div>
                  </div>
                )}

                {/* Step 2: Personal Information */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-indigo-600 mb-4">Personal Information</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          required
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Company Name (if applicable)
                        </label>
                        <input
                          type="text"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleChange}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tax ID / VAT Number
                        </label>
                        <input
                          type="text"
                          name="taxId"
                          value={formData.taxId}
                          onChange={handleChange}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Document Upload */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-indigo-600 mb-4">Document Upload</h2>
                    
                    <p className="text-gray-600 mb-4">
                      Please upload the following documents to verify your identity and investment capacity:
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-md font-medium mb-2">Required Documents:</h3>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                          <li>Proof of Identity (Passport or ID card)</li>
                          <li>Proof of Address (Utility bill, bank statement, etc.)</li>
                          <li>Proof of Funds (Bank statement, investment portfolio, etc.)</li>
                        </ul>
                      </div>
                      
                      <DocumentUploader onUpload={handleDocumentUpload} />
                      
                      {uploadedDocuments.length > 0 && (
                        <div>
                          <h3 className="text-md font-medium mb-2">Uploaded Documents:</h3>
                          <ul className="space-y-1">
                            {uploadedDocuments.map((doc, index) => (
                              <li key={index} className="flex items-center text-green-600">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                {doc.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 4: Sign Agreement */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-indigo-600 mb-4">Sign Agreement</h2>
                    
                    <DocumentSigner
                      documentTitle="Investor Agreement"
                      documentContent={investorAgreementContent}
                      onSignComplete={handleSignatureComplete}
                    />

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
                  <button
                    type="button"
                    onClick={goBack}
                    className={`btn-secondary ${currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={currentStep === 1}
                  >
                    Back
                  </button>
                  
                  <button
                    type={currentStep === 4 && signatureCompleted ? 'submit' : 'button'}
                    onClick={currentStep < 4 ? handleSubmit : undefined}
                    className={`btn-primary ${
                      currentStep === 4 && !signatureCompleted ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={currentStep === 4 && !signatureCompleted}
                  >
                    {currentStep < 3 ? 'Continue' : currentStep === 3 ? 'Next' : 'Complete'}
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