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
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function InvestorOnboarding() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    companyName: '',
    taxId: '',
    investmentAmount: 15000,
  });
  const [uploadedDocuments, setUploadedDocuments] = useState<Array<{name: string, url: string}>>([]);
  const [calculationResult, setCalculationResult] = useState<InvestmentCalculationResult | null>(null);
  const [signatureCompleted, setSignatureCompleted] = useState(false);
  const [signatureData, setSignatureData] = useState<string>('');
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleComplete = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Тут буде логіка збереження даних до Supabase або іншої бази даних
      console.log('Submitting final data:', {
        formData,
        uploadedDocuments,
        calculationResult,
        signatureData
      });
      
      // Імітуємо запит до сервера
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Позначаємо реєстрацію як завершену
      setRegistrationComplete(true);
      
      // Через 3 секунди перенаправляємо на головну сторінку або дешборд
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      // На першому кроці переходимо на сторінку вибору ролі
      router.push('/signup');
    }
  };

  // Розширений контент договору інвестора
  const investorAgreementContent = (
    <div className="text-sm max-h-96 overflow-y-auto pr-2">
      <h3 className="text-lg font-semibold mb-3">Investment Agreement</h3>
      <p className="mb-2">This Investor Agreement (&quot;Agreement&quot;) is entered into between:</p>
      <p className="mb-4"><strong>MrVan B.V.</strong> (&quot;Company&quot;), a company registered in Spain, and {formData.fullName || "Investor"} (&quot;Investor&quot;)</p>
      
      <h4 className="font-semibold mt-4 mb-2">1. Investment Amount</h4>
      <p className="mb-3">The Investor agrees to invest €{formData.investmentAmount.toLocaleString()} in the Company&apos;s campervan fleet expansion project.</p>
      
      <h4 className="font-semibold mt-4 mb-2">2. Expected Returns</h4>
      <p className="mb-3">Based on the investment calculator projections, the expected annual return is {calculationResult?.roiPercentage.toFixed(1)}%, resulting in a monthly income of approximately €{calculationResult?.monthlyIncome.toFixed(0)}.</p>
      
      <h4 className="font-semibold mt-4 mb-2">3. Investment Term</h4>
      <p className="mb-3">The minimum investment term is 12 months from the date of fund transfer. Early withdrawal may be subject to penalties as outlined in section 7.</p>
      
      <h4 className="font-semibold mt-4 mb-2">4. Payment Schedule</h4>
      <p className="mb-3">Returns will be paid monthly to the Investor&apos;s designated bank account. Payments will be processed on the 15th day of each month, or the next business day if the 15th falls on a weekend or holiday.</p>
      
      <h4 className="font-semibold mt-4 mb-2">5. Risk Disclosure</h4>
      <p className="mb-3">The Investor acknowledges that all investments carry inherent risks, and past performance is not indicative of future results. The Company does not guarantee returns, and the Investor may lose part or all of their investment.</p>
      
      <h4 className="font-semibold mt-4 mb-2">6. Governing Law</h4>
      <p className="mb-3">This Agreement shall be governed by the laws of Spain. Any disputes arising from this Agreement shall be resolved through arbitration in Madrid, Spain.</p>
      
      <h4 className="font-semibold mt-4 mb-2">7. Early Termination</h4>
      <p className="mb-3">If the Investor wishes to terminate this Agreement before the minimum investment term of 12 months, the following penalties will apply:</p>
      <ul className="list-disc list-inside mb-3 ml-4">
        <li>Termination within 0-3 months: 10% of the investment amount</li>
        <li>Termination within 4-6 months: 7% of the investment amount</li>
        <li>Termination within 7-9 months: 5% of the investment amount</li>
        <li>Termination within 10-12 months: 3% of the investment amount</li>
      </ul>
      
      <h4 className="font-semibold mt-4 mb-2">8. Company Obligations</h4>
      <p className="mb-3">The Company agrees to:</p>
      <ul className="list-disc list-inside mb-3 ml-4">
        <li>Use the investment funds solely for the purpose of expanding and maintaining its campervan fleet</li>
        <li>Provide quarterly reports on the performance of the investment</li>
        <li>Maintain appropriate insurance coverage for all vehicles</li>
        <li>Ensure proper management and maintenance of all vehicles</li>
      </ul>
      
      <h4 className="font-semibold mt-4 mb-2">9. Investor Rights</h4>
      <p className="mb-3">The Investor shall have the right to:</p>
      <ul className="list-disc list-inside mb-3 ml-4">
        <li>Receive monthly returns as specified in this Agreement</li>
        <li>Access quarterly performance reports</li>
        <li>Terminate the Agreement subject to the conditions in section 7</li>
        <li>Transfer the investment to another party with prior written approval from the Company</li>
      </ul>
      
      <h4 className="font-semibold mt-4 mb-2">10. Confidentiality</h4>
      <p className="mb-3">Both parties agree to maintain the confidentiality of all information exchanged in relation to this Agreement, except as required by law or regulatory authorities.</p>
      
      <h4 className="font-semibold mt-4 mb-2">11. Amendments</h4>
      <p className="mb-3">Any amendments to this Agreement must be made in writing and signed by both parties.</p>
      
      <h4 className="font-semibold mt-4 mb-2">12. Entire Agreement</h4>
      <p className="mb-3">This Agreement constitutes the entire understanding between the parties concerning the subject matter hereof and supersedes all prior agreements, understandings, or negotiations.</p>
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
              <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">
                💼 Investor Registration
              </h1>
              
              <p className="text-center text-gray-600 mb-4 max-w-2xl mx-auto">
                Join our community of investors and earn attractive returns by investing in our premium campervan fleet. 
                Calculate your potential earnings, provide your details, and start your investment journey with MrVan.
              </p>
              <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto font-medium">
                Note: After signing the agreement, our platform will contact you with payment instructions. No payment is required during registration. 
                You will only make a payment after our team reviews and countersigns your agreement.
              </p>
              
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

              {registrationComplete ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Complete!</h2>
                  <p className="text-gray-600 mb-4">
                    Thank you for registering as an investor with MrVan. We've received your information and will contact you shortly to finalize your investment.
                  </p>
                  <p className="text-gray-600 mb-6">
                    Our team will review your application and contact you with payment instructions. You will only need to make a payment after we've approved and countersigned your agreement.
                  </p>
                  <p className="text-gray-600 mb-6">
                    You will be redirected to your dashboard in a few seconds...
                  </p>
                  <div className="flex justify-center">
                    <Link href="/dashboard" className="btn-primary">
                      Go to Dashboard
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={currentStep === 4 && signatureCompleted ? handleComplete : handleSubmit}>
                  {/* Step 1: Investment Details & Calculator */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-semibold text-indigo-600 mb-4">Investment Details</h2>
                      
                      <InvestmentCalculator onCalculate={handleInvestmentCalculation} />
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
                  {currentStep === 1 ? (
                    <Link href="/signup" className="text-blue-500 hover:text-blue-700">
                      {t('back_to_signup')}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={goBack}
                      className="btn-secondary"
                    >
                      Back
                    </button>
                  )}
                  
                  <button
                    type="submit"
                    className={`btn-primary ${
                      (currentStep === 4 && !signatureCompleted) || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={(currentStep === 4 && !signatureCompleted) || isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : currentStep < 3 ? 'Continue' : currentStep === 3 ? 'Next' : 'Complete'}
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
};