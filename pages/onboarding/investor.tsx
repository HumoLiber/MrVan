import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useState } from 'react';
import FormInput from '../../app/components/FormInput';
import FormSelect from '../../app/components/FormSelect';
import Layout from '../../app/components/Layout';

export default function InvestorOnboarding() {
  const { t } = useTranslation('common');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    investmentAmount: '',
    region: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Тут буде обробка форми
    console.log(formData);
  };

  const regionOptions = [
    { value: 'europe', label: 'Europe' },
    { value: 'north-america', label: 'North America' },
    { value: 'latin-america', label: 'Latin America' },
    { value: 'asia', label: 'Asia' },
    { value: 'oceania', label: 'Oceania' },
    { value: 'middle-east', label: 'Middle East' },
    { value: 'africa', label: 'Africa' },
  ];

  return (
    <Layout>
      <Head>
        <title>Investor Onboarding | MrVan</title>
        <meta name="description" content="Register as an investor with MrVan" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="py-20">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
                💼 Investor Registration
              </h1>
              <p className="text-gray-600 mb-8 text-center">
                Fill in the form below to register as an investor with MrVan.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <FormInput
                    id="fullName"
                    name="fullName"
                    label="Full Name"
                    value={formData.fullName}
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
                    id="companyName"
                    name="companyName"
                    label="Company Name (if applicable)"
                    value={formData.companyName}
                    onChange={handleChange}
                  />
                  
                  <FormInput
                    id="investmentAmount"
                    name="investmentAmount"
                    label="Approximate Investment Amount (€)"
                    type="number"
                    value={formData.investmentAmount}
                    onChange={handleChange}
                    required
                  />
                  
                  <FormSelect
                    id="region"
                    name="region"
                    label="Region of Interest"
                    value={formData.region}
                    onChange={handleChange}
                    options={regionOptions}
                    required
                  />
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="btn-secondary"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Continue
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